"""In-memory request tracking (MVP only - resets when the server restarts).

Tracking ONLY starts after a Fair Drop session is created. Requests made
before that (Home / Event screens) are never counted.
"""

import time
from collections import defaultdict

# device_id -> total request count
device_request_counts: dict[str, int] = defaultdict(int)

# session_id -> total request count
session_request_counts: dict[str, int] = defaultdict(int)

# session_id -> list of request timestamps (seconds), used for frequency checks
session_request_times: dict[str, list[float]] = defaultdict(list)


def track_request(session_id: str, device_id: str) -> None:
    """Record one API request for a session and its device."""
    device_request_counts[device_id] += 1
    session_request_counts[session_id] += 1
    session_request_times[session_id].append(time.time())


def requests_in_last(session_id: str, seconds: float) -> int:
    """How many requests this session made within the last `seconds`."""
    now = time.time()
    return sum(1 for t in session_request_times[session_id] if now - t <= seconds)


def get_stats(session_id: str, device_id: str) -> dict:
    return {
        "session_requests": session_request_counts[session_id],
        "device_requests": device_request_counts[device_id],
        "requests_last_10s": requests_in_last(session_id, 10),
    }
