"use client";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'toggle' | 'outline' | 'ghost',
  size?: 'default' | 'sm' | 'lg' | 'icon',
}

export default function Button({ children, className, variant = 'primary', size = 'default', ...rest }: ButtonProps) {
  const baseStyles = "font-semibold rounded-lg shadow-md transition font-secondary";

  const variants: Record<string, string> = {
    primary: 'bg-gold dark:bg-darkGold text-white hover:bg-darkGold dark:hover:bg-gold',
    toggle: 'p-2 bg-gold dark:bg-darkGold text-white rounded-lg hover:bg-darkGold dark:hover:bg-gold',
    outline: 'border border-input bg-transparent hover:bg-darkGold dark:hover:bg-gold',
    ghost: 'bg-transparent hover:bg-darkGold dark:hover:bg-gold'
  };

  const sizes: Record<string, string> = {
    default: 'px-6 py-3 text-lg',
    sm: 'h-9 px-3',
    lg: 'h-11 px-8',
    icon: 'px-3 py-3 h-10 w-10',
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
