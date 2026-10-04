import 'package:flutter/material.dart';

import '../models/fair_drop_session.dart';
import '../services/api_service.dart';
import '../services/fair_drop_service.dart';
import '../theme/app_theme.dart';
import '../widgets/tracked_area.dart';
import 'booking_result_screen.dart';

class SeatSelectionScreen extends StatefulWidget {
  final FairDropSession session;
  const SeatSelectionScreen({super.key, required this.session});

  @override
  State<SeatSelectionScreen> createState() => _SeatSelectionScreenState();
}

class _SeatSelectionScreenState extends State<SeatSelectionScreen> {
  static const rows = ['A', 'B', 'C', 'D'];
  static const seatsPerRow = 5;

  /// Hardcoded unavailable seats (must match backend `reserved_seats`).
  static const unavailable = {'A3', 'B2', 'C4', 'D1', 'D5'};

  final _service = FairDropService.instance;
  final List<String> _selected = [];
  bool _loading = false;
  bool _checkingRisk = false;
  String? _error;
  Map<String, dynamic>? _risk;

  String get _sessionId => widget.session.sessionId;
  int get _max => widget.session.seatCount;

  void _toggleSeat(String seat) {
    if (unavailable.contains(seat)) return;
    setState(() {
      _error = null;
      if (_selected.contains(seat)) {
        _selected.remove(seat);
      } else if (_selected.length < _max) {
        _selected.add(seat);
        _service.trackEvent(
            sessionId: _sessionId, eventType: 'seat_select', seatId: seat);
      } else {
        _error = 'You can select only $_max seat(s).';
      }
    });
  }

  Future<void> _checkRisk() async {
    setState(() => _checkingRisk = true);
    try {
      final risk = await _service.getRisk(_sessionId);
      setState(() => _risk = risk);
    } on ApiException catch (e) {
      setState(() => _error = e.message);
    } finally {
      if (mounted) setState(() => _checkingRisk = false);
    }
  }

  Future<void> _simulateBot() async {
    setState(() => _checkingRisk = true);
    await _service.simulateBotTaps(_sessionId);
    await _checkRisk();
  }

  Future<void> _reserve() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    await _service.trackEvent(sessionId: _sessionId, eventType: 'reserve_click');
    try {
      final result =
          await _service.reserve(sessionId: _sessionId, seats: _selected);
      if (!mounted) return;
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (_) =>
              BookingResultScreen(session: widget.session, result: result),
        ),
      );
    } on ApiException catch (e) {
      setState(() => _error = e.message);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return TrackedArea(
      sessionId: _sessionId,
      child: Scaffold(
        appBar: AppBar(title: const Text('Select Seats')),
        body: SafeArea(
          child: ListView(
            padding: const EdgeInsets.all(20),
            children: [
              const Align(
                  alignment: Alignment.centerLeft, child: MonitoringBadge()),
              const SizedBox(height: 20),
              // Stage indicator
              Container(
                padding: const EdgeInsets.symmetric(vertical: 8),
                decoration: BoxDecoration(
                  color: AppColors.card,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: AppColors.border),
                ),
                child: const Text('STAGE',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                        color: AppColors.textSecondary,
                        letterSpacing: 4,
                        fontSize: 12)),
              ),
              const SizedBox(height: 24),
              for (final row in rows)
                Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      for (var i = 1; i <= seatsPerRow; i++)
                        _SeatTile(
                          label: '$row$i',
                          state: unavailable.contains('$row$i')
                              ? _SeatState.unavailable
                              : _selected.contains('$row$i')
                                  ? _SeatState.selected
                                  : _SeatState.available,
                          onTap: () => _toggleSeat('$row$i'),
                        ),
                    ],
                  ),
                ),
              const SizedBox(height: 12),
              const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _Legend(color: AppColors.card, label: 'Available'),
                  SizedBox(width: 16),
                  _Legend(color: AppColors.primary, label: 'Selected'),
                  SizedBox(width: 16),
                  _Legend(color: AppColors.border, label: 'Unavailable'),
                ],
              ),
              const SizedBox(height: 24),
              Text(
                '${_selected.length} of $_max seat${_max == 1 ? '' : 's'} selected'
                '${_selected.isEmpty ? '' : '  •  ${_selected.join(', ')}'}',
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
              ),
              if (_error != null) ...[
                const SizedBox(height: 10),
                Text(_error!,
                    textAlign: TextAlign.center,
                    style: const TextStyle(color: AppColors.danger)),
              ],
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed:
                    _loading || _selected.length != _max ? null : _reserve,
                child: _loading
                    ? const SizedBox(
                        width: 22,
                        height: 22,
                        child: CircularProgressIndicator(strokeWidth: 2))
                    : const Text('Reserve Seats'),
              ),
              const SizedBox(height: 20),
              _RiskPanel(
                risk: _risk,
                busy: _checkingRisk,
                onCheck: _checkRisk,
                onSimulateBot: _simulateBot,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

enum _SeatState { available, selected, unavailable }

class _SeatTile extends StatelessWidget {
  final String label;
  final _SeatState state;
  final VoidCallback onTap;

  const _SeatTile(
      {required this.label, required this.state, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final bg = switch (state) {
      _SeatState.available => AppColors.card,
      _SeatState.selected => AppColors.primary,
      _SeatState.unavailable => AppColors.border,
    };
    final fg = switch (state) {
      _SeatState.available => AppColors.text,
      _SeatState.selected => AppColors.background,
      _SeatState.unavailable => AppColors.textSecondary,
    };
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 5),
      child: InkWell(
        borderRadius: BorderRadius.circular(10),
        onTap: state == _SeatState.unavailable ? null : onTap,
        child: Container(
          width: 52,
          height: 48,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: bg,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(
              color: state == _SeatState.selected
                  ? AppColors.primary
                  : AppColors.border,
            ),
          ),
          child: Text(label,
              style: TextStyle(
                color: fg,
                fontWeight: FontWeight.w600,
                decoration: state == _SeatState.unavailable
                    ? TextDecoration.lineThrough
                    : null,
              )),
        ),
      ),
    );
  }
}

class _Legend extends StatelessWidget {
  final Color color;
  final String label;
  const _Legend({required this.color, required this.label});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          width: 14,
          height: 14,
          decoration: BoxDecoration(
            color: color,
            borderRadius: BorderRadius.circular(4),
            border: Border.all(color: AppColors.border),
          ),
        ),
        const SizedBox(width: 6),
        Text(label,
            style:
                const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
      ],
    );
  }
}

/// Live risk view for the demo: shows the current score from /risk.
class _RiskPanel extends StatelessWidget {
  final Map<String, dynamic>? risk;
  final bool busy;
  final VoidCallback onCheck;
  final VoidCallback onSimulateBot;

  const _RiskPanel({
    required this.risk,
    required this.busy,
    required this.onCheck,
    required this.onSimulateBot,
  });

  @override
  Widget build(BuildContext context) {
    final decision = risk?['decision'] as String?;
    final color = decisionColor(decision);
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: AppTheme.card(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Expanded(
                child: Text('Session risk monitor',
                    style: TextStyle(fontWeight: FontWeight.w600)),
              ),
              if (risk != null)
                Text('${risk!['risk_score']} • $decision',
                    style:
                        TextStyle(color: color, fontWeight: FontWeight.w700)),
            ],
          ),
          if (risk != null) ...[
            const SizedBox(height: 8),
            for (final r in (risk!['reasons'] as List))
              Text('• $r',
                  style: const TextStyle(
                      color: AppColors.textSecondary, fontSize: 13)),
          ],
          const SizedBox(height: 12),
          Row(
            children: [
              TextButton(
                onPressed: busy ? null : onCheck,
                child: const Text('Check risk'),
              ),
              const Spacer(),
              TextButton(
                onPressed: busy ? null : onSimulateBot,
                child: const Text('Demo: simulate bot',
                    style: TextStyle(color: AppColors.warning)),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
