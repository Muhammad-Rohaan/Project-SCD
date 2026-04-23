import 'package:flutter/material.dart';
import '../common/location_info_screen.dart';
import '../../utils/notification_service.dart';

class MobileFeaturesScreen extends StatelessWidget {
  const MobileFeaturesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Mobile Features')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildFeatureCard(
            context,
            'GPS Location',
            'View your current coordinates using device GPS.',
            Icons.location_on,
            Colors.red,
            () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const LocationInfoScreen()),
              );
            },
          ),
          const SizedBox(height: 16),
          _buildFeatureCard(
            context,
            'Local Notifications',
            'Test push notification capability on this device.',
            Icons.notifications_active,
            Colors.blue,
            () async {
              await NotificationService.showNotification(
                id: 1,
                title: 'Test Notification',
                body: 'This is a test notification from AZ School Management App.',
              );
              if (context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Notification Sent!')),
                );
              }
            },
          ),
        ],
      ),
    );
  }

  Widget _buildFeatureCard(
    BuildContext context,
    String title,
    String description,
    IconData icon,
    Color color,
    VoidCallback onTap,
  ) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        leading: CircleAvatar(
          backgroundColor: color.withAlpha(26),
          child: Icon(icon, color: color),
        ),
        title: Text(
          title,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
        ),
        subtitle: Text(description),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16),
        onTap: onTap,
      ),
    );
  }
}
