import Prism from './Prism';

const GlobalPrismBackgroundFixed = ({ intensity = 'medium' }) => {
  const opacityMap = {
    high: 1,
    medium: 0.6,
    low: 0.4
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: opacityMap[intensity] || 0.6
      }}
    >
      <Prism
        animationType="rotate"
        timeScale={0.3}
        scale={3.6}
        height={3.5}
        baseWidth={5.5}
        glow={0.8}
        noise={0}
        colorFrequency={1}
        suspendWhenOffscreen={false}
      />
    </div>
  );
};

export default GlobalPrismBackgroundFixed;
