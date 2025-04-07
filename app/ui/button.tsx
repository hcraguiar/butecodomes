"use client";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'toggle';
}

export default function Button({ children, className, variant = 'primary', ...rest }: ButtonProps) {
  const baseStyles = "px-6 py-3 text-lg font-semibold rounded-lg shadow-md transition font-secondary";

  const variants: Record<string, string> = {
    primary: 'bg-gold dark:bg-darkGold text-white hover:bg-darkGold dark:hover:bg-gold',
    toggle: 'p-2 bg-gold dark:bg-darkGold text-white rounded-lg hover:bg-darkGold dark:hover:bg-gold',
  }

  return (
    <button
      {...rest}
      className={`${baseStyles} ${variants[variant]} ${className}`}    
    >
      {children}
    </button>
  );
}
