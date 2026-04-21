import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/admin_provider.dart';
import '../../widgets/custom_text_field.dart';

class RegisterTeacherScreen extends StatefulWidget {
  const RegisterTeacherScreen({super.key});

  @override
  State<RegisterTeacherScreen> createState() => _RegisterTeacherScreenState();
}

class _RegisterTeacherScreenState extends State<RegisterTeacherScreen> {
  final _formKey = GlobalKey<FormState>();
  final _fullNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _teacherRegIdController = TextEditingController();
  final _cnicController = TextEditingController();
  final _qualificationController = TextEditingController();
  final _salaryController = TextEditingController();
  final _contactController = TextEditingController();
  final _addressController = TextEditingController();
  final _ageController = TextEditingController();
  final _subjectsController = TextEditingController();
  final _classesController = TextEditingController();

  void _handleRegister() async {
    if (_formKey.currentState!.validate()) {
      final adminProvider = Provider.of<AdminProvider>(context, listen: false);
      final success = await adminProvider.registerTeacher(
        fullName: _fullNameController.text,
        email: _emailController.text,
        password: _passwordController.text,
        teacherRegId: _teacherRegIdController.text,
        cnic: _cnicController.text,
        qualification: _qualificationController.text,
        salary: double.parse(_salaryController.text),
        joiningDate: DateTime.now().toIso8601String(),
        subjects: _subjectsController.text.split(',').map((s) => s.trim()).toList(),
        classes: _classesController.text.split(',').map((s) => s.trim()).toList(),
        contact: _contactController.text,
        address: _addressController.text,
        age: int.parse(_ageController.text),
      );

      if (success && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Teacher registered successfully!')),
        );
        Navigator.pop(context);
      } else if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(adminProvider.error ?? 'Registration failed')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final adminProvider = Provider.of<AdminProvider>(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Register Teacher')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              CustomTextField(
                controller: _fullNameController,
                label: 'Full Name',
                prefixIcon: Icons.person,
                validator: (v) => v!.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 16),
              CustomTextField(
                controller: _emailController,
                label: 'Email',
                prefixIcon: Icons.email,
                keyboardType: TextInputType.emailAddress,
                validator: (v) => v!.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 16),
              CustomTextField(
                controller: _passwordController,
                label: 'Password',
                prefixIcon: Icons.lock,
                isPassword: true,
                validator: (v) => v!.length < 6 ? 'Too short' : null,
              ),
              const SizedBox(height: 16),
              CustomTextField(
                controller: _teacherRegIdController,
                label: 'Teacher Registration ID',
                prefixIcon: Icons.badge,
                validator: (v) => v!.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 16),
              CustomTextField(
                controller: _cnicController,
                label: 'CNIC',
                prefixIcon: Icons.credit_card,
                validator: (v) => v!.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 16),
              CustomTextField(
                controller: _qualificationController,
                label: 'Qualification',
                prefixIcon: Icons.school,
                validator: (v) => v!.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 16),
              CustomTextField(
                controller: _salaryController,
                label: 'Salary',
                prefixIcon: Icons.payments,
                keyboardType: TextInputType.number,
                validator: (v) => double.tryParse(v!) == null ? 'Invalid' : null,
              ),
              const SizedBox(height: 16),
              CustomTextField(
                controller: _ageController,
                label: 'Age',
                prefixIcon: Icons.cake,
                keyboardType: TextInputType.number,
                validator: (v) => int.tryParse(v!) == null ? 'Invalid' : null,
              ),
              const SizedBox(height: 16),
              CustomTextField(
                controller: _contactController,
                label: 'Contact',
                prefixIcon: Icons.phone,
                validator: (v) => v!.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 16),
              CustomTextField(
                controller: _addressController,
                label: 'Address',
                prefixIcon: Icons.home,
                validator: (v) => v!.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 16),
              CustomTextField(
                controller: _subjectsController,
                label: 'Subjects (comma separated)',
                prefixIcon: Icons.book,
                validator: (v) => v!.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 16),
              CustomTextField(
                controller: _classesController,
                label: 'Classes (comma separated)',
                prefixIcon: Icons.class_,
                validator: (v) => v!.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: adminProvider.isLoading ? null : _handleRegister,
                style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 16)),
                child: adminProvider.isLoading
                    ? const CircularProgressIndicator()
                    : const Text('Register Teacher'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
