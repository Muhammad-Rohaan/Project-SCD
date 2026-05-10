// ignore_for_file: deprecated_member_use

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
// import 'package:url_launcher/url_launcher.dart';
import '../../providers/student_provider.dart';

import 'package:google_fonts/google_fonts.dart';

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

  @override
  Widget build(BuildContext context) {
    final studentProvider = Provider.of<StudentProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A), // Slate 900
      appBar: AppBar(
        title: Text(
          'Study Notes',
          style: GoogleFonts.poppins(fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        foregroundColor: Colors.white,
      ),
      body: RefreshIndicator(
        onRefresh: () => studentProvider.fetchNotes(),
        child: studentProvider.isLoading && studentProvider.notes.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : studentProvider.notes.isEmpty
                ? _buildEmptyState()
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                    itemCount: studentProvider.notes.length,
                    itemBuilder: (context, index) {
                      final note = studentProvider.notes[index];
                      return _buildNoteCard(note);
                    },
                  ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.05),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.description_outlined, size: 64, color: Colors.white24),
          ),
          const SizedBox(height: 24),
          Text(
            'No study notes available',
            style: GoogleFonts.poppins(color: Colors.white60, fontSize: 16),
          ),
        ],
      ),
    );
  }

  Widget _buildNoteCard(dynamic note) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white10),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
        leading: Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: const Color(0xFF818CF8).withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: const Icon(Icons.picture_as_pdf_rounded, color: Color(0xFF818CF8)),
        ),
        title: Text(
          note.title,
          style: GoogleFonts.poppins(
            color: Colors.white,
            fontWeight: FontWeight.w600,
            fontSize: 15,
          ),
        ),
        subtitle: Text(
          note.description,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: GoogleFonts.poppins(color: Colors.white38, fontSize: 12),
        ),
        trailing: const Icon(Icons.download_for_offline_rounded, color: Colors.white24),
        onTap: () {
          // Implement download/view logic
        },
      ),
    );
  }
}
