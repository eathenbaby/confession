import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'glass';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';

        const variants = {
            primary: 'bg-rose text-white hover:bg-rose/90 shadow-lg shadow-rose/20 hover:shadow-rose/40 font-display tracking-wide',
            secondary: 'bg-lavender text-charcoal hover:bg-lavender/90',
            ghost: 'bg-transparent text-charcoal hover:bg-white/10',
            glass: 'backdrop-blur-md bg-white/20 border border-white/30 text-charcoal hover:bg-white/30 shadow-sm',
        };

        const sizes = {
            sm: 'h-9 px-4 text-sm',
            md: 'h-11 px-6 text-base',
            lg: 'h-14 px-8 text-lg',
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

export { Button };
