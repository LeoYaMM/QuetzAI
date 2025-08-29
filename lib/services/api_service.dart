import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  final String _baseUrl = 'http://localhost:8000';

  Future<Map<String, dynamic>> registerVisitor(String name, int age) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/registrar_visitante'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, dynamic>{
        'nombre': name,
        'edad': age,
      }),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to register visitor');
    }
  }

  Future<Map<String, dynamic>> scanId(String scanData, int visitorId) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/scan_id'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, dynamic>{
        'scan_data': scanData,
        'id_visitante': visitorId,
      }),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to scan id');
    }
  }

  Future<Map<String, dynamic>> getTrivia(int visitorId, int scanCount) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/trivia'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, dynamic>{
        'id_visitante': visitorId,
        'noResumen': scanCount,
      }),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to get trivia');
    }
  }
}
