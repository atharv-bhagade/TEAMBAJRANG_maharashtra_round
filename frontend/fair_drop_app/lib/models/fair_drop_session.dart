/// Data returned by the backend when a Fair Drop session is created.
class FairDropSession {
  final String sessionId;
  final String eventId;
  final int seatCount;
  final String seatType;
  final String stage;
  final String status;

  const FairDropSession({
    required this.sessionId,
    required this.eventId,
    required this.seatCount,
    required this.seatType,
    required this.stage,
    required this.status,
  });

  factory FairDropSession.fromJson(
    Map<String, dynamic> json, {
    required String eventId,
    required int seatCount,
    required String seatType,
  }) {
    return FairDropSession(
      sessionId: json['session_id'] as String,
      eventId: eventId,
      seatCount: seatCount,
      seatType: seatType,
      stage: json['stage'] as String? ?? '',
      status: json['status'] as String? ?? '',
    );
  }
}

/// Result of POST /api/fair-drop/reserve.
class BookingResult {
  final String decision; // ALLOW, VERIFY or BLOCK
  final int riskScore;
  final List<String> reasons;
  final List<String> reservedSeats;
  final String? bookingId;
  final String message;

  const BookingResult({
    required this.decision,
    required this.riskScore,
    required this.reasons,
    required this.reservedSeats,
    required this.bookingId,
    required this.message,
  });

  factory BookingResult.fromJson(Map<String, dynamic> json) {
    return BookingResult(
      decision: json['decision'] as String,
      riskScore: json['risk_score'] as int,
      reasons: List<String>.from(json['reasons'] as List? ?? []),
      reservedSeats: List<String>.from(json['reserved_seats'] as List? ?? []),
      bookingId: json['booking_id'] as String?,
      message: json['message'] as String? ?? '',
    );
  }
}
