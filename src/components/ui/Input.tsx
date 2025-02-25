import cn from '@/lib/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  disabled?: boolean;
  errorMessage?: string | boolean | undefined;
  label?: string;
  name: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: '';
  required?: boolean;
  type?: 'text';
  value?: string;
}

const Input: React.FC<InputProps> = ({
  className,
  errorMessage,
  label,
  name,
  onBlur,
  onChange,
  required,
  value,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
          {label}
        </label>
      )}
      <input
        className={cn(
          'block w-full rounded-md border-gray-300 border-1 dark:border-cod-gray-300 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 text-lg p-2 my-2',
          className
        )}
        name={name || label}
        required={required}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        {...props}
      />
      {errorMessage && (
        <p className="mt-1 text-sm text-red-500">
          {errorMessage || 'This field is required.'}
        </p>
      )}
    </div>
  );
};

export default Input;
