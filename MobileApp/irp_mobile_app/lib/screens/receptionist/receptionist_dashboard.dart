import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../constants/app_colors.dart';
import '../../widgets/gradient_text.dart';
import 'mark_attendance_screen.dart';
import 'register_student_screen.dart';
import 'collect_fees_screen.dart';
import 'student_list_screen.dart';
import '../student/announcement_screen.dart';
import 'package:google_fonts/google_fonts.dart';

class ReceptionistDashboard extends StatelessWidget {
  const ReceptionistDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
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
                            'Reception Portal',
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
                        'Welcome back, ${user?.fullName ?? 'Receptionist'}',
                        style: GoogleFonts.poppins(
                          color: Colors.white70,
                          fontSize: 16,
                        ),
                      ),
                      const SizedBox(height: 32),
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
                      'Register Student',
                      Icons.person_add_rounded,
                      const Color(0xFF3B82F6),
                      () => Navigator.push(context, MaterialPageRoute(builder: (_) => const RegisterStudentScreen())),
                    ),
                    _buildActionCard(
                      context,
                      'Collect Fees',
                      Icons.payments_rounded,
                      const Color(0xFF10B981),
                      () => Navigator.push(context, MaterialPageRoute(builder: (_) => const CollectFeesScreen())),
                    ),
                    _buildActionCard(
                      context,
                      'Mark Attendance',
                      Icons.how_to_reg_rounded,
                      const Color(0xFFF59E0B),
                      () => Navigator.push(context, MaterialPageRoute(builder: (_) => const MarkAttendanceScreen())),
                    ),
                    _buildActionCard(
                      context,
                      'All Students',
                      Icons.group_rounded,
                      const Color(0xFF6366F1),
                      () => Navigator.push(context, MaterialPageRoute(builder: (_) => const StudentListScreen())),
                    ),
                    _buildActionCard(
                      context,
                      'Announcements',
                      Icons.campaign_rounded,
                      const Color(0xFFA855F7),
                      () => Navigator.push(context, MaterialPageRoute(builder: (_) => const AnnouncementScreen())),
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
