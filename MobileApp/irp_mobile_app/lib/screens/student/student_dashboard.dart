import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import 'announcement_screen.dart';
import 'student_fees_screen.dart';
import 'student_results_screen.dart';
import 'notes_screen.dart';
import 'student_profile_screen.dart';
// import '../common/mobile_features_screen.dart';
import '../student/generate_quiz_screen.dart';
import 'package:google_fonts/google_fonts.dart';

class StudentDashboard extends StatelessWidget {
  const StudentDashboard({super.key});

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
                'Student Portal',
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
                      Hero(
                        tag: 'profile-icon',
                        child: CircleAvatar(
                          radius: 40,
                          backgroundColor: theme.colorScheme.primary.withOpacity(0.2),
                          child: Icon(Icons.person, size: 40, color: theme.colorScheme.primary),
                        ),
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
                        user?.email ?? '',
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
                  'Announcements',
                  Icons.campaign_rounded,
                  const Color(0xFF22D3EE), // Cyan 400
                  () => Navigator.push(context, MaterialPageRoute(builder: (_) => const AnnouncementScreen())),
                ),
                _buildActionCard(
                  context,
                  'Fees Status',
                  Icons.account_balance_wallet_rounded,
                  const Color(0xFF10B981), // Emerald 500
                  () => Navigator.push(context, MaterialPageRoute(builder: (_) => const StudentFeesScreen())),
                ),
                _buildActionCard(
                  context,
                  'My Results',
                  Icons.auto_awesome_rounded,
                  const Color(0xFFF59E0B), // Amber 500
                  () => Navigator.push(context, MaterialPageRoute(builder: (_) => const StudentResultsScreen())),
                ),
                _buildActionCard(
                  context,
                  'Study Notes',
                  Icons.menu_book_rounded,
                  const Color(0xFF818CF8), // Indigo 400
                  () => Navigator.push(context, MaterialPageRoute(builder: (_) => const NotesScreen())),
                ),
                _buildActionCard(
                  context,
                  'My Profile',
                  Icons.fingerprint_rounded,
                  const Color(0xFFEC4899), // Pink 500
                  () => Navigator.push(context, MaterialPageRoute(builder: (_) => const StudentProfileScreen())),
                ),
                _buildActionCard(
                  context,
                  'AI MCQs',
                  Icons.psychology_rounded,
                  const Color(0xFFA855F7), // Purple 500
                  () => Navigator.push(context, MaterialPageRoute(builder: (_) => const GenerateQuizScreen())),
                ),
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
