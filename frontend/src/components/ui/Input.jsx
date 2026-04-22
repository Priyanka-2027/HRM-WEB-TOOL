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
  disabled = false,
  ...props
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label htmlFor={name} className="mb-2 text-[11px] font-black uppercase tracking-widest text-slate-500">
          {label} {required && <span className="text-red-400">*</span>}
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
        {...props}
        className={`
          px-4 py-3
          bg-white/5
          border border-white/8
          rounded-xl
          text-sm text-white
          placeholder:text-slate-600
          focus:outline-none
          focus:border-cyan-500/50
          focus:bg-white/[0.07]
          disabled:opacity-40
          disabled:cursor-not-allowed
          transition-all
          ${error ? 'border-red-500/50 focus:border-red-500/50' : ''}
        `}
      />
      {error && <span className="mt-1.5 text-[11px] font-bold text-red-400">{error}</span>}
    </div>
  );
};

export default Input;
