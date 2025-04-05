import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import Layout from '../components/Layout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import TaskList from '../pages/TaskList';
import TaskDetail from '../pages/TaskDetail';
import { useAuth } from '../context/AuthContext';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={user ? <Navigate to="/tasks" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/tasks" replace /> : <Register />}
      />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/tasks" replace />} />
        <Route path="tasks" element={<TaskList />} />
        <Route path="tasks/:taskId" element={<TaskDetail />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
