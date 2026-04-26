import Button from '../ui/Button';

const PageHeader = ({ 
  title, 
  subtitle = '',
  actions = [],
  className = '' 
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl md:text-[2.5rem] font-black tracking-tight text-slate-900 dark:text-white mb-1">{title}</h1>
          {subtitle && <p className="text-sm font-medium text-slate-500">{subtitle}</p>}
        </div>
        {actions.length > 0 && (
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
            {actions.map((action, idx) => (
              <Button
                key={idx}
                variant={action.variant || 'primary'}
                size={action.size || 'md'}
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
