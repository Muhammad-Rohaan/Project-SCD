import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import 'mark_attendance_screen.dart';
import 'register_student_screen.dart';
import 'collect_fees_screen.dart';
import 'student_list_screen.dart';
import '../student/announcement_screen.dart';
import '../common/mobile_features_screen.dart';

class ReceptionistDashboard extends StatelessWidget {
  const ReceptionistDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final user = authProvider.user;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Receptionist Portal'),
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
              'Welcome, ${user?.fullName}',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 24),
            Expanded(
              child: GridView.count(
                crossAxisCount: 2,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                children: [
                  _buildDashboardCard(
                    context,
                    'Register Student',
                    Icons.person_add,
                    Colors.blue,
                    () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const RegisterStudentScreen(),
                        ),
                      );
                    },
                  ),
                  _buildDashboardCard(
                    context,
                    'Collect Fees',
                    Icons.payments,
                    Colors.green,
                    () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const CollectFeesScreen(),
                        ),
                      );
                    },
                  ),
                  _buildDashboardCard(
                    context,
                    'Mark Attendance',
                    Icons.how_to_reg,
                    Colors.orange,
                    () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const MarkAttendanceScreen(),
                        ),
                      );
                    },
                  ),
                  _buildDashboardCard(
                    context,
                    'All Students',
                    Icons.group,
                    Colors.purple,
                    () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const StudentListScreen(),
                        ),
                      );
                    },
                  ),
                  _buildDashboardCard(
                    context,
                    'Announcements',
                    Icons.campaign,
                    Colors.orange,
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
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 48, color: color),
            const SizedBox(height: 8),
            Text(
              title,
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
