import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/admin_provider.dart';
import '../../widgets/custom_text_field.dart';

class RegisterReceptionistScreen extends StatefulWidget {
  const RegisterReceptionistScreen({super.key});

  @override
  State<RegisterReceptionistScreen> createState() => _RegisterReceptionistScreenState();
}

class _RegisterReceptionistScreenState extends State<RegisterReceptionistScreen> {
  final _formKey = GlobalKey<FormState>();
  final _fullNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _receptionRegIdController = TextEditingController();
  final _cnicController = TextEditingController();
  final _salaryController = TextEditingController();
  final _contactController = TextEditingController();
  final _addressController = TextEditingController();

  void _handleRegister() async {
    if (_formKey.currentState!.validate()) {
      final adminProvider = Provider.of<AdminProvider>(context, listen: false);
      final success = await adminProvider.registerReceptionist(
        fullName: _fullNameController.text,
        email: _emailController.text,
        password: _passwordController.text,
        receptionRegId: _receptionRegIdController.text,
        cnic: _cnicController.text,
        salary: double.parse(_salaryController.text),
        joiningDate: DateTime.now().toIso8601String(),
        contact: _contactController.text,
        address: _addressController.text,
      );

      if (success && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Receptionist registered successfully!')),
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
      appBar: AppBar(title: const Text('Register Receptionist')),
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
                controller: _receptionRegIdController,
                label: 'Reception Registration ID',
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
                controller: _salaryController,
                label: 'Salary',
                prefixIcon: Icons.payments,
                keyboardType: TextInputType.number,
                validator: (v) => double.tryParse(v!) == null ? 'Invalid' : null,
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
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: adminProvider.isLoading ? null : _handleRegister,
                style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 16)),
                child: adminProvider.isLoading
                    ? const CircularProgressIndicator()
                    : const Text('Register Receptionist'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
