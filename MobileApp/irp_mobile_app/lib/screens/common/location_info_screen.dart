import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import '../../utils/location_service.dart';

class LocationInfoScreen extends StatefulWidget {
  const LocationInfoScreen({super.key});

  @override
  State<LocationInfoScreen> createState() => _LocationInfoScreenState();
}

class _LocationInfoScreenState extends State<LocationInfoScreen> {
  final LocationService _locationService = LocationService();
  Position? _currentPosition;
  String? _error;
  bool _isLoading = false;

  Future<void> _getLocation() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final position = await _locationService.getCurrentLocation();
      setState(() {
        _currentPosition = position;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  @override
  void initState() {
    super.initState();
    _getLocation();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Device Location')),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.location_on, size: 80, color: Colors.red),
              const SizedBox(height: 24),
              if (_isLoading)
                const CircularProgressIndicator()
              else if (_error != null)
                Text('Error: $_error', textAlign: TextAlign.center, style: const TextStyle(color: Colors.red))
              else if (_currentPosition != null)
                Column(
                  children: [
                    const Text(
                      'Your Current Location',
                      style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 16),
                    _buildInfoRow('Latitude', _currentPosition!.latitude.toString()),
                    _buildInfoRow('Longitude', _currentPosition!.longitude.toString()),
                    _buildInfoRow('Altitude', _currentPosition!.altitude.toString()),
                    _buildInfoRow('Accuracy', '${_currentPosition!.accuracy.toStringAsFixed(2)} meters'),
                  ],
                ),
              const SizedBox(height: 40),
              ElevatedButton.icon(
                onPressed: _getLocation,
                icon: const Icon(Icons.refresh),
                label: const Text('Refresh Location'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontWeight: FontWeight.bold)),
          Text(value),
        ],
      ),
    );
  }
}
