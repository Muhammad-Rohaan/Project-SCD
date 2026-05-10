// ignore_for_file: deprecated_member_use

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import 'register_teacher_screen.dart';
import 'register_receptionist_screen.dart';
import 'teacher_list_screen.dart';
import 'receptionist_list_screen.dart';
import '../student/announcement_screen.dart';
// import '../common/mobile_features_screen.dart';

import 'package:google_fonts/google_fonts.dart';

class AdminDashboard extends StatelessWidget {
  const AdminDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final user = authProvider.user;
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A), // Slate 900
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 200.0,
            floating: false,
            pinned: true,
            backgroundColor: const Color(0xFF1E1B4B), // Indigo 950
            flexibleSpace: FlexibleSpaceBar(
              title: Text(
                'Admin Dashboard',
                style: GoogleFonts.poppins(
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      const Color(0xFF1E1B4B),
                      const Color(0xFF312E81),
                    ],
                  ),
                ),
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const SizedBox(height: 40),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: theme.colorScheme.primary.withOpacity(0.1),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(Icons.admin_panel_settings_rounded, size: 50, color: Colors.pinkAccent),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'Welcome, ${user?.fullName}',
                        style: GoogleFonts.poppins(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        'System Administrator',
                        style: GoogleFonts.poppins(
                          color: Colors.white60,
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            actions: [
              IconButton(
                icon: const Icon(Icons.power_settings_new, color: Colors.redAccent),
                onPressed: () => authProvider.logout(),
              ),
            ],
          ),
          SliverPadding(
            padding: const EdgeInsets.all(20),
            sliver: SliverGrid(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                childAspectRatio: 1.1,
              ),
              delegate: SliverChildListDelegate([
                _buildActionCard(
                  context,
                  'Register Teacher',
                  Icons.person_add_rounded,
                  const Color(0xFF3B82F6), // Blue 500
                  () => Navigator.push(context, MaterialPageRoute(builder: (_) => const RegisterTeacherScreen())),
                ),
                _buildActionCard(
                  context,
                  'Register Receptionist',
                  Icons.how_to_reg_rounded,
                  const Color(0xFF6366F1), // Indigo 500
                  () => Navigator.push(context, MaterialPageRoute(builder: (_) => const RegisterReceptionistScreen())),
                ),
                _buildActionCard(
                  context,
                  'All Teachers',
                  Icons.groups_rounded,
                  const Color(0xFF14B8A6), // Teal 500
                  () => Navigator.push(context, MaterialPageRoute(builder: (_) => const TeacherListScreen())),
                ),
                _buildActionCard(
                  context,
                  'All Receptionists',
                  Icons.badge_rounded,
                  const Color(0xFF06B6D4), // Cyan 500
                  () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ReceptionistListScreen())),
                ),
                _buildActionCard(
                  context,
                  'Announcements',
                  Icons.campaign_rounded,
                  const Color(0xFFA855F7), // Purple 500
                  () => Navigator.push(context, MaterialPageRoute(builder: (_) => const AnnouncementScreen())),
                ),
                // _buildActionCard(
                //   context,
                //   'Mobile Features',
                //   Icons.phone_android_rounded,
                //   const Color(0xFFF59E0B), // Amber 500
                //   () => Navigator.push(context, MaterialPageRoute(builder: (_) => const MobileFeaturesScreen())),
                // ),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionCard(
    BuildContext context,
    String title,
    IconData icon,
    Color color,
    VoidCallback onTap,
  ) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white10),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(24),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(icon, color: color, size: 32),
                ),
                const SizedBox(height: 12),
                Text(
                  title,
                  textAlign: TextAlign.center,
                  style: GoogleFonts.poppins(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
