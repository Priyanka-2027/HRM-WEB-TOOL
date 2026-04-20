import AppTopNav from './AppTopNav';
import AppLayout from './AppLayout';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

const AppShell = ({ children, userRole = 'employee' }) => {
  const { user } = useAuth();
  const effectiveRole = user?.role || userRole;

  return (
    <AppLayout>
      <div className="relative z-10 w-full min-h-screen">
        <AppTopNav userRole={effectiveRole} />
        <motion.main 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
          {children}
        </motion.main>
      </div>
    </AppLayout>
  );
};

export default AppShell;
