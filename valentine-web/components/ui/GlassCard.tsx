import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<"div"> {
    hoverEffect?: boolean;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
    ({ className, children, hoverEffect = false, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    'glass-card p-6',
                    hoverEffect && 'hover:bg-white/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300',
                    className
                )}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);

GlassCard.displayName = 'GlassCard';

export { GlassCard };
