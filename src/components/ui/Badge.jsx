import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '',
  icon = null,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center font-semibold transition-colors';
  
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 border border-gray-200',
    primary: 'bg-[#00487a] text-white',
    success: 'bg-green-100 text-green-800 border border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    danger: 'bg-red-100 text-red-800 border border-red-200',
    info: 'bg-blue-100 text-blue-800 border border-blue-200',
    code: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200',
    'open-ended': 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200',
    'multiple-choice': 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs rounded-md',
    md: 'px-4 py-2 text-sm rounded-full',
    lg: 'px-6 py-3 text-base rounded-full'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <span className={classes} {...props}>
      {icon && <span className="mr-2 flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
