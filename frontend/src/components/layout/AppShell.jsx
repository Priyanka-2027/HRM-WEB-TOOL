import AppTopNav from './AppTopNav';
import AppLayout from './AppLayout';

const AppShell = ({ children, userRole = 'employee' }) => {
  return (
    <AppLayout>
      <div className="relative z-10">
        <AppTopNav userRole={userRole} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </AppLayout>
  );
};

export default AppShell;
