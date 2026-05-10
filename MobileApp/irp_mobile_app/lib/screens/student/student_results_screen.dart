import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../providers/student_provider.dart';
import '../../constants/app_colors.dart';
import '../../widgets/gradient_text.dart';

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
      body: Container(
        decoration: BoxDecoration(
          gradient: AppColors.backgroundGradient,
        ),
        child: SafeArea(
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(24.0),
                child: Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white),
                      onPressed: () => Navigator.pop(context),
                    ),
                    const SizedBox(width: 8),
                    GradientText(
                      'My Results',
                      gradient: AppColors.textGradient,
                      style: GoogleFonts.poppins(
                        fontSize: 28,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: studentProvider.isLoading && studentProvider.results.isEmpty
                    ? const Center(child: CircularProgressIndicator(color: AppColors.accent))
                    : studentProvider.error != null && studentProvider.results.isEmpty
                        ? Center(child: Text(studentProvider.error!, style: const TextStyle(color: Colors.white)))
                        : studentProvider.results.isEmpty
                            ? _buildEmptyState()
                            : ListView.builder(
                                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 10),
                                itemCount: studentProvider.results.length,
                                itemBuilder: (context, index) {
                                  final result = studentProvider.results[index];
                                  return _buildResultCard(result);
                                },
                              ),
              ),
            ],
          ),
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
            child: const Icon(Icons.assignment_turned_in_rounded, size: 64, color: Colors.white24),
          ),
          const SizedBox(height: 24),
          Text(
            'No results found',
            style: GoogleFonts.poppins(color: Colors.white60, fontSize: 16),
          ),
        ],
      ),
    );
  }

  Widget _buildResultCard(dynamic result) {
    return Container(
      margin: const EdgeInsets.only(bottom: 24),
      decoration: BoxDecoration(
        color: AppColors.cardBg,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.accent.withOpacity(0.2)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            CachedNetworkImage(
              imageUrl: result.imageUrl,
              height: 250,
              fit: BoxFit.cover,
              placeholder: (context, url) => Container(
                height: 250,
                color: Colors.white.withOpacity(0.05),
                child: const Center(child: CircularProgressIndicator()),
              ),
              errorWidget: (context, url, error) => Container(
                height: 250,
                color: Colors.white.withOpacity(0.05),
                child: const Center(child: Icon(Icons.broken_image_rounded, size: 64, color: Colors.white24)),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      result.testName,
                      style: GoogleFonts.poppins(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                  const Icon(Icons.arrow_forward_ios_rounded, color: AppColors.accent, size: 16),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
