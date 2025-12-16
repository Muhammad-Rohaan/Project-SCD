import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import RequireAuth from './components/RequireAuth';
import Unauthorized from './pages/Unauthorized';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Routes>
      {/* 1. Login page ko /login path par set karein */}
      <Route path='/login' element={<Login />} />

      {/* 2. Default root path (/) ko bhi login par set karein */}
      <Route path='/' element={<Login />} />

      <Route path='/unauthorized' element={<Unauthorized />} />

      {/* Protected Routes yahan aate hain */}
      <Route element={<RequireAuth allowedRoles={['admin']} />}>
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
      </Route>

      {/* 404 Route */}
      <Route path='*' element={<h1>404 Not Found</h1>} />
    </Routes>
  );
}

export default App;