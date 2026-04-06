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
        bg-gray-900/60
        backdrop-blur-md
        border 
        border-gray-700/30
        rounded-lg 
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
