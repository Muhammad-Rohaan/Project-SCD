import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/teacher_provider.dart';

class TeacherResultsScreen extends StatefulWidget {
  const TeacherResultsScreen({super.key});

  @override
  State<TeacherResultsScreen> createState() => _TeacherResultsScreenState();
}

class _TeacherResultsScreenState extends State<TeacherResultsScreen> {
  @override
  void initState() {
    super.initState();
    final teacherProvider = Provider.of<TeacherProvider>(context, listen: false);
    Future.microtask(() => teacherProvider.fetchAllResults());
  }

  @override
  Widget build(BuildContext context) {
    final teacherProvider = Provider.of<TeacherProvider>(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Test Results')),
      body: RefreshIndicator(
        onRefresh: () => teacherProvider.fetchAllResults(),
        child: teacherProvider.isLoading
            ? const Center(child: CircularProgressIndicator())
            : teacherProvider.error != null
                ? Center(child: Text(teacherProvider.error!))
                : teacherProvider.results.isEmpty
                    ? const Center(child: Text('No results found'))
                    : ListView.separated(
                        padding: const EdgeInsets.all(16),
                        itemCount: teacherProvider.results.length,
                        separatorBuilder: (context, index) => const Divider(),
                        itemBuilder: (context, index) {
                          final result = teacherProvider.results[index];
                          return ListTile(
                            leading: const Icon(Icons.assignment_turned_in, color: Colors.green),
                            title: Text(result.testName),
                            subtitle: Text('Class: ${result.className}'),
                            trailing: TextButton(
                              onPressed: () {
                                // View image in full screen
                                showDialog(
                                  context: context,
                                  builder: (context) => Dialog(
                                    child: Image.network(
                                      result.imageUrl,
                                      loadingBuilder: (context, child, loadingProgress) {
                                        if (loadingProgress == null) return child;
                                        return const Center(child: CircularProgressIndicator());
                                      },
                                      errorBuilder: (context, error, stackTrace) =>
                                          const Center(child: Icon(Icons.error)),
                                    ),
                                  ),
                                );
                              },
                              child: const Text('View'),
                            ),
                          );
                        },
                      ),
      ),
    );
  }
}
