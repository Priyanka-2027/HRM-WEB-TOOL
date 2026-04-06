import { Link } from 'react-router-dom';
import GlobalPrismBackgroundFixed from '../components/background/GlobalPrismBackgroundFixed';
import PublicNavbar from '../components/layout/PublicNavbar';
import { Button, Card } from '../components/ui';

const LandingPage = () => {
  const features = [
    {
      title: 'Employee Management',
      description: 'Comprehensive employee records and profile management'
    },
    {
      title: 'Attendance Tracking',
      description: 'Real-time attendance monitoring and analytics'
    },
    {
      title: 'Leave Management',
      description: 'Streamlined leave requests and approval workflows'
    },
    {
      title: 'Skill Matrix',
      description: 'Track employee skills and proficiency levels'
    }
  ];

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Fixed Prism Background */}
      <GlobalPrismBackgroundFixed intensity="high" />

      {/* Scrollable Content */}
      <div className="relative z-10">
        {/* Navbar */}
        <PublicNavbar />

        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
              Modern HR Management
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Employee records, attendance, leaves, and skill insights for growing teams
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/login">
                <Button size="lg">
                  Start Demo
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                View Features
              </Button>
            </div>

            {/* Trust Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl font-bold text-cyan-400">500+</div>
                <div className="text-sm text-gray-400 mt-1">Companies</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-cyan-400">10K+</div>
                <div className="text-sm text-gray-400 mt-1">Employees</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-cyan-400">99.9%</div>
                <div className="text-sm text-gray-400 mt-1">Uptime</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Everything you need to manage your team
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, idx) => (
                <Card key={idx} hover className="text-center">
                  <div className="w-12 h-12 bg-cyan-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <div className="w-6 h-6 bg-cyan-500 rounded"></div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="text-center p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to transform your HR management?
              </h2>
              <p className="text-gray-400 mb-8">
                Join hundreds of companies already using Hironix
              </p>
              <Link to="/login">
                <Button size="lg">
                  Get Started Free
                </Button>
              </Link>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
          <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
            <p>&copy; 2024 Hironix. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
