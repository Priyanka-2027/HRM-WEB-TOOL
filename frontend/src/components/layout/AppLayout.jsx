import Prism from '../background/Prism';

const AppLayout = ({ children }) => {
  return (
    <div style={{ width: '100%', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Dynamic Background Layer */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        <Prism
          animationType="rotate"
          timeScale={0.15}
          scale={4.0}
          height={3.0}
          baseWidth={6.0}
          glow={0.6}
          noise={0.02}
          colorFrequency={1.2}
          suspendWhenOffscreen={true}
          opacity={0.3}
        />
      </div>

      {/* Dark Silk Overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(circle at 50% -20%, rgba(13, 17, 30, 0.4) 0%, #06080f 85%)',
        zIndex: 1,
        pointerEvents: 'none'
      }} />

      {/* Noise Texture for Premium Feel */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: 'url("/noise.svg")',
        opacity: 0.05,
        mixBlendMode: 'overlay',
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
