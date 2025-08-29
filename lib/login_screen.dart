import 'package:flutter/material.dart';
import 'package:quetzai/services/api_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _nameController = TextEditingController();
  final _ageController = TextEditingController();
  final _apiService = ApiService();
  bool _isLoading = false;

  Future<void> _login() async {
    final name = _nameController.text;
    final age = _ageController.text;

    if (name.isNotEmpty && age.isNotEmpty) {
      setState(() {
        _isLoading = true;
      });

      try {
        final ageInt = int.parse(age);
        final response = await _apiService.registerVisitor(name, ageInt);
        
        if (response.containsKey('id_visitante')) {
          final prefs = await SharedPreferences.getInstance();
          await prefs.setInt('visitor_id', (response['id_visitante'] as List).first);
          await prefs.setString('visitor_name', name);
          await prefs.setInt('visitor_age', ageInt);

          Navigator.pushReplacementNamed(context, '/home');
        } else {
          _showError('No se pudo obtener el ID del visitante.');
        }
      } catch (e) {
        _showError('Error al registrar visitante: $e');
      } finally {
        setState(() {
          _isLoading = false;
        });
      }
    } else {
      _showError('Por favor, ingresa tu nombre y edad');
    }
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Image.asset('img/QuetzAI.png', width: 200, height: 200),
              const SizedBox(height: 20),
              RichText(
                text: const TextSpan(
                  style: TextStyle(fontSize: 24, color: Colors.black, fontWeight: FontWeight.bold),
                  children: <TextSpan>[
                    TextSpan(text: 'Quetz'),
                    TextSpan(text: 'AI', style: TextStyle(color: Colors.green)),
                  ],
                ),
              ),
              const SizedBox(height: 40),
              TextField(
                controller: _nameController,
                decoration: const InputDecoration(
                  labelText: 'Nombre',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 20),
              TextField(
                controller: _ageController,
                decoration: const InputDecoration(
                  labelText: 'Edad',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.number,
              ),
              const SizedBox(height: 40),
              _isLoading
                  ? const CircularProgressIndicator()
                  : ElevatedButton(
                      onPressed: _login,
                      style: ElevatedButton.styleFrom(
                        minimumSize: const Size(150, 50),
                      ),
                      child: const Text('INICIAR'),
                    ),
            ],
          ),
        ),
      ),
    );
  }
}