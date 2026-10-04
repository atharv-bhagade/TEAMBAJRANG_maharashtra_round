import 'package:flutter/material.dart';

import '../theme/app_theme.dart';
import 'seat_details_screen.dart';

/// Hardcoded demo event for the MVP.
class DemoEvent {
  final String id;
  final String name;
  final String date;
  final String venue;
  final String city;
  final int availableSeats;
  final String description;

  const DemoEvent({
    required this.id,
    required this.name,
    required this.date,
    required this.venue,
    required this.city,
    required this.availableSeats,
    required this.description,
  });
}

const demoEvent = DemoEvent(
  id: 'event_001',
  name: 'Fair Drop Live 2026',
  date: '14 Nov 2026, 7:00 PM',
  venue: 'NSCI Dome',
  city: 'Mumbai',
  availableSeats: 15,
  description:
      'A one-night live concert with a limited ticket drop. Fair Drop keeps '
      'the release fair by verifying real fans and filtering automated '
      'booking attempts.',
);

class EventScreen extends StatelessWidget {
  const EventScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Event Details')),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            Container(
              height: 160,
              decoration: AppTheme.card(),
              child: const Center(
                child: Icon(Icons.graphic_eq,
                    size: 64, color: AppColors.primary),
              ),
            ),
            const SizedBox(height: 20),
            Text(demoEvent.name,
                style:
                    const TextStyle(fontSize: 26, fontWeight: FontWeight.w700)),
            const SizedBox(height: 16),
            _InfoRow(icon: Icons.calendar_today_outlined, text: demoEvent.date),
            _InfoRow(
                icon: Icons.location_on_outlined,
                text: '${demoEvent.venue}, ${demoEvent.city}'),
            _InfoRow(
              icon: Icons.event_seat_outlined,
              text: '${demoEvent.availableSeats} seats available',
              color: AppColors.success,
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: AppTheme.card(),
              child: Text(demoEvent.description,
                  style: const TextStyle(
                      color: AppColors.textSecondary, height: 1.5)),
            ),
            const SizedBox(height: 28),
            ElevatedButton(
              onPressed: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const SeatDetailsScreen()),
              ),
              child: const Text('Book Tickets'),
            ),
          ],
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String text;
  final Color color;

  const _InfoRow({
    required this.icon,
    required this.text,
    this.color = AppColors.textSecondary,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        children: [
          Icon(icon, size: 18, color: AppColors.primaryLight),
          const SizedBox(width: 10),
          Text(text, style: TextStyle(color: color, fontSize: 15)),
        ],
      ),
    );
  }
}
