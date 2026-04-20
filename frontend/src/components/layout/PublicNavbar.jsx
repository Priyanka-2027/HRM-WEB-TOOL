import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const PublicNavbar = () => {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 pointer-events-none">
      <div className="pointer-events-auto fixed top-4 left-4 sm:top-6 sm:left-6 animate-float-in-left">
        <Link
          to="/"
          className="inline-flex items-center gap-3 rounded-full px-2 py-1 transition-colors hover:bg-white/10"
        >
          <img
            src="/hironix.png"
            alt="Hironix logo"
            className="h-10 w-10 rounded-full object-cover border border-white/20"
          />
          <span className="text-xl sm:text-2xl font-bold text-white tracking-wide">
            Hironix
          </span>
        </Link>
      </div>

      <div className="pointer-events-auto fixed top-4 right-4 sm:top-6 sm:right-6 flex flex-wrap items-center justify-end gap-2 sm:gap-3 animate-float-in-right max-w-[calc(100vw-2rem)] sm:max-w-none">
        <Link to="/login">
          <Button variant="outline" size="sm">
            Login
          </Button>
        </Link>
        <Link to="/login">
          <Button size="sm">
            Get Started
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default PublicNavbar;
