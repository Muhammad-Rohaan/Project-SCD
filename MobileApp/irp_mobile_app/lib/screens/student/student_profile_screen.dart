import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/student_provider.dart';
import 'package:google_fonts/google_fonts.dart';

class StudentProfileScreen extends StatefulWidget {
  const StudentProfileScreen({super.key});

  @override
  State<StudentProfileScreen> createState() => _StudentProfileScreenState();
}

class _StudentProfileScreenState extends State<StudentProfileScreen> {
  @override
  void initState() {
    super.initState();
    final studentProvider = Provider.of<StudentProvider>(context, listen: false);
    Future.microtask(() => studentProvider.fetchProfile());
  }

  @override
  Widget build(BuildContext context) {
    final studentProvider = Provider.of<StudentProvider>(context);
    final profile = studentProvider.profile;

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A), // Slate 900
      appBar: AppBar(
        title: Text(
          'Student Profile',
          style: GoogleFonts.poppins(fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        foregroundColor: Colors.white,
      ),
      body: studentProvider.isLoading
          ? const Center(child: CircularProgressIndicator())
          : studentProvider.error != null
              ? Center(child: Text(studentProvider.error!, style: const TextStyle(color: Colors.white)))
              : profile == null
                  ? const Center(child: Text('Profile not found', style: TextStyle(color: Colors.white)))
                  : SingleChildScrollView(
                      padding: const EdgeInsets.all(24.0),
                      child: Column(
                        children: [
                          const SizedBox(height: 20),
                          Hero(
                            tag: 'profile-icon',
                            child: Container(
                              padding: const EdgeInsets.all(4),
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                gradient: LinearGradient(
                                  colors: [
                                    const Color(0xFF22D3EE),
                                    const Color(0xFFA855F7),
                                  ],
                                ),
                              ),
                              child: CircleAvatar(
                                radius: 60,
                                backgroundColor: const Color(0xFF0F172A),
                                child: Icon(
                                  Icons.person_rounded,
                                  size: 70,
                                  color: Theme.of(context).colorScheme.primary,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 24),
                          Text(
                            profile['user']?['fullName'] ?? 'N/A',
                            style: GoogleFonts.poppins(
                              fontSize: 26,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                              letterSpacing: -0.5,
                            ),
                          ),
                          Text(
                            profile['user']?['email'] ?? 'N/A',
                            style: GoogleFonts.poppins(
                              color: Colors.white38,
                              fontSize: 16,
                            ),
                          ),
                          const SizedBox(height: 40),
                          _buildProfileCard([
                            _buildInfoRow('Role', profile['user']?['role']?.toString().toUpperCase() ?? 'STUDENT', Icons.shield_outlined),
                            _buildInfoRow('Class', profile['profile']?['className'] ?? 'N/A', Icons.school_outlined),
                            _buildInfoRow('Roll No', profile['profile']?['rollNo'] ?? 'N/A', Icons.badge_outlined),
                          ]),
                          const SizedBox(height: 20),
                          _buildProfileCard([
                            _buildInfoRow('Contact', profile['profile']?['contact'] ?? 'N/A', Icons.phone_outlined),
                            _buildInfoRow('Address', profile['profile']?['address'] ?? 'N/A', Icons.location_on_outlined),
                          ]),
                        ],
                      ),
                    ),
    );
  }

  Widget _buildProfileCard(List<Widget> children) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white10),
      ),
      child: Column(
        children: children.asMap().entries.map((entry) {
          final idx = entry.key;
          final widget = entry.value;
          return Column(
            children: [
              widget,
              if (idx < children.length - 1)
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  child: Divider(color: Colors.white.withOpacity(0.05), height: 1),
                ),
            ],
          );
        }).toList(),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value, IconData icon) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.05),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: Colors.white54, size: 20),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: GoogleFonts.poppins(
                  color: Colors.white38,
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                ),
              ),
              Text(
                value,
                style: GoogleFonts.poppins(
                  color: Colors.white,
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
