"use client";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'toggle' | 'outline' | 'ghost' | 'topbar',
  size?: 'default' | 'sm' | 'lg' | 'icon',
}

export default function Button({ children, className, variant = 'primary', size = 'default', ...rest }: ButtonProps) {
  const baseStyles = "font-semibold shadow-md transition font-secondary";

  const variants: Record<string, string> = {
    primary: 'bg-accent dark:bg-dark-accent text-white hover:bg-dark-accent dark:hover:bg-accent rounded-lg',
    toggle: 'bg-accent dark:bg-dark-accent text-yellow-500 hover:bg-dark-accent dark:hover:bg-accent rounded-full',
    outline: 'border border-input bg-transparent hover:bg-dark-accent dark:hover:bg-accent rounded-lg',
    ghost: 'bg-transparent hover:bg-dark-accent dark:hover:bg-accent rounded-lg',
    topbar: 'bg-trasparent hover:bg-dark-accent dark:hover:bg-accent rounded-full',
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
