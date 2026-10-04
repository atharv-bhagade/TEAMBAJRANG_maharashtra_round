import 'package:flutter/material.dart';

import '../services/fair_drop_service.dart';

/// Wraps a screen and reports every tap (x, y) to the backend.
/// Only used on screens AFTER the Fair Drop session has been created.
class TrackedArea extends StatelessWidget {
  final String sessionId;
  final Widget child;

  const TrackedArea({super.key, required this.sessionId, required this.child});

  @override
  Widget build(BuildContext context) {
    return Listener(
      behavior: HitTestBehavior.translucent,
      onPointerDown: (event) {
        FairDropService.instance.trackEvent(
          sessionId: sessionId,
          eventType: 'tap',
          x: event.position.dx,
          y: event.position.dy,
        );
      },
      child: child,
    );
  }
}

/// Small pill shown on monitored screens.
class MonitoringBadge extends StatelessWidget {
  const MonitoringBadge({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: const Color(0x1AB58CFF),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0x55B58CFF)),
      ),
      child: const Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.shield_outlined, size: 14, color: Color(0xFFD8C7FF)),
          SizedBox(width: 6),
          Text(
            'Fair Drop protected',
            style: TextStyle(fontSize: 12, color: Color(0xFFD8C7FF)),
          ),
        ],
      ),
    );
  }
}
