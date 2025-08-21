import 'package:flutter/material.dart';
import 'package:quetzai/login_screen.dart';
import 'package:quetzai/home_screen.dart';
import 'package:quetzai/nfc_screen.dart';
import 'package:quetzai/theme.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'QuetzAI',
      theme: appTheme,
      initialRoute: '/',
      routes: {
        '/': (context) => const LoginScreen(),
        '/home': (context) => const HomeScreen(),
        '/nfc': (context) => const NfcScreen(),
      },
    );
  }
}