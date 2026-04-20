const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  type = 'button',
  className = '',
  onClick,
  disabled = false
}) => {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-cyan-600 hover:bg-cyan-500 text-white focus:ring-cyan-500 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40',
    secondary: 'bg-white/5 hover:bg-white/10 text-white focus:ring-gray-500 border border-white/10',
    outline: 'border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 focus:ring-cyan-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
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
