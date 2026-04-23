import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import { useAuth } from './context/AuthContext';


function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Signup Route */}
        <Route path="/signup" element={<Signup />} />
        
        {/* Login Page (Abhi banaya nahi, isliye signup par bhej rahe hain) */}
        <Route path="/login" element={<Login />} />

<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
<Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />

      

        {/* Default redirect: Agar user logged in nahi toh signup */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/signup" />} />
      </Routes>
    </Router>
  );
}

export default App;