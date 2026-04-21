import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../providers/student_provider.dart';

class NotesScreen extends StatefulWidget {
  const NotesScreen({super.key});

  @override
  State<NotesScreen> createState() => _NotesScreenState();
}

class _NotesScreenState extends State<NotesScreen> {
  @override
  void initState() {
    super.initState();
    final studentProvider = Provider.of<StudentProvider>(context, listen: false);
    Future.microtask(() => studentProvider.fetchNotes());
  }

  Future<void> _openNote(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Could not open file')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final studentProvider = Provider.of<StudentProvider>(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Study Notes')),
      body: RefreshIndicator(
        onRefresh: () => studentProvider.fetchNotes(),
        child: studentProvider.isLoading
            ? const Center(child: CircularProgressIndicator())
            : studentProvider.error != null
                ? Center(child: Text(studentProvider.error!))
                : studentProvider.notes.isEmpty
                    ? const Center(child: Text('No notes available for your class'))
                    : ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: studentProvider.notes.length,
                        itemBuilder: (context, index) {
                          final note = studentProvider.notes[index];
                          return Card(
                            margin: const EdgeInsets.only(bottom: 12),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(15),
                            ),
                            child: ListTile(
                              contentPadding: const EdgeInsets.all(16),
                              leading: const CircleAvatar(
                                backgroundColor: Colors.indigo,
                                child: Icon(Icons.description, color: Colors.white),
                              ),
                              title: Text(
                                note.title,
                                style: const TextStyle(fontWeight: FontWeight.bold),
                              ),
                              subtitle: Text(note.subject),
                              trailing: ElevatedButton(
                                onPressed: () => _openNote(note.fileUrl),
                                child: const Text('Open'),
                              ),
                            ),
                          );
                        },
                      ),
      ),
    );
  }
}
