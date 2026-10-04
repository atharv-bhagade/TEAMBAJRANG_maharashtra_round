"""Simple behaviour analysis on interaction events sent by the Flutter app.

These are RISK SIGNALS only. No single signal means "bot" - the risk engine
combines them into a score.
"""

import statistics
from collections import Counter, defaultdict

# session_id -> list of events (dicts with event_type, x, y, timestamp)
session_events: dict[str, list[dict]] = defaultdict(list)

# Thresholds (prototype values, chosen by hand - NOT scientifically validated)
RAPID_INTERVAL_MS = 80        # two actions closer than this are "very rapid"
RAPID_MIN_COUNT = 5           # need this many rapid pairs to raise the signal
REGULAR_MIN_INTERVALS = 6     # need enough samples before judging regularity
REGULAR_MAX_VARIATION = 0.10  # std-dev / mean below this = machine-like timing
REPEAT_MIN_COUNT = 5          # same (x, y) tapped this many times


def record_event(session_id: str, event: dict) -> int:
    session_events[session_id].append(event)
    return len(session_events[session_id])


def analyze(session_id: str) -> dict:
    """Return a dict of boolean signals plus some numbers for explanation."""
    events = sorted(session_events[session_id], key=lambda e: e["timestamp"])
    # Timing is measured on raw taps only. (A seat tap also sends a
    # "seat_select" event at the same moment, which would look "rapid".)
    taps = [e for e in events if e["event_type"] == "tap"]
    times = [e["timestamp"] for e in taps]
    intervals = [b - a for a, b in zip(times, times[1:])]

    # 1. Very rapid repeated actions
    rapid_count = sum(1 for i in intervals if i < RAPID_INTERVAL_MS)
    rapid_actions = rapid_count >= RAPID_MIN_COUNT

    # 2. Unusually regular intervals (humans are naturally irregular)
    regular_intervals = False
    variation = None
    if len(intervals) >= REGULAR_MIN_INTERVALS:
        mean = statistics.mean(intervals)
        if mean > 0:
            variation = statistics.pstdev(intervals) / mean
            regular_intervals = variation < REGULAR_MAX_VARIATION

    # 3. Repeated identical interaction positions (rounded to whole pixels)
    positions = Counter(
        (round(e["x"]), round(e["y"])) for e in events if e["event_type"] == "tap"
    )
    most_common = positions.most_common(1)[0][1] if positions else 0
    repeated_pattern = most_common >= REPEAT_MIN_COUNT

    return {
        "total_events": len(events),
        "rapid_actions": rapid_actions,
        "rapid_count": rapid_count,
        "regular_intervals": regular_intervals,
        "interval_variation": variation,
        "repeated_pattern": repeated_pattern,
        "max_same_position": most_common,
    }
