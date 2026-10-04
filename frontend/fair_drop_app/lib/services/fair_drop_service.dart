import 'dart:math';

import '../models/fair_drop_session.dart';
import 'api_service.dart';

/// All Fair Drop API calls used by the screens.
///
/// Monitoring (behaviour events) is only sent once a session exists,
/// i.e. after the user presses Continue on the Seat Details screen.
class FairDropService {
  FairDropService._();
  static final FairDropService instance = FairDropService._();

  /// Simple random device identifier, generated once per app launch.
  /// (MVP only - no invasive fingerprinting.)
  final String deviceId = 'device-${_randomId()}';

  static String _randomId() {
    final r = Random();
    return List.generate(12, (_) => r.nextInt(16).toRadixString(16)).join();
  }

  Future<FairDropSession> createSession({
    required String eventId,
    required int seatCount,
    required String seatType,
  }) async {
    final data = await ApiService.post('/api/fair-drop/session', {
      'event_id': eventId,
      'seat_count': seatCount,
      'seat_type': seatType,
      'device_id': deviceId,
    });
    return FairDropSession.fromJson(
      data,
      eventId: eventId,
      seatCount: seatCount,
      seatType: seatType,
    );
  }

  /// Returns true if the CAPTCHA answer was accepted by the backend.
  Future<bool> verifyCaptcha({
    required String sessionId,
    required int numA,
    required int numB,
    required int answer,
    required int solveTimeMs,
  }) async {
    final data = await ApiService.post('/api/fair-drop/captcha', {
      'session_id': sessionId,
      'device_id': deviceId,
      'num_a': numA,
      'num_b': numB,
      'answer': answer,
      'solve_time_ms': solveTimeMs,
    });
    return data['verified'] == true;
  }

  /// Fire-and-forget behaviour event. Errors are ignored so tracking
  /// never breaks the booking flow.
  Future<void> trackEvent({
    required String sessionId,
    required String eventType,
    double x = 0,
    double y = 0,
    String? seatId,
  }) async {
    try {
      await ApiService.post('/api/fair-drop/event', {
        'session_id': sessionId,
        'device_id': deviceId,
        'event_type': eventType,
        'x': x,
        'y': y,
        'timestamp': DateTime.now().millisecondsSinceEpoch,
        'seat_id': seatId,
      });
    } catch (_) {
      // Ignore tracking failures.
    }
  }

  Future<Map<String, dynamic>> getRisk(String sessionId) {
    return ApiService.post('/api/fair-drop/risk', {
      'session_id': sessionId,
      'device_id': deviceId,
    });
  }

  Future<BookingResult> reserve({
    required String sessionId,
    required List<String> seats,
  }) async {
    final data = await ApiService.post('/api/fair-drop/reserve', {
      'session_id': sessionId,
      'device_id': deviceId,
      'seats': seats,
    });
    return BookingResult.fromJson(data);
  }

  /// DEMO ONLY: sends machine-like taps (same position, fixed 50 ms gap)
  /// so the team can show the risk engine reacting during the pitch.
  Future<void> simulateBotTaps(String sessionId) async {
    for (var i = 0; i < 12; i++) {
      await trackEvent(sessionId: sessionId, eventType: 'tap', x: 200, y: 430);
      await Future.delayed(const Duration(milliseconds: 50));
    }
  }
}
