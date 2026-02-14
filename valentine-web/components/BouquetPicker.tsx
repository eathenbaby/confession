import { cn } from '@/lib/utils';
import Image from 'next/image';
import { motion } from 'framer-motion';

const BOUQUETS = [
    { id: 'bouquet-01', name: 'Classic Red Roses', src: '/images/bouquets/bouquet-01.svg' },
    { id: 'bouquet-02', name: 'Pink Heart', src: '/images/bouquets/bouquet-02.svg' },
    { id: 'bouquet-03', name: 'Heart & Bow', src: '/images/bouquets/bouquet-03.svg' },
    { id: 'bouquet-04', name: 'Vintage Blooms', src: '/images/bouquets/bouquet-04.svg' },
    { id: 'bouquet-05', name: 'Vibrant Coral', src: '/images/bouquets/bouquet-05.svg' },
    { id: 'bouquet-06', name: 'Yellow Tulips', src: '/images/bouquets/bouquet-06.svg' },
];

interface BouquetPickerProps {
    selected: string | null;
    onSelect: (id: string) => void;
}

export function BouquetPicker({ selected, onSelect }: BouquetPickerProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {BOUQUETS.map((bouquet) => (
                <motion.button
                    key={bouquet.id}
                    onClick={() => onSelect(bouquet.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                        "relative aspect-square rounded-2xl border-2 overflow-hidden bg-white/50 transition-colors",
                        selected === bouquet.id
                            ? "border-rose ring-4 ring-rose/10"
                            : "border-transparent hover:border-rose/30"
                    )}
                >
                    <Image
                        src={bouquet.src}
                        alt={bouquet.name}
                        fill
                        className="object-contain p-4"
                    />
                    {selected === bouquet.id && (
                        <div className="absolute inset-0 bg-rose/10 pointer-events-none" />
                    )}
                </motion.button>
            ))}
        </div>
    );
}
