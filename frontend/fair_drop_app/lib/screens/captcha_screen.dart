import 'dart:math';

import 'package:flutter/material.dart';

import '../models/fair_drop_session.dart';
import '../services/api_service.dart';
import '../services/fair_drop_service.dart';
import '../theme/app_theme.dart';
import '../widgets/tracked_area.dart';
import 'seat_selection_screen.dart';

/// Mock math CAPTCHA (MVP). The backend checks the answer and records
/// how long the user took to solve it.
class CaptchaScreen extends StatefulWidget {
  final FairDropSession session;
  const CaptchaScreen({super.key, required this.session});

  @override
  State<CaptchaScreen> createState() => _CaptchaScreenState();
}

class _CaptchaScreenState extends State<CaptchaScreen> {
  final _random = Random();
  final _controller = TextEditingController();
  final _stopwatch = Stopwatch();
  late int _a;
  late int _b;
  bool _loading = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _newChallenge();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _newChallenge() {
    _a = _random.nextInt(9) + 1;
    _b = _random.nextInt(9) + 1;
    _controller.clear();
    _stopwatch
      ..reset()
      ..start();
  }

  Future<void> _verify() async {
    final answer = int.tryParse(_controller.text.trim());
    if (answer == null) {
      setState(() => _error = 'Please enter a number.');
      return;
    }
    setState(() {
      _loading = true;
      _error = null;
    });

    final service = FairDropService.instance;
    final sessionId = widget.session.sessionId;
    service.trackEvent(sessionId: sessionId, eventType: 'captcha_submit');

    try {
      final ok = await service.verifyCaptcha(
        sessionId: sessionId,
        numA: _a,
        numB: _b,
        answer: answer,
        solveTimeMs: _stopwatch.elapsedMilliseconds,
      );
      if (!mounted) return;
      if (ok) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (_) => SeatSelectionScreen(session: widget.session),
          ),
        );
      } else {
        setState(() {
          _error = 'Incorrect answer. Please try again.';
          _newChallenge();
        });
      }
    } on ApiException catch (e) {
      setState(() => _error = e.message);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return TrackedArea(
      sessionId: widget.session.sessionId,
      child: Scaffold(
        appBar: AppBar(title: const Text('Verification')),
        body: SafeArea(
          child: ListView(
            padding: const EdgeInsets.all(20),
            children: [
              const Align(
                  alignment: Alignment.centerLeft, child: MonitoringBadge()),
              const SizedBox(height: 20),
              Container(
                padding: const EdgeInsets.all(22),
                decoration: AppTheme.card(),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Security Verification',
                        style: TextStyle(
                            fontSize: 20, fontWeight: FontWeight.w700)),
                    const SizedBox(height: 6),
                    const Text('Solve this to continue to seat selection.',
                        style: TextStyle(color: AppColors.textSecondary)),
                    const SizedBox(height: 24),
                    Center(
                      child: Text('$_a + $_b = ?',
                          style: const TextStyle(
                              fontSize: 36,
                              fontWeight: FontWeight.w700,
                              color: AppColors.primaryLight)),
                    ),
                    const SizedBox(height: 24),
                    TextField(
                      controller: _controller,
                      keyboardType: TextInputType.number,
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontSize: 20),
                      decoration: const InputDecoration(hintText: 'Answer'),
                      onSubmitted: (_) => _loading ? null : _verify(),
                    ),
                    if (_error != null) ...[
                      const SizedBox(height: 12),
                      Text(_error!,
                          style: const TextStyle(color: AppColors.danger)),
                    ],
                    const SizedBox(height: 20),
                    ElevatedButton(
                      onPressed: _loading ? null : _verify,
                      child: _loading
                          ? const SizedBox(
                              width: 22,
                              height: 22,
                              child:
                                  CircularProgressIndicator(strokeWidth: 2))
                          : const Text('Verify'),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              Text(
                '${widget.session.seatCount} × ${widget.session.seatType} seats',
                textAlign: TextAlign.center,
                style: const TextStyle(color: AppColors.textSecondary),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
