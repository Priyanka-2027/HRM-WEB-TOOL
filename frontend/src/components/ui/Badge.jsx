const Badge = ({ 
  children, 
  variant = 'default',
  color,
  size = 'md',
  className = '' 
}) => {
  const colorToVariant = {
    gray: 'default',
    cyan: 'primary',
    green: 'success',
    yellow: 'warning',
    red: 'danger',
    blue: 'info',
    purple: 'primary',
  };

  const effectiveVariant = color ? (colorToVariant[color] || 'default') : variant;

  const variants = {
    default: 'bg-gray-700 text-gray-300',
    primary: 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30',
    success: 'bg-green-600/20 text-green-400 border border-green-500/30',
    warning: 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/30',
    danger: 'bg-red-600/20 text-red-400 border border-red-500/30',
    info: 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };
  
  return (
    <span 
      className={`
        inline-flex 
        items-center 
        rounded-full 
        font-medium
        ${variants[effectiveVariant]} 
        ${sizes[size]} 
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
