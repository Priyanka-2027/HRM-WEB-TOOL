import Prism from '../background/Prism';

const AppLayout = ({ children }) => {
  return (
    <div style={{ width: '100%', minHeight: '100vh', position: 'relative' }}>
      {/* Translucent Prism Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.4,
        zIndex: 0
      }}>
        <Prism
          animationType="rotate"
          timeScale={0.3}
          scale={3.6}
          height={3.5}
          baseWidth={5.5}
          glow={0.8}
          noise={0}
          colorFrequency={1}
          suspendWhenOffscreen={true}
        />
      </div>

      {/* Semi-transparent Dark Overlay for Glassomorphism */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(2px)',
        zIndex: 1,
        pointerEvents: 'none'
      }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%'
      }}>
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
