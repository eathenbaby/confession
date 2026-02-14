'use client';

import { useState } from 'react';
import { GlassCard } from './ui/GlassCard';
import { Button } from './ui/Button';
import { cn } from '@/lib/utils';
import { MapPin, Smartphone, Globe, Monitor, MoreHorizontal, Ban } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

type MessageType = 'confession' | 'bouquet';

interface MessageCardProps {
    id: string;
    type: MessageType;
    content?: string;
    vibe?: string;     // for confessions
    bouquetId?: string; // for bouquets
    timestamp: string;
    metadata: {
        device: string;
        city: string;
        country: string;
        timezone: string;
        screen: string;
        browser: string;
    };
}

export function MessageCard({ type, content, vibe, bouquetId, timestamp, metadata }: MessageCardProps) {
    const [expanded, setExpanded] = useState(false);

    return (
        <motion.div layout>
            <GlassCard
                className={cn(
                    "p-0 overflow-hidden border-l-4 transition-all",
                    type === 'confession' ? "border-l-rose" : "border-l-lavender"
                )}
            >
                <div className="p-5 flex gap-4 items-start">
                    {/* Visual Indicator */}
                    <div className="shrink-0 pt-1">
                        {type === 'bouquet' && bouquetId ? (
                            <div className="relative w-16 h-16 bg-white/50 rounded-xl overflow-hidden shadow-sm">
                                <Image src={`/images/bouquets/${bouquetId}.svg`} alt="Bouquet" fill className="object-contain p-2" />
                            </div>
                        ) : (
                            <div className="w-12 h-12 flex items-center justify-center bg-rose/10 rounded-full text-2xl">
                                {vibe === 'coffee' && '☕'}
                                {vibe === 'dinner' && '🍽️'}
                                {vibe === 'talk' && '💭'}
                                {vibe === 'adventure' && '🎚️'}
                                {vibe === 'romance' && '💕'}
                                {vibe === 'friends' && '🤝'}
                                {!vibe && '💌'}
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                {type === 'bouquet' ? 'Floral Delivery' : 'Confession'}
                            </span>
                            <span className="text-xs text-gray-400">{timestamp}</span>
                        </div>

                        <p className="text-charcoal leading-relaxed whitespace-pre-wrap">
                            {content || (type === 'bouquet' ? "Sent a bouquet with no note." : "No content.")}
                        </p>

                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="text-xs font-medium text-rose-600 hover:text-rose-700 mt-2 flex items-center gap-1"
                        >
                            {expanded ? 'Hide Details' : 'View Sender Info'}
                        </button>
                    </div>
                </div>

                {/* Metadata Panel */}
                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-black/5 border-t border-black/5"
                        >
                            <div className="p-4 grid grid-cols-2 gap-y-3 gap-x-6 text-xs text-charcoal/70">
                                <div className="flex items-center gap-2">
                                    <Smartphone size={14} className="text-gray-400" />
                                    <span>{metadata.device || 'Unknown Device'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={14} className="text-gray-400" />
                                    <span>{metadata.city}, {metadata.country}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe size={14} className="text-gray-400" />
                                    <span>{metadata.timezone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Monitor size={14} className="text-gray-400" />
                                    <span>{metadata.screen} • {metadata.browser}</span>
                                </div>

                                <div className="col-span-2 pt-2 border-t border-black/5 mt-1">
                                    <Button size="sm" variant="ghost" className="text-rose-600 hover:bg-rose/10 h-8 px-2 w-full justify-start">
                                        <Ban size={14} className="mr-2" /> Block this fingerprint
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </GlassCard>
        </motion.div>
    );
}
