import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import DashboardContent from './components/Admin/DashboardContent.jsx';
import ListStudents from './pages/Students/ListStudents.jsx';
import AddStudent from './pages/Students/AddStudent.jsx';
import EditStudent from './pages/Students/EditStudent.jsx';
import ListTeachers from './pages/Teachers/ListTeachers.jsx';
import AddTeacher from './pages/Teachers/AddTeacher.jsx';
import EditTeacher from './pages/Teachers/EditTeacher.jsx';
import ListReceptionists from './pages/Receptionists/ListReceptionists.jsx';
import AddReceptionist from './pages/Receptionists/AddReceptionist.jsx';
import ListAnnouncements from './pages/Announcement/ListAnnouncements.jsx';
import CreateAnnouncement from './pages/Announcement/CreateAnnouncement.jsx';
import FinancePage from './components/Admin/FinancePage.jsx';
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
          <Route path="students" element={<ListStudents />} />
          <Route path="students/add" element={<AddStudent />} />
          <Route path="students/edit/:studentRegId" element={<EditStudent />} />
          <Route path="teachers" element={<ListTeachers />} />
          <Route path="teachers/add" element={<AddTeacher />} />
          <Route path="teachers/edit/:teacherRegId" element={<EditTeacher />} />
          <Route path="receptionists" element={<ListReceptionists />} />
          <Route path="receptionists/add" element={<AddReceptionist />} />
          <Route path="announcements" element={<ListAnnouncements />} />
          <Route path="announcements/create" element={<CreateAnnouncement />} />
          <Route path="finance" element={<FinancePage />} />

          {/* Agar koi unauthorized access ya unknown admin routes par yey route catch ho */}
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>

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

  if (auth.user && auth.user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};
export default App;