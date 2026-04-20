const Card = ({ 
  children, 
  className = '',
  padding = true,
  hover = false
}) => {
  const hoverStyles = hover ? 'hover:border-gray-600 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-200' : '';
  
  return (
    <div 
      className={`
        bg-black/40
        backdrop-blur-xl
        border 
        border-white/5
        rounded-xl 
        ${padding ? 'p-6' : ''} 
        ${hoverStyles}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
