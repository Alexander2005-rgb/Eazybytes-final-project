
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import MyBookings from './pages/MyBookings';
import Events from './pages/Events';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import { AuthProvider, AuthContext } from './context/AuthContext';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Support from './pages/Support';
import UserProfile from './pages/UserProfile';
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/events" element={<Events />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/support" element={<Support />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Home />} /> {/* Redirect to Home for any unknown routes */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
