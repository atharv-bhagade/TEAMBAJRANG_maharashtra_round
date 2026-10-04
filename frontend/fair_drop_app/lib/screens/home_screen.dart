import 'package:flutter/material.dart';

import '../theme/app_theme.dart';
import 'event_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            Row(
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: AppColors.primary,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(Icons.confirmation_number_outlined,
                      color: AppColors.background, size: 20),
                ),
                const SizedBox(width: 10),
                const Text('Fair Drop',
                    style:
                        TextStyle(fontSize: 20, fontWeight: FontWeight.w700)),
              ],
            ),
            const SizedBox(height: 36),
            const Text(
              'Tickets for real fans,\nnot bots.',
              style: TextStyle(
                  fontSize: 30, fontWeight: FontWeight.w700, height: 1.2),
            ),
            const SizedBox(height: 12),
            const Text(
              'Fair Drop protects high-demand ticket releases with human '
              'verification and behaviour-based risk checks.',
              style: TextStyle(
                  color: AppColors.textSecondary, fontSize: 15, height: 1.5),
            ),
            const SizedBox(height: 28),
            const Text('FEATURED DROP',
                style: TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 12,
                    letterSpacing: 1.2)),
            const SizedBox(height: 10),
            InkWell(
              borderRadius: BorderRadius.circular(AppTheme.radius),
              onTap: () => _openEvent(context),
              child: Container(
                padding: const EdgeInsets.all(18),
                decoration: AppTheme.card(),
                child: Row(
                  children: [
                    Container(
                      width: 56,
                      height: 56,
                      decoration: BoxDecoration(
                        color: const Color(0x22B58CFF),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(Icons.music_note,
                          color: AppColors.primaryLight),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(demoEvent.name,
                              style: const TextStyle(
                                  fontSize: 16, fontWeight: FontWeight.w600)),
                          const SizedBox(height: 4),
                          Text('${demoEvent.date}  •  ${demoEvent.city}',
                              style: const TextStyle(
                                  color: AppColors.textSecondary,
                                  fontSize: 13)),
                        ],
                      ),
                    ),
                    const Icon(Icons.chevron_right,
                        color: AppColors.textSecondary),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),
            const _Feature(
                icon: Icons.verified_user_outlined,
                title: 'Human verification',
                text: 'A quick check before seat selection.'),
            const _Feature(
                icon: Icons.insights_outlined,
                title: 'Behaviour risk signals',
                text: 'Monitoring starts only once you begin booking.'),
            const _Feature(
                icon: Icons.balance_outlined,
                title: 'Fair decisions',
                text: 'Allow, verify or block — never from one signal alone.'),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () => _openEvent(context),
              child: const Text('Explore Event'),
            ),
          ],
        ),
      ),
    );
  }

  void _openEvent(BuildContext context) {
    Navigator.push(
        context, MaterialPageRoute(builder: (_) => const EventScreen()));
  }
}

class _Feature extends StatelessWidget {
  final IconData icon;
  final String title;
  final String text;

  const _Feature({required this.icon, required this.title, required this.text});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: Row(
        children: [
          Icon(icon, color: AppColors.primary, size: 22),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title,
                    style: const TextStyle(fontWeight: FontWeight.w600)),
                const SizedBox(height: 2),
                Text(text,
                    style: const TextStyle(
                        color: AppColors.textSecondary, fontSize: 13)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
