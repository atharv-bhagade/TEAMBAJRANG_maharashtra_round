import 'package:flutter_test/flutter_test.dart';

import 'package:fair_drop_app/app.dart';

void main() {
  testWidgets('Home screen shows Fair Drop branding', (tester) async {
    await tester.pumpWidget(const FairDropApp());
    expect(find.text('Fair Drop'), findsOneWidget);
    expect(find.text('Fair Drop Live 2026'), findsOneWidget);
  });
}
