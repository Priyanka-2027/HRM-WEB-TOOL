import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const AppTopNav = ({ userRole = 'employee' }) => {
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);

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
    <nav className="sticky top-0 z-40 bg-gray-900/70 backdrop-blur-md border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${isActive(link.path)
                      ? 'bg-cyan-600/20 text-cyan-400'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
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
              className="hidden sm:block px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-white text-sm font-medium">
                  U
                </div>
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1">
                  <Link
                    to={`/${userRole}/profile`}
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Logout
                  </Link>
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
