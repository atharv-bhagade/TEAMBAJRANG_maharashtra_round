import 'package:flutter/material.dart';

import '../services/api_service.dart';
import '../services/fair_drop_service.dart';
import '../theme/app_theme.dart';
import 'captcha_screen.dart';
import 'event_screen.dart';

/// Seat count + seat type form.
/// The Fair Drop session (and all monitoring) starts ONLY when the user
/// presses Continue here.
class SeatDetailsScreen extends StatefulWidget {
  const SeatDetailsScreen({super.key});

  @override
  State<SeatDetailsScreen> createState() => _SeatDetailsScreenState();
}

class _SeatDetailsScreenState extends State<SeatDetailsScreen> {
  static const minSeats = 1;
  static const maxSeats = 6;
  static const seatTypes = {
    'Regular': '₹1,499',
    'Premium': '₹2,999',
    'VIP': '₹5,999',
  };

  int _seatCount = 2;
  String _seatType = 'Regular';
  bool _loading = false;
  String? _error;

  Future<void> _continue() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final session = await FairDropService.instance.createSession(
        eventId: demoEvent.id,
        seatCount: _seatCount,
        seatType: _seatType,
      );
      if (!mounted) return;
      Navigator.push(
        context,
        MaterialPageRoute(builder: (_) => CaptchaScreen(session: session)),
      );
    } on ApiException catch (e) {
      setState(() => _error = e.message);
    } catch (_) {
      setState(() => _error = ApiService.connectionError);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Seat Details')),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            Text(demoEvent.name,
                style: const TextStyle(color: AppColors.textSecondary)),
            const SizedBox(height: 6),
            const Text('Choose your seats',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700)),
            const SizedBox(height: 24),

            // ---- Number of seats ----
            Container(
              padding: const EdgeInsets.all(16),
              decoration: AppTheme.card(),
              child: Row(
                children: [
                  const Expanded(
                    child: Text('Number of seats',
                        style: TextStyle(fontWeight: FontWeight.w600)),
                  ),
                  _CounterButton(
                    icon: Icons.remove,
                    onTap: _seatCount > minSeats
                        ? () => setState(() => _seatCount--)
                        : null,
                  ),
                  SizedBox(
                    width: 44,
                    child: Text('$_seatCount',
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                            fontSize: 20, fontWeight: FontWeight.w700)),
                  ),
                  _CounterButton(
                    icon: Icons.add,
                    onTap: _seatCount < maxSeats
                        ? () => setState(() => _seatCount++)
                        : null,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // ---- Seat type ----
            const Text('Seat type',
                style: TextStyle(fontWeight: FontWeight.w600)),
            const SizedBox(height: 10),
            for (final entry in seatTypes.entries)
              Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: InkWell(
                  borderRadius: BorderRadius.circular(AppTheme.radius),
                  onTap: () => setState(() => _seatType = entry.key),
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: AppTheme.card(
                      borderColor: _seatType == entry.key
                          ? AppColors.primary
                          : AppColors.border,
                    ),
                    child: Row(
                      children: [
                        Icon(
                          _seatType == entry.key
                              ? Icons.radio_button_checked
                              : Icons.radio_button_off,
                          color: _seatType == entry.key
                              ? AppColors.primary
                              : AppColors.textSecondary,
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(entry.key,
                              style: const TextStyle(
                                  fontSize: 16, fontWeight: FontWeight.w600)),
                        ),
                        Text(entry.value,
                            style: const TextStyle(
                                color: AppColors.textSecondary)),
                      ],
                    ),
                  ),
                ),
              ),

            const SizedBox(height: 8),
            const Text(
              'Fair Drop verification begins after you continue.',
              style: TextStyle(color: AppColors.textSecondary, fontSize: 13),
            ),
            if (_error != null) ...[
              const SizedBox(height: 16),
              _ErrorBox(message: _error!),
            ],
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _loading ? null : _continue,
              child: _loading
                  ? const SizedBox(
                      width: 22,
                      height: 22,
                      child: CircularProgressIndicator(strokeWidth: 2))
                  : const Text('Continue'),
            ),
          ],
        ),
      ),
    );
  }
}

class _CounterButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback? onTap;

  const _CounterButton({required this.icon, this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(10),
      onTap: onTap,
      child: Container(
        width: 38,
        height: 38,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: AppColors.border),
        ),
        child: Icon(icon,
            size: 18,
            color: onTap == null ? AppColors.border : AppColors.primaryLight),
      ),
    );
  }
}

/// Reusable red error box.
class _ErrorBox extends StatelessWidget {
  final String message;
  const _ErrorBox({required this.message});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: AppTheme.card(borderColor: AppColors.danger),
      child: Row(
        children: [
          const Icon(Icons.error_outline, color: AppColors.danger, size: 20),
          const SizedBox(width: 10),
          Expanded(
              child: Text(message,
                  style: const TextStyle(color: AppColors.danger))),
        ],
      ),
    );
  }
}
