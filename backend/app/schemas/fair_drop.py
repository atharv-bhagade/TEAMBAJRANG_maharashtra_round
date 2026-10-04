"""Pydantic request/response models for the Fair Drop API."""

from typing import Literal, Optional

from pydantic import BaseModel, Field

SeatType = Literal["Regular", "Premium", "VIP"]
Decision = Literal["ALLOW", "VERIFY", "BLOCK"]
SessionStatus = Literal["ACTIVE", "VERIFY", "BLOCKED", "ALLOWED"]


# ---------- Session ----------
class SessionCreateRequest(BaseModel):
    event_id: str = "event_001"
    seat_count: int = Field(ge=1, le=6)
    seat_type: SeatType
    device_id: str = Field(min_length=1, description="Simple app-generated device id")


class SessionCreateResponse(BaseModel):
    session_id: str
    stage: str
    status: str
    session_status: SessionStatus


# ---------- CAPTCHA ----------
class CaptchaRequest(BaseModel):
    session_id: str
    device_id: str
    num_a: int
    num_b: int
    answer: int
    solve_time_ms: int = Field(ge=0, description="Time taken by the user to answer")


class CaptchaResponse(BaseModel):
    session_id: str
    verified: bool
    attempts: int
    message: str


# ---------- Behaviour events ----------
EventType = Literal["tap", "seat_select", "captcha_submit", "reserve_click"]


class BehaviorEventRequest(BaseModel):
    session_id: str
    device_id: str
    event_type: EventType
    x: float = 0
    y: float = 0
    timestamp: int = Field(description="Client timestamp in milliseconds")
    seat_id: Optional[str] = None


class BehaviorEventResponse(BaseModel):
    session_id: str
    recorded: bool
    total_events: int


# ---------- Risk ----------
class RiskRequest(BaseModel):
    session_id: str
    device_id: str


class RiskResponse(BaseModel):
    session_id: str
    risk_score: int
    decision: Decision
    reasons: list[str]


# ---------- Reserve ----------
class ReserveRequest(BaseModel):
    session_id: str
    device_id: str
    seats: list[str]


class ReserveResponse(BaseModel):
    session_id: str
    decision: Decision
    risk_score: int
    reasons: list[str]
    reserved_seats: list[str]
    booking_id: Optional[str] = None
    message: str
