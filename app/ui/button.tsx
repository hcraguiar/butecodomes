"use client";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'toggle' | 'outline' | 'ghost' | 'topbar' | 'disabled',
  size?: 'default' | 'sm' | 'lg' | 'icon',
}

export default function Button({ children, className, variant = 'primary', size = 'default', ...rest }: ButtonProps) {
  const baseStyles = "font-semibold shadow-md transition font-secondary hover:bg-secondary dark:hover:bg-dark-secondary";

  const variants: Record<string, string> = {
    primary: 'bg-primary dark:bg-dark-primary rounded-lg text-foreground',
    toggle: 'bg-primary dark:bg-dark-primary text-yellow-300 dark:text-yellow-800 rounded-full',
    outline: 'border border-input bg-transparent rounded-lg',
    ghost: 'bg-transparent rounded-lg',
    topbar: 'bg-trasparent rounded-full',
    disabled: 'bg-gray-300 dark:bg-gray-700 rounded-lg text-gray-500 cursor-not-allowed',
  };

  const sizes: Record<string, string> = {
    default: 'px-6 py-3 text-lg',
    sm: 'h-9 px-3',
    lg: 'h-11 px-8',
    icon: 'p-2.5 h-10 w-10',
  };

  return (
    <button
      {...rest}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}    
    >
      {children}
    </button>
  );
}
