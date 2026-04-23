import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Get first letter of email
  const firstLetter = user?.email?.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="bg-white/5 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center">
      <Link to="/dashboard" className="text-2xl font-bold text-rose-500 tracking-tighter">
        STUDY<span className="text-white">FLOW</span>
      </Link>

      <div className="flex items-center gap-4">
        {/* Profile Icon with First Alphabet */}
        <Link to="/profile" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white font-bold border-2 border-transparent group-hover:border-rose-400 transition-all">
            {firstLetter}
          </div>
          <span className="hidden md:block text-gray-300 text-sm font-medium">{user?.email}</span>
        </Link>

        {/* Logout Icon Button */}
        <button 
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-all"
          title="Logout"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;