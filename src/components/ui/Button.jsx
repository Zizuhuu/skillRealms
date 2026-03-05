import React from 'react';

const variantClasses = {
  default: 'bg-blue-600 hover:bg-blue-700 text-white',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
  outline: 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-900',
  destructive: 'bg-red-600 hover:bg-red-700 text-white',
};

const sizeClasses = {
  default: 'h-10 px-4 py-2 text-sm',
  sm: 'h-8 px-3 text-xs',
  lg: 'h-12 px-8 text-base',
  icon: 'h-9 w-9 p-0',
};

export function Button({ children, variant = 'default', size = 'default', className = '', ...props }) {
  const variantClass = variantClasses[variant] || variantClasses.default;
  const sizeClass = sizeClasses[size] || sizeClasses.default;
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
