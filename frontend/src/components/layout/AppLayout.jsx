import Prism from '../background/Prism';

const AppLayout = ({ children, showPrism = false }) => {
  return (
    <div className="w-full min-h-screen relative overflow-hidden bg-slate-50 dark:bg-black transition-colors duration-500">
      {/* Dynamic Background Layer */}
      {showPrism && (
        <div className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-700 dark:opacity-20 opacity-10">
          <Prism
            animationType="rotate"
            timeScale={0.08}
            scale={4.0}
            height={3.0}
            baseWidth={6.0}
            glow={0.5}
            noise={0.02}
            colorFrequency={1.0}
            suspendWhenOffscreen={true}
            opacity={0.2}
          />
        </div>
      )}


      {/* Deep Silk Overlay - Adapted for theme */}
      <div className="fixed inset-0 z-1 pointer-events-none bg-[radial-gradient(circle_at_50%_-20%,rgba(124,58,237,0.05)_0%,rgba(248,250,252,0)_80%)] dark:hidden" />

      {/* Noise Texture for Premium Feel */}
      <div className="noise-overlay" style={{
        position: 'fixed',
        inset: 0,
        opacity: 0.03,
        zIndex: 2,
        pointerEvents: 'none'
      }} />

      {/* Scrollable Content Layer */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        minHeight: '100vh'
      }}>
        {children}
      </div>
    </div>
  );
};

export default AppLayout;

