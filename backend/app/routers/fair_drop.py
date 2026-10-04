"""Fair Drop API endpoints.

Sessions are stored in memory (MVP). Monitoring starts only once a session
is created via POST /api/fair-drop/session.
"""

import random
import time
import uuid

from fastapi import APIRouter, HTTPException

from app.schemas.fair_drop import (
    BehaviorEventRequest,
    BehaviorEventResponse,
    CaptchaRequest,
    CaptchaResponse,
    ReserveRequest,
    ReserveResponse,
    RiskRequest,
    RiskResponse,
    SessionCreateRequest,
    SessionCreateResponse,
)
from app.services import behavior_analyzer, request_tracker, risk_engine

router = APIRouter(prefix="/api/fair-drop", tags=["fair-drop"])

# session_id -> session dict
sessions: dict[str, dict] = {}

# Seats already reserved (in memory). Seats pre-marked unavailable in the
# app's seat map are also included here.
reserved_seats: set[str] = {"A3", "B2", "C4", "D1", "D5"}

# Decision -> session status
STATUS_FOR_DECISION = {"ALLOW": "ALLOWED", "VERIFY": "VERIFY", "BLOCK": "BLOCKED"}


def _get_session(session_id: str, device_id: str) -> dict:
    """Look up a session and count this request against it."""
    session = sessions.get(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Fair Drop session not found")
    request_tracker.track_request(session_id, device_id)
    session["request_count"] += 1
    return session


@router.post("/session", response_model=SessionCreateResponse)
def create_session(body: SessionCreateRequest):
    session_id = str(uuid.uuid4())
    sessions[session_id] = {
        "session_id": session_id,
        "event_id": body.event_id,
        "device_id": body.device_id,
        "seat_count": body.seat_count,
        "seat_type": body.seat_type,
        "created_at": time.time(),
        "request_count": 0,
        "captcha_verified": False,
        "captcha_failures": 0,
        "captcha_solve_ms": None,
        "risk_score": 0,
        "status": "ACTIVE",
    }
    return SessionCreateResponse(
        session_id=session_id,
        stage="SEAT_SELECTION",
        status="verification_required",
        session_status="ACTIVE",
    )


@router.post("/captcha", response_model=CaptchaResponse)
def verify_captcha(body: CaptchaRequest):
    session = _get_session(body.session_id, body.device_id)
    correct = body.num_a + body.num_b == body.answer

    if correct:
        session["captcha_verified"] = True
        session["captcha_solve_ms"] = body.solve_time_ms
        message = "Verification successful"
    else:
        session["captcha_failures"] += 1
        message = "Incorrect answer, please try again"

    return CaptchaResponse(
        session_id=body.session_id,
        verified=correct,
        attempts=session["captcha_failures"] + (1 if correct else 0),
        message=message,
    )


@router.post("/event", response_model=BehaviorEventResponse)
def track_event(body: BehaviorEventRequest):
    _get_session(body.session_id, body.device_id)
    total = behavior_analyzer.record_event(body.session_id, body.model_dump())
    return BehaviorEventResponse(
        session_id=body.session_id, recorded=True, total_events=total
    )


@router.post("/risk", response_model=RiskResponse)
def get_risk(body: RiskRequest):
    session = _get_session(body.session_id, body.device_id)
    score, decision, reasons = risk_engine.calculate_risk(session, body.device_id)
    session["risk_score"] = score
    return RiskResponse(
        session_id=body.session_id,
        risk_score=score,
        decision=decision,
        reasons=reasons,
    )


@router.post("/reserve", response_model=ReserveResponse)
def reserve(body: ReserveRequest):
    session = _get_session(body.session_id, body.device_id)

    if len(body.seats) != session["seat_count"]:
        raise HTTPException(
            status_code=400,
            detail=f"Please select exactly {session['seat_count']} seat(s)",
        )
    taken = [s for s in body.seats if s in reserved_seats]
    if taken:
        raise HTTPException(
            status_code=409, detail=f"Seat(s) already taken: {', '.join(taken)}"
        )

    score, decision, reasons = risk_engine.calculate_risk(session, body.device_id)
    session["risk_score"] = score
    session["status"] = STATUS_FOR_DECISION[decision]

    if decision == "ALLOW":
        reserved_seats.update(body.seats)
        return ReserveResponse(
            session_id=body.session_id,
            decision=decision,
            risk_score=score,
            reasons=reasons,
            reserved_seats=body.seats,
            booking_id=f"FD-{random.randint(100000, 999999)}",
            message="Your seats are reserved.",
        )

    message = (
        "Additional verification is required before booking."
        if decision == "VERIFY"
        else "This session was blocked due to suspicious activity."
    )
    return ReserveResponse(
        session_id=body.session_id,
        decision=decision,
        risk_score=score,
        reasons=reasons,
        reserved_seats=[],
        message=message,
    )
