import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import DashboardContent from './components/Admin/DashboardContent.jsx';
import StudentsPage from './components/Admin/StudentsPage.jsx';
import TeachersPage from './components/Admin/TeachersPage.jsx';
import ReceptionistsPage from './components/Admin/ReceptionistsPage.jsx';
import FinancePage from './components/Admin/FinancePage.jsx';
import AnnouncementPage from './components/Admin/AnnouncementPage.jsx';

// Reception Imports
import ReceptionLayout from './components/Layouts/ReceptionLayout.jsx';
import ReceptionDashboard from './components/Reception/ReceptionistDashboard.jsx';
import ReceptionStudentsPage from './components/Reception/ReceptionStudentsPage.jsx';

import ProtectedRoute from './ProtectedRoute.jsx';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path='/login' element={<Login />} />

        {/* Protected Admin Routes */}
        <Route
          path='/admin/*'
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          {/* Nested routes ka use tab kiya jaata hai jab aap kisi parent page (jaise ki Dashboard) ke andar sub-sections 
          (jaise Profile, Settings) banana chahte hain, jismein layout kaafi had tak same 
          rehta hai aur sirf content area change hota hai.  */}

          {/* Nested Routes inside Admin-Dashboard (Outlet se render hongay) */}
          <Route index element={<Navigate to="dashboard" replace />} /> {/* /admin => /admin/dashboard */}
          <Route path="dashboard" element={<DashboardContent />} />
          <Route path="az-students" element={<StudentsPage />} />
          <Route path="az-teachers" element={<TeachersPage />} />
          <Route path="az-receptionists" element={<ReceptionistsPage />} />
          <Route path="finance" element={<FinancePage />} />
          <Route path="announcements" element={<AnnouncementPage />} />

        </Route>

        {/* Protected Reception Routes */}
        <Route path='/reception/*'
          element={
            <ProtectedRoute requiredRole="receptionist">
              <ReceptionLayout />
            </ProtectedRoute>
          }>

          <Route index element={<Navigate to="dashboard" replace />} /> {/* /reception => /reception/dashboard */}
          <Route path="dashboard" element={<ReceptionDashboard />} />
          <Route path="az-students" element={<ReceptionStudentsPage />} />
          {/* Future mein fees, announcements etc add kar sakte ho */}
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Teacher Routes (future mein) */}
        {/* <Route
          path="/teacher/*"
          element={
            <ProtectedRoute requiredRole="teacher">
              <TeacherLayout />
            </ProtectedRoute>
          }>
        </Route> */}

        {/* Student Routes */}
        {/* <Route
          path="/student/*"
          element={
            <ProtectedRoute requiredRole="student">
              <StudentLayout />
            </ProtectedRoute>
          }>
        </Route> */}

        {/* Root Route - Agar logged in hai to dashboard, warna login */}
        <Route path="/" element={<RootRedirect />} />

        {/* Koi unknown route hoga to login par bhej dey ga */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
};


// Helper Component for Root Redirect
const RootRedirect = () => {
  const { auth } = useAuth();

  if (auth.loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (auth.user) {
    if (auth.user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (auth.user.role === 'receptionist') {
      return <Navigate to="/reception/dashboard" replace />;
    }
  }

  return <Navigate to="/login" replace />;
};

export default App;