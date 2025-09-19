import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String _name = 'Usuario';
  int? _age;
  int? _visitorId;

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _name = prefs.getString('visitor_name') ?? 'Usuario';
      _age = prefs.getInt('visitor_age');
      _visitorId = prefs.getInt('visitor_id');
    });
  }

  Future<void> _logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    Navigator.pushReplacementNamed(context, '/');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Inicio'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: _logout,
          ),
        ],
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Image.asset('img/QuetzAI.png', width: 150, height: 150),
            const SizedBox(height: 20),
            RichText(
              text: TextSpan(
                style: const TextStyle(fontSize: 24, color: Colors.black),
                children: <TextSpan>[
                  const TextSpan(text: '¡Bienvenido, '),
                  TextSpan(text: _name, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.green)),
                  const TextSpan(text: '!'),
                ],
              ),
            ),
            const SizedBox(height: 10),
            if (_age != null)
              Text('Edad: $_age años', style: const TextStyle(fontSize: 16)),
            const SizedBox(height: 30),
            ElevatedButton.icon(
              icon: const Icon(Icons.nfc),
              label: const Text('Escanear NFC'),
              onPressed: () {
                Navigator.pushNamed(context, '/nfc', arguments: {'visitorId': _visitorId});
              },
              style: ElevatedButton.styleFrom(
                minimumSize: const Size(200, 50),
              ),
            ),
            const SizedBox(height: 10),
            ElevatedButton.icon(
              icon: const Icon(Icons.science),
              label: const Text('Modo Demo'),
              onPressed: () {
                Navigator.pushNamed(context, '/nfc', arguments: {'isDemo': true, 'visitorId': _visitorId});
              },
              style: ElevatedButton.styleFrom(
                minimumSize: const Size(200, 50),
              ),
            ),
          ],
        ),
      ),
    );
  }
}