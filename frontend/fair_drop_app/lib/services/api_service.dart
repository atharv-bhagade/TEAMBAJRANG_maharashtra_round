import 'dart:async';
import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

/// Thrown for any API problem. [message] is safe to show to the user.
class ApiException implements Exception {
  final String message;
  const ApiException(this.message);

  @override
  String toString() => message;
}

/// Low-level HTTP helper for the Fair Drop FastAPI backend.
class ApiService {
  static const connectionError = 'Unable to connect to Fair Drop server.';

  /// Android emulator reaches the host machine via 10.0.2.2.
  /// Web / desktop / iOS simulator use localhost.
  /// For a physical phone, replace with your PC's LAN IP (e.g. 192.168.1.5).
  static String get baseUrl {
    if (!kIsWeb && defaultTargetPlatform == TargetPlatform.android) {
      return 'http://10.0.2.2:8000';
    }
    return 'http://127.0.0.1:8000';
  }

  static Future<Map<String, dynamic>> post(
    String path,
    Map<String, dynamic> body,
  ) async {
    http.Response response;
    try {
      response = await http
          .post(
            Uri.parse('$baseUrl$path'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode(body),
          )
          .timeout(const Duration(seconds: 8));
    } catch (_) {
      // Server offline, timeout, network error, etc.
      throw const ApiException(connectionError);
    }

    Map<String, dynamic> data;
    try {
      data = jsonDecode(response.body) as Map<String, dynamic>;
    } catch (_) {
      throw ApiException('Unexpected server response (${response.statusCode}).');
    }

    if (response.statusCode >= 400) {
      final detail = data['detail'];
      throw ApiException(
        detail is String ? detail : 'Request failed (${response.statusCode}).',
      );
    }
    return data;
  }
}
