class AppConstants {
  static const String baseUrl = 'http://10.0.2.2:5000/api'; // For Android Emulator
  // static const String baseUrl = 'http://localhost:5000/api'; // For Web/iOS

  // API Endpoints
  static const String login = '/auth/login';
  static const String logout = '/auth/logout';
  static const String profile = '/auth/profile';

  // Admin Endpoints
  static const String adminDashboard = '/admin/dashboard';
  static const String registerUser = '/admin/register-user';
  static const String getTeachers = '/admin/teachers';
  static const String getStudents = '/admin/students';

  // Student Endpoints
  static const String studentProfile = '/student/profile';
  static const String studentAttendance = '/student/attendance';
  static const String studentFees = '/student/fees';

  // Teacher Endpoints
  static const String teacherProfile = '/teacher/profile';
  static const String teacherStudents = '/teacher/students';

  // Announcement Endpoints
  static const String announcements = '/announcement';

  // Storage Keys
  static const String tokenKey = 'jwt_token';
  static const String userKey = 'user_data';
}
