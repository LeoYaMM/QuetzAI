import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:nfc_manager/nfc_manager.dart';
import 'package:nfc_manager_ndef/nfc_manager_ndef.dart';
import 'package:quetzai/services/api_service.dart';

class NfcScreen extends StatefulWidget {
  const NfcScreen({super.key});

  @override
  _NfcScreenState createState() => _NfcScreenState();
}

class _NfcScreenState extends State<NfcScreen> {
  final _apiService = ApiService();
  bool _isScanning = false;
  String _artifactInfo = 'No se ha escaneado nada aún.';
  int? _visitorId;
  bool _isNfcAvailable = false;

  @override
  void initState() {
    super.initState();
    _checkNfcAvailability();
  }

  Future<void> _checkNfcAvailability() async {
    bool isAvailable = await NfcManager.instance.isAvailable();
    if (mounted) {
      setState(() {
        _isNfcAvailable = isAvailable;
      });
    }
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args = ModalRoute.of(context)?.settings.arguments as Map<String, dynamic>?;
    if (args != null) {
      _visitorId = args['visitorId'];
    }
  }

  Future<void> _startNfcScan() async {
    if (!_isNfcAvailable) {
      _updateArtifactInfo('NFC no está disponible en este dispositivo.');
      return;
    }

    setState(() {
      _isScanning = true;
      _artifactInfo = 'Escaneando... acerca el tag NFC.';
    });

    try {
      await NfcManager.instance.startSession(
        onDiscovered: (NfcTag tag) async {
          try {
            final ndef = Ndef.from(tag);
            if (ndef == null) {
              _updateArtifactInfo('El tag no es compatible con NDEF.');
              return;
            }

            final message = ndef.cachedMessage;
            if (message == null || message.records.isEmpty) {
              _updateArtifactInfo('El tag está vacío.');
              return;
            }

            final payload = message.records.first.payload;
            final String decodedPayload = utf8.decode(payload);
            // Replicating the logic from the JS code to remove the language code
            final String cleanPayload = decodedPayload.replaceFirst(RegExp(r'^\x02en'), '');

            if (_visitorId != null) {
              final response = await _apiService.scanId(cleanPayload, _visitorId!);
              if (response.containsKey('resumen')) {
                _updateArtifactInfo(response['resumen']);
              } else {
                _updateArtifactInfo('No se pudo obtener el resumen del artefacto.');
              }
            } else {
              _updateArtifactInfo('No se ha podido obtener el ID del visitante.');
            }
          } catch (e) {
            _updateArtifactInfo('Error procesando el tag: $e');
          } finally {
            NfcManager.instance.stopSession();
          }
        },
        pollingOptions: {
          NfcPollingOption.iso14443,
          NfcPollingOption.iso15693,
          NfcPollingOption.iso18092,
        },
      );
    } catch (e) {
      _updateArtifactInfo('Error al iniciar el escaneo NFC: $e');
    } finally {
      if (mounted) {
        setState(() {
          _isScanning = false;
        });
      }
    }
  }

  void _updateArtifactInfo(String info) {
    if (mounted) {
      setState(() {
        _artifactInfo = info;
        _isScanning = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final args = ModalRoute.of(context)?.settings.arguments as Map<String, dynamic>?;
    final isDemoMode = args?['isDemo'] ?? false;

    return Scaffold(
      appBar: AppBar(
        title: Text(isDemoMode ? 'Modo Demo' : 'Escanear NFC'),
      ),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Image.asset('img/QuetzAI.png', width: 150, height: 150),
              const SizedBox(height: 20),
              Text(
                isDemoMode ? 'Presiona para simular un escaneo' : 'Acerca el tag NFC',
                style: Theme.of(context).textTheme.headlineSmall,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 30),
              ElevatedButton.icon(
                icon: _isScanning ? const CircularProgressIndicator(color: Colors.white) : const Icon(Icons.nfc),
                label: Text(_isScanning ? 'Escaneando...' : (isDemoMode ? 'Simular Escaneo' : 'Escanear Artefacto')),
                onPressed: _isScanning || !_isNfcAvailable && !isDemoMode ? null : (isDemoMode ? _simulateNfcScan : _startNfcScan),
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size(200, 50),
                ),
              ),
              if (!_isNfcAvailable)
                const Padding(
                  padding: EdgeInsets.all(8.0),
                  child: Text('NFC no disponible o desactivado.', style: TextStyle(color: Colors.red)),
                ),
              const SizedBox(height: 30),
              const Text(
                'Información del Artefacto:',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 10),
              Card(
                elevation: 4,
                margin: const EdgeInsets.symmetric(vertical: 10),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Text(_artifactInfo, textAlign: TextAlign.center),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Demo mode logic from the old project
  void _simulateNfcScan() {
    setState(() {
      _isScanning = true;
      _artifactInfo = 'Simulando escaneo...';
    });

    Future.delayed(const Duration(seconds: 2), () {
      const demoArtifacts = [
        {
          "nombre": "Máscara de Jade Maya",
          "descripcion": "Esta magnífica máscara ceremonial representa el poder divino de los gobernantes mayas.",
          "epoca": "Período Clásico Maya (250-900 d.C.)",
        },
        {
          "nombre": "Códice Azteca de Tributos",
          "descripcion": "Documento pictográfico que registra los tributos que debían pagar las provincias conquistadas al Imperio Azteca.",
          "epoca": "Siglo XV-XVI d.C.",
        },
        {
          "nombre": "Vaso Ceremonial Zapoteca",
          "descripcion": "Elegante recipiente utilizado en ceremonias religiosas zapotecas.",
          "epoca": "Período Clásico Zapoteca (200-700 d.C.)",
        }
      ];
      final randomArtifact = demoArtifacts[DateTime.now().millisecondsSinceEpoch % demoArtifacts.length];
      final info = '${randomArtifact['nombre']}\n\n${randomArtifact['descripcion']}\n\n${randomArtifact['epoca']}';
      
      _updateArtifactInfo(info);
    });
  }
}
