const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  type = 'button',
  className = '',
  onClick,
  disabled = false
}) => {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-40 disabled:cursor-not-allowed backdrop-blur-sm';
  
  const variants = {
    primary: 'bg-cyan-500/20 hover:bg-cyan-500/30 active:bg-cyan-500/40 text-cyan-200 hover:text-white border border-cyan-500/40 hover:border-cyan-400/70 focus:ring-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.2)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]',
    secondary: 'bg-white/5 hover:bg-white/10 active:bg-white/15 text-white/80 hover:text-white border border-white/10 hover:border-white/20 focus:ring-white/20',
    outline: 'border border-cyan-500/50 hover:border-cyan-400/70 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 active:bg-cyan-500/20 focus:ring-cyan-500/50',
    danger: 'bg-red-500/20 hover:bg-red-500/30 active:bg-red-500/40 text-red-300 hover:text-red-200 border border-red-500/40 hover:border-red-400/70 focus:ring-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.15)] hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
