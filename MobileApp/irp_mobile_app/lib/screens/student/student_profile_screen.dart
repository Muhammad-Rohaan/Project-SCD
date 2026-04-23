import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/student_provider.dart';

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
      appBar: AppBar(title: const Text('My Profile')),
      body: studentProvider.isLoading
          ? const Center(child: CircularProgressIndicator())
          : studentProvider.error != null
              ? Center(child: Text(studentProvider.error!))
              : profile == null
                  ? const Center(child: Text('Profile not found'))
                  : SingleChildScrollView(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        children: [
                          const CircleAvatar(
                            radius: 50,
                            backgroundColor: Colors.cyan,
                            child: Icon(Icons.person, size: 50, color: Colors.white),
                          ),
                          const SizedBox(height: 16),
                          Text(
                            profile['user']['fullName'] ?? 'N/A',
                            style: const TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Text(
                            profile['user']['email'] ?? 'N/A',
                            style: TextStyle(color: Colors.grey[600]),
                          ),
                          const SizedBox(height: 24),
                          _buildProfileItem('Role', profile['user']['role'].toUpperCase()),
                          _buildProfileItem('Class', profile['profile']['className'] ?? 'N/A'),
                          _buildProfileItem('Roll No', profile['profile']['rollNo'] ?? 'N/A'),
                          _buildProfileItem('Registration ID', profile['profile']['stdRegId'] ?? 'N/A'),
                          _buildProfileItem('Contact', profile['profile']['contact'] ?? 'N/A'),
                          _buildProfileItem('Address', profile['profile']['address'] ?? 'N/A'),
                        ],
                      ),
                    ),
    );
  }

  Widget _buildProfileItem(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.grey),
          ),
          Text(
            value,
            style: const TextStyle(fontSize: 16),
          ),
        ],
      ),
    );
  }
}
