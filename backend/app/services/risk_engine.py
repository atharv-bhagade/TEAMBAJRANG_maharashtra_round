"""Fair Drop risk engine (prototype).

Adds up points from several independent signal groups and returns a score
from 0 to 100 plus a decision:

    0  - 39  -> ALLOW
    40 - 69  -> VERIFY
    70 - 100 -> BLOCK

IMPORTANT: The points and thresholds below are hand-picked prototype values
for the hackathon demo. They are NOT scientifically validated. No single
signal can reach BLOCK on its own - several must combine.
"""

import time

from app.services import behavior_analyzer, request_tracker

ALLOW_MAX = 39
VERIFY_MAX = 69


def decision_for(score: int) -> str:
    if score <= ALLOW_MAX:
        return "ALLOW"
    if score <= VERIFY_MAX:
        return "VERIFY"
    return "BLOCK"


def calculate_risk(session: dict, device_id: str) -> tuple[int, str, list[str]]:
    """Return (risk_score, decision, reasons) for a session."""
    score = 0
    reasons: list[str] = []

    # --- 1. Request frequency --------------------------------------------
    stats = request_tracker.get_stats(session["session_id"], device_id)
    if stats["requests_last_10s"] > 25:
        score += 25
        reasons.append("Very high request rate in the last 10 seconds")
    elif stats["requests_last_10s"] > 15:
        score += 10
        reasons.append("Elevated request rate")
    if stats["device_requests"] > 150:
        score += 10
        reasons.append("Device made an unusually large number of requests")

    # --- 2. Behaviour anomalies ------------------------------------------
    behavior = behavior_analyzer.analyze(session["session_id"])
    if behavior["rapid_actions"]:
        score += 15
        reasons.append("Very rapid repeated actions")
    if behavior["regular_intervals"]:
        score += 20
        reasons.append("Unusually regular timing between actions")
    if behavior["repeated_pattern"]:
        score += 15
        reasons.append("Repeated identical tap positions")

    # --- 3. CAPTCHA behaviour --------------------------------------------
    if not session["captcha_verified"]:
        score += 30
        reasons.append("CAPTCHA not verified")
    if session["captcha_failures"] >= 3:
        score += 10
        reasons.append("Multiple failed CAPTCHA attempts")
    if session["captcha_solve_ms"] is not None and session["captcha_solve_ms"] < 1500:
        score += 15
        reasons.append("CAPTCHA solved faster than typical human speed")

    # --- 4. Session anomalies --------------------------------------------
    session_age = time.time() - session["created_at"]
    if session_age < 3:
        score += 20
        reasons.append("Session progressed unusually fast")
    if session["status"] == "BLOCKED":
        score += 100
        reasons.append("Session was previously blocked")

    score = max(0, min(100, score))
    if not reasons:
        reasons.append("No risk signals detected")
    return score, decision_for(score), reasons
