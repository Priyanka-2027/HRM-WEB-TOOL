import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AppTopNav = ({ userRole = 'employee' }) => {
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const { user, logout } = useAuth();

  const adminLinks = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/employees', label: 'Employees' },
    { path: '/admin/attendance', label: 'Attendance' },
    { path: '/admin/leaves', label: 'Leaves' },
    { path: '/admin/skills', label: 'Skills' }
  ];

  const employeeLinks = [
    { path: '/employee/dashboard', label: 'Dashboard' },
    { path: '/employee/attendance', label: 'My Attendance' },
    { path: '/employee/leaves', label: 'My Leaves' },
    { path: '/employee/skills', label: 'My Skills' }
  ];

  const links = userRole === 'admin' ? adminLinks : employeeLinks;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-4 z-40 mx-4 md:mx-auto max-w-7xl bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl shadow-black/50 transition-all">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-white">
              Hironix
            </Link>
            <div className="hidden md:flex space-x-1">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${isActive(link.path)
                      ? 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <input
              type="search"
              placeholder="Search..."
              className="hidden sm:block px-4 py-1.5 bg-black/40 border border-white/10 rounded-full text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500"
            />
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-white text-sm font-medium">
                  {(user?.firstName?.[0] || 'U').toUpperCase()}
                </div>
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl py-1 transform transition-all">
                  <button
                    type="button"
                    onClick={logout}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-cyan-300 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AppTopNav;
