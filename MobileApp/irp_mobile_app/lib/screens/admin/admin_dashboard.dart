import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/admin_provider.dart';
import '../../constants/app_colors.dart';
import '../../widgets/gradient_text.dart';
import 'register_teacher_screen.dart';
import 'register_receptionist_screen.dart';
import 'teacher_list_screen.dart';
import 'receptionist_list_screen.dart';
import '../student/announcement_screen.dart';
import 'post_announcement_screen.dart';
import 'package:google_fonts/google_fonts.dart';

class AdminDashboard extends StatefulWidget {
  const AdminDashboard({super.key});

  @override
  State<AdminDashboard> createState() => _AdminDashboardState();
}

class _AdminDashboardState extends State<AdminDashboard> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<AdminProvider>(context, listen: false).fetchStats();
    });
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final adminProvider = Provider.of<AdminProvider>(context);
    final user = authProvider.user;

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: AppColors.backgroundGradient,
        ),
        child: SafeArea(
          child: CustomScrollView(
            slivers: [
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          GradientText(
                            'Admin Portal',
                            gradient: AppColors.textGradient,
                            style: GoogleFonts.poppins(
                              fontSize: 32,
                              fontWeight: FontWeight.w900,
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.power_settings_new, color: AppColors.danger),
                            onPressed: () => authProvider.logout(),
                          ),
                        ],
                      ),
                      Text(
                        'Welcome back, ${user?.fullName ?? 'Admin'}',
                        style: GoogleFonts.poppins(
                          color: Colors.white70,
                          fontSize: 16,
                        ),
                      ),
                      const SizedBox(height: 32),

                      // Stats Grid
                      Row(
                        children: [
                          Expanded(
                            child: _buildStatCard(
                              'Students',
                              adminProvider.stats['students'].toString(),
                              Icons.people_alt_rounded,
                              const [Color(0xFF6366F1), Color(0xFF4F46E5)],
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: _buildStatCard(
                              'Teachers',
                              adminProvider.stats['teachers'].toString(),
                              Icons.school_rounded,
                              const [Color(0xFF06B6D4), Color(0xFF0891B2)],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      _buildStatCard(
                        'Active Announcements',
                        adminProvider.stats['announcements'].toString(),
                        Icons.campaign_rounded,
                        const [Color(0xFFEC4899), Color(0xFFDB2777)],
                        isFullWidth: true,
                      ),
                      const SizedBox(height: 32),

                      Text(
                        'Quick Actions',
                        style: GoogleFonts.poppins(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),
                    ],
                  ),
                ),
              ),
              SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
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
                      'Add Teacher',
                      Icons.person_add_rounded,
                      const Color(0xFF3B82F6),
                      () => Navigator.push(context, MaterialPageRoute(builder: (_) => const RegisterTeacherScreen())),
                    ),
                    _buildActionCard(
                      context,
                      'Add Receptionist',
                      Icons.how_to_reg_rounded,
                      const Color(0xFF6366F1),
                      () => Navigator.push(context, MaterialPageRoute(builder: (_) => const RegisterReceptionistScreen())),
                    ),
                    _buildActionCard(
                      context,
                      'View Teachers',
                      Icons.groups_rounded,
                      const Color(0xFF14B8A6),
                      () => Navigator.push(context, MaterialPageRoute(builder: (_) => const TeacherListScreen())),
                    ),
                    _buildActionCard(
                      context,
                      'View Receptionists',
                      Icons.badge_rounded,
                      const Color(0xFF06B6D4),
                      () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ReceptionistListScreen())),
                    ),
                    _buildActionCard(
                      context,
                      'Post Announcement',
                      Icons.add_alert_rounded,
                      const Color(0xFFEC4899),
                      () => Navigator.push(context, MaterialPageRoute(builder: (_) => const PostAnnouncementScreen())),
                    ),
                  ]),
                ),
              ),
              const SliverToBoxAdapter(child: SizedBox(height: 32)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatCard(String label, String value, IconData icon, List<Color> colors, {bool isFullWidth = false}) {
    return Container(
      width: isFullWidth ? double.infinity : null,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [colors[0].withOpacity(0.8), colors[1].withOpacity(0.9)],
        ),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: colors[0].withOpacity(0.3),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 4),
              Text(
                value,
                style: const TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.w900),
              ),
            ],
          ),
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: Colors.white, size: 24),
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
        color: AppColors.cardBg,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: color.withOpacity(0.3)),
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
                    fontSize: 13,
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
