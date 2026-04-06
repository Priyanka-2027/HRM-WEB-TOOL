const Input = ({ 
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  error = '',
  required = false,
  className = '',
  disabled = false
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label htmlFor={name} className="mb-1.5 text-sm font-medium text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`
          px-4 py-2.5 
          bg-gray-800/50 
          border border-gray-700 
          rounded-lg 
          text-white 
          placeholder-gray-500
          focus:outline-none 
          focus:ring-2 
          focus:ring-cyan-500 
          focus:border-transparent
          disabled:opacity-50 
          disabled:cursor-not-allowed
          transition-all
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
        `}
      />
      {error && <span className="mt-1 text-sm text-red-500">{error}</span>}
    </div>
  );
};

export default Input;
