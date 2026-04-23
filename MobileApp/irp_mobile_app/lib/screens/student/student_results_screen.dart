import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/student_provider.dart';

class StudentResultsScreen extends StatefulWidget {
  const StudentResultsScreen({super.key});

  @override
  State<StudentResultsScreen> createState() => _StudentResultsScreenState();
}

class _StudentResultsScreenState extends State<StudentResultsScreen> {
  @override
  void initState() {
    super.initState();
    final studentProvider = Provider.of<StudentProvider>(context, listen: false);
    Future.microtask(() => studentProvider.fetchResults());
  }

  @override
  Widget build(BuildContext context) {
    final studentProvider = Provider.of<StudentProvider>(context);

    return Scaffold(
      appBar: AppBar(title: const Text('My Results')),
      body: studentProvider.isLoading
          ? const Center(child: CircularProgressIndicator())
          : studentProvider.error != null
              ? Center(child: Text(studentProvider.error!))
              : studentProvider.results.isEmpty
                  ? const Center(child: Text('No results found for your class.'))
                  : ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: studentProvider.results.length,
                      itemBuilder: (context, index) {
                        final result = studentProvider.results[index];
                        return Card(
                          clipBehavior: Clip.antiAlias,
                          margin: const EdgeInsets.only(bottom: 16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              Image.network(
                                result.imageUrl,
                                height: 250,
                                fit: BoxFit.cover,
                                errorBuilder: (context, error, stackTrace) =>
                                    const Center(
                                  child: Icon(Icons.broken_image, size: 100),
                                ),
                              ),
                              Padding(
                                padding: const EdgeInsets.all(16),
                                child: Text(
                                  result.testName,
                                  style: const TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
    );
  }
}
