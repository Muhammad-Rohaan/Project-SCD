import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/receptionist_provider.dart';
import '../../widgets/custom_text_field.dart';

class RegisterStudentScreen extends StatefulWidget {
  const RegisterStudentScreen({super.key});

  @override
  State<RegisterStudentScreen> createState() => _RegisterStudentScreenState();
}

class _RegisterStudentScreenState extends State<RegisterStudentScreen> {
  final _formKey = GlobalKey<FormState>();
  final _fullNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _rollNoController = TextEditingController();
  final _fatherNameController = TextEditingController();
  final _fatherPhoneController = TextEditingController();
  final _contactController = TextEditingController();
  final _addressController = TextEditingController();
  final _ageController = TextEditingController();
  final _classController = TextEditingController();
  String _selectedField = 'cs';

  final List<Map<String, String>> _fields = [
    {'value': 'cs', 'label': 'Computer Science (CS)'},
    {'value': 'medical', 'label': 'Pre-Medical'},
    {'value': 'engineering', 'label': 'Pre-Engineering'},
    {'value': 'commerce', 'label': 'Commerce'},
    {'value': 'arts', 'label': 'Arts'},
  ];

  void _handleRegister() async {
    if (_formKey.currentState!.validate()) {
      final receptionistProvider =
          Provider.of<ReceptionistProvider>(context, listen: false);
      final success = await receptionistProvider.registerStudent(
        fullName: _fullNameController.text,
        email: _emailController.text,
        password: _passwordController.text,
        rollNo: _rollNoController.text,
        fatherName: _fatherNameController.text,
        fatherPhone: _fatherPhoneController.text,
        contact: _contactController.text,
        address: _addressController.text,
        age: int.parse(_ageController.text),
        className: _classController.text,
        field: _selectedField,
      );

      if (success && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Student registered successfully!')),
        );
        Navigator.pop(context);
      } else if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(receptionistProvider.error ?? 'Registration failed')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final receptionistProvider = Provider.of<ReceptionistProvider>(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Register Student')),
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
                validator: (value) =>
                    value == null || value.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 12),
              CustomTextField(
                controller: _emailController,
                label: 'Email',
                prefixIcon: Icons.email,
                keyboardType: TextInputType.emailAddress,
                validator: (value) =>
                    value == null || !value.contains('@') ? 'Invalid email' : null,
              ),
              const SizedBox(height: 12),
              CustomTextField(
                controller: _passwordController,
                label: 'Password',
                prefixIcon: Icons.lock,
                isPassword: true,
                validator: (value) =>
                    value == null || value.length < 6 ? 'Too short' : null,
              ),
              const SizedBox(height: 12),
              CustomTextField(
                controller: _rollNoController,
                label: 'Roll No (e.g. 11A-04)',
                prefixIcon: Icons.badge,
                validator: (value) =>
                    value == null || value.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 12),
              CustomTextField(
                controller: _fatherNameController,
                label: 'Father Name',
                prefixIcon: Icons.person_outline,
              ),
              const SizedBox(height: 12),
              CustomTextField(
                controller: _fatherPhoneController,
                label: 'Father Phone',
                prefixIcon: Icons.phone_android,
                keyboardType: TextInputType.phone,
              ),
              const SizedBox(height: 12),
              CustomTextField(
                controller: _contactController,
                label: 'Student Contact',
                prefixIcon: Icons.phone,
                keyboardType: TextInputType.phone,
              ),
              const SizedBox(height: 12),
              CustomTextField(
                controller: _addressController,
                label: 'Address',
                prefixIcon: Icons.home,
                validator: (value) =>
                    value == null || value.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: CustomTextField(
                      controller: _ageController,
                      label: 'Age',
                      prefixIcon: Icons.calendar_today,
                      keyboardType: TextInputType.number,
                      validator: (value) =>
                          value == null || int.tryParse(value) == null
                              ? 'Invalid'
                              : null,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: CustomTextField(
                      controller: _classController,
                      label: 'Class (e.g. 11)',
                      prefixIcon: Icons.class_,
                      validator: (value) =>
                          value == null || value.isEmpty ? 'Required' : null,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                initialValue: _selectedField,
                decoration: const InputDecoration(
                  labelText: 'Field/Department',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.school),
                ),
                items: _fields
                    .map((f) => DropdownMenuItem(
                          value: f['value'],
                          child: Text(f['label']!),
                        ))
                    .toList(),
                onChanged: (val) => setState(() => _selectedField = val!),
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: receptionistProvider.isLoading ? null : _handleRegister,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: receptionistProvider.isLoading
                    ? const CircularProgressIndicator()
                    : const Text('Register Student'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
