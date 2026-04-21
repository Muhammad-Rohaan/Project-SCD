import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/student_provider.dart';

class StudentFeesScreen extends StatefulWidget {
  const StudentFeesScreen({super.key});

  @override
  State<StudentFeesScreen> createState() => _StudentFeesScreenState();
}

class _StudentFeesScreenState extends State<StudentFeesScreen> {
  @override
  void initState() {
    super.initState();
    final studentProvider = Provider.of<StudentProvider>(context, listen: false);
    Future.microtask(() => studentProvider.fetchFees());
  }

  @override
  Widget build(BuildContext context) {
    final studentProvider = Provider.of<StudentProvider>(context);

    return Scaffold(
      appBar: AppBar(title: const Text('My Fees')),
      body: studentProvider.isLoading
          ? const Center(child: CircularProgressIndicator())
          : studentProvider.error != null
              ? Center(child: Text(studentProvider.error!))
              : studentProvider.fees.isEmpty
                  ? const Center(child: Text('No fee records found.'))
                  : ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: studentProvider.fees.length,
                      itemBuilder: (context, index) {
                        final fee = studentProvider.fees[index];
                        return Card(
                          margin: const EdgeInsets.only(bottom: 12),
                          child: ListTile(
                            leading: Icon(
                              fee.status == 'paid'
                                  ? Icons.check_circle
                                  : Icons.pending,
                              color: fee.status == 'paid'
                                  ? Colors.green
                                  : Colors.orange,
                            ),
                            title: Text('Status: ${fee.status.toUpperCase()}'),
                            subtitle: Text(
                              'Collected by: ${fee.collectedBy}\nDate: ${fee.collectedDate.toString().split(' ')[0]}',
                            ),
                          ),
                        );
                      },
                    ),
    );
  }
}
