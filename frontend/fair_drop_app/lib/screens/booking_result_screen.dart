import 'package:flutter/material.dart';

import '../models/fair_drop_session.dart';
import '../theme/app_theme.dart';

/// Colour for a risk decision (shared with the seat selection screen).
Color decisionColor(String? decision) {
  switch (decision) {
    case 'ALLOW':
      return AppColors.success;
    case 'VERIFY':
      return AppColors.warning;
    case 'BLOCK':
      return AppColors.danger;
    default:
      return AppColors.textSecondary;
  }
}

class BookingResultScreen extends StatelessWidget {
  final FairDropSession session;
  final BookingResult result;

  const BookingResultScreen(
      {super.key, required this.session, required this.result});

  @override
  Widget build(BuildContext context) {
    final color = decisionColor(result.decision);
    final (IconData icon, String title) = switch (result.decision) {
      'ALLOW' => (Icons.check_circle_outline, 'Booking Confirmed'),
      'VERIFY' => (Icons.help_outline, 'Verification Required'),
      _ => (Icons.block, 'Booking Blocked'),
    };

    return Scaffold(
      appBar: AppBar(
        title: const Text('Booking Result'),
        automaticallyImplyLeading: false,
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            const SizedBox(height: 12),
            Icon(icon, size: 72, color: color),
            const SizedBox(height: 16),
            Text(title,
                textAlign: TextAlign.center,
                style:
                    const TextStyle(fontSize: 24, fontWeight: FontWeight.w700)),
            const SizedBox(height: 8),
            Text(result.message,
                textAlign: TextAlign.center,
                style: const TextStyle(color: AppColors.textSecondary)),
            const SizedBox(height: 24),

            // Booking summary
            Container(
              padding: const EdgeInsets.all(16),
              decoration: AppTheme.card(),
              child: Column(
                children: [
                  _Row('Event', 'Fair Drop Live 2026'),
                  _Row('Seat type', session.seatType),
                  _Row('Seats',
                      result.reservedSeats.isEmpty
                          ? 'Not reserved'
                          : result.reservedSeats.join(', ')),
                  if (result.bookingId != null)
                    _Row('Booking ID', result.bookingId!),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Risk summary
            Container(
              padding: const EdgeInsets.all(16),
              decoration: AppTheme.card(borderColor: color.withAlpha(120)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Expanded(
                          child: Text('Fair Drop risk score',
                              style: TextStyle(fontWeight: FontWeight.w600))),
                      Text('${result.riskScore} / 100',
                          style: TextStyle(
                              color: color, fontWeight: FontWeight.w700)),
                    ],
                  ),
                  const SizedBox(height: 10),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: result.riskScore / 100,
                      minHeight: 6,
                      backgroundColor: AppColors.border,
                      color: color,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text('Decision: ${result.decision}',
                      style: TextStyle(color: color)),
                  const SizedBox(height: 8),
                  for (final r in result.reasons)
                    Text('• $r',
                        style: const TextStyle(
                            color: AppColors.textSecondary, fontSize: 13)),
                ],
              ),
            ),
            const SizedBox(height: 28),
            ElevatedButton(
              onPressed: () =>
                  Navigator.popUntil(context, (route) => route.isFirst),
              child: const Text('Back to Home'),
            ),
          ],
        ),
      ),
    );
  }
}

class _Row extends StatelessWidget {
  final String label;
  final String value;
  const _Row(this.label, this.value);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Text(label, style: const TextStyle(color: AppColors.textSecondary)),
          const Spacer(),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}
