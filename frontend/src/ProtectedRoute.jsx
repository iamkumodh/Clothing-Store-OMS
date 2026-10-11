import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Ensure all your staff clearance levels are authorized here
  const allowedRoles = ['ADMIN', 'ADMIN_SUPER', 'MANAGER', 'STORE_STAFF'];
  
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />; // Sends unauthorized users to the storefront
  }

  return children;
}