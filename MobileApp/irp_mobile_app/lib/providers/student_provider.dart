import 'package:flutter/material.dart';
import '../api/api_service.dart';
import '../models/announcement_model.dart';
import '../models/fee_model.dart';
import '../models/result_model.dart';
import '../utils/database_helper.dart';
import '../constants/app_constants.dart';

import '../models/note_model.dart';

class StudentProvider with ChangeNotifier {
  List<AnnouncementModel> _announcements = [];
  List<FeeModel> _fees = [];
  List<ResultModel> _results = [];
  List<NoteModel> _notes = [];
  Map<String, dynamic>? _profile;
  List<dynamic> _attendance = [];
  bool _isLoading = false;
  String? _error;

  List<AnnouncementModel> get announcements => _announcements;
  List<FeeModel> get fees => _fees;
  List<ResultModel> get results => _results;
  List<NoteModel> get notes => _notes;
  Map<String, dynamic>? get profile => _profile;
  List<dynamic> get attendance => _attendance;
  bool get isLoading => _isLoading;
  String? get error => _error;

  final ApiService _apiService = ApiService();
  final DatabaseHelper _dbHelper = DatabaseHelper();

  Future<void> fetchAnnouncements() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    // Load from offline cache first
    final cachedData = await _dbHelper.getData('announcements');
    if (cachedData != null) {
      _announcements = (cachedData as List)
          .map((item) => AnnouncementModel.fromJson(item))
          .toList();
      notifyListeners();
    }

    try {
      final response = await _apiService.get(AppConstants.announcements);
      if (response.statusCode == 200) {
        final data = response.data;
        if (data != null && data is List) {
          _announcements = data.map((item) => AnnouncementModel.fromJson(item)).toList();
          // Save to offline cache
          await _dbHelper.saveData('announcements', data);
        }
      }
    } catch (e) {
      _error = 'Failed to fetch announcements. Using offline data.';
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> fetchFees() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiService.get('/student/fees');
      if (response.statusCode == 200) {
        final data = response.data['fees'];
        if (data != null && data is List) {
          _fees = data.map((item) => FeeModel.fromJson(item)).toList();
        } else {
          _fees = [];
        }
      }
    } catch (e) {
      _error = 'Failed to fetch fees.';
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> fetchResults() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiService.get('/student/my-class-results');
      if (response.statusCode == 200) {
        final data = response.data['results'];
        if (data != null && data is List) {
          _results = data.map((item) => ResultModel.fromJson(item)).toList();
        } else {
          _results = [];
        }
      }
    } catch (e) {
      _error = 'Failed to fetch results.';
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> fetchNotes() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiService.get('/student/fetchNotes');
      if (response.statusCode == 200) {
        final data = response.data['notes'];
        if (data != null && data is List) {
          _notes = data.map((item) => NoteModel.fromJson(item)).toList();
        } else {
          _notes = [];
        }
      }
    } catch (e) {
      _error = 'Failed to fetch notes.';
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> fetchAttendance() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiService.get('/student/attendance');
      if (response.statusCode == 200) {
        _attendance = response.data['attendance'] ?? [];
      }
    } catch (e) {
      _error = 'Failed to fetch attendance.';
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> fetchProfile() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiService.get('/student/profile');
      if (response.statusCode == 200) {
        _profile = response.data;
      }
    } catch (e) {
      _error = 'Failed to fetch profile.';
    }

    _isLoading = false;
    notifyListeners();
  }
}
