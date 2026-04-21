import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import 'announcement_screen.dart';
import 'student_fees_screen.dart';
import 'student_results_screen.dart';
import 'notes_screen.dart';
import 'student_profile_screen.dart';
import '../common/mobile_features_screen.dart';

class StudentDashboard extends StatelessWidget {
  const StudentDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final user = authProvider.user;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Student Portal'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () => authProvider.logout(),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Hello, ${user?.fullName}',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 24),
            Expanded(
              child: ListView(
                children: [
                  _buildDashboardCard(
                    context,
                    'Announcements',
                    Icons.campaign,
                    Colors.blue,
                    () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const AnnouncementScreen(),
                        ),
                      );
                    },
                  ),
                  _buildDashboardCard(
                    context,
                    'Fees',
                    Icons.payment,
                    Colors.green,
                    () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const StudentFeesScreen(),
                        ),
                      );
                    },
                  ),
                  _buildDashboardCard(
                    context,
                    'Results',
                    Icons.assignment,
                    Colors.orange,
                    () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const StudentResultsScreen(),
                        ),
                      );
                    },
                  ),
                  _buildDashboardCard(
                    context,
                    'Notes',
                    Icons.description,
                    Colors.indigo,
                    () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const NotesScreen(),
                        ),
                      );
                    },
                  ),
                  _buildDashboardCard(
                    context,
                    'Profile',
                    Icons.person,
                    Colors.cyan,
                    () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const StudentProfileScreen(),
                        ),
                      );
                    },
                  ),
                  _buildDashboardCard(
                    context,
                    'Attendance',
                    Icons.how_to_reg,
                    Colors.purple,
                    () {
                      // Will implement if backend has attendance routes
                    },
                  ),
                  _buildDashboardCard(
                    context,
                    'Mobile Features',
                    Icons.phone_android,
                    Colors.blueGrey,
                    () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const MobileFeaturesScreen(),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDashboardCard(
    BuildContext context,
    String title,
    IconData icon,
    Color color,
    VoidCallback onTap,
  ) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: color.withAlpha(26),
          child: Icon(icon, color: color),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        trailing: const Icon(Icons.chevron_right),
        onTap: onTap,
      ),
    );
  }
}
