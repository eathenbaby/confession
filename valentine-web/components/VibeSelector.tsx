import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const VIBES = [
    { icon: '☕', label: 'Coffee Date', id: 'coffee' },
    { icon: '🍽️', label: 'Dinner', id: 'dinner' },
    { icon: '💭', label: 'Just Talk', id: 'talk' },
    { icon: '🎚️', label: 'Adventure', id: 'adventure' },
    { icon: '💕', label: 'Romance', id: 'romance' },
    { icon: '🤝', label: 'Friends', id: 'friends' },
];

interface VibeSelectorProps {
    selected: string | null;
    onSelect: (id: string) => void;
}

export function VibeSelector({ selected, onSelect }: VibeSelectorProps) {
    return (
        <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide">
            {VIBES.map((vibe) => (
                <button
                    key={vibe.id}
                    onClick={() => onSelect(vibe.id)}
                    className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-2xl min-w-[100px] border transition-all duration-300",
                        selected === vibe.id
                            ? "bg-rose/10 border-rose text-rose-700 shadow-md ring-2 ring-rose/20"
                            : "bg-white/40 border-white/40 text-charcoal hover:bg-white/60"
                    )}
                >
                    <span className="text-2xl mb-1">{vibe.icon}</span>
                    <span className="text-xs font-medium">{vibe.label}</span>
                    {selected === vibe.id && (
                        <motion.div
                            layoutId="vibe-active"
                            className="absolute inset-0 rounded-2xl border-2 border-rose pointer-events-none"
                        />
                    )}
                </button>
            ))}
        </div>
    );
}
