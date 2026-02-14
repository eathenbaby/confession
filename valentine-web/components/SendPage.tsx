'use client';

import { useState } from 'react';
import { Button } from './ui/Button';
import { GlassCard } from './ui/GlassCard';
import { Input } from './ui/Input';
import { VibeSelector } from './VibeSelector';
import { BouquetPicker } from './BouquetPicker';
import { ConsentModal } from './ConsentModal';
import { cn } from '@/lib/utils';
import { Send, Flower } from 'lucide-react';
import { toast } from 'sonner';

export function SendPage({ slug }: { slug: string }) {
    const [activeTab, setActiveTab] = useState<'confession' | 'bouquet'>('confession');
    const [message, setMessage] = useState('');
    const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
    const [selectedBouquet, setSelectedBouquet] = useState<string | null>(null);
    const [showConsent, setShowConsent] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const handleSendClick = () => {
        if (activeTab === 'confession' && !message) {
            toast.error('Please write a message first.');
            return;
        }
        if (activeTab === 'bouquet' && !selectedBouquet) {
            toast.error('Please select a bouquet.');
            return;
        }
        setShowConsent(true);
    };

    const handleConfirmSend = async () => {
        setShowConsent(false);
        setIsSending(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success('Message sent successfully! 🌹');
            setMessage('');
            setSelectedVibe(null);
            setSelectedBouquet(null);
            // Optional: Redirect or show success screen
        } catch (error) {
            toast.error('Failed to send message.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6 pb-20">

            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-display text-charcoal">
                    Send to <span className="text-rose-600">@{slug}</span>
                </h1>
                <p className="text-muted-foreground text-sm">
                    Everything you say remains anonymous to the public.
                </p>
            </div>

            {/* Tabs */}
            <GlassCard className="p-1 flex space-x-1 bg-white/40">
                <button
                    onClick={() => setActiveTab('confession')}
                    className={cn(
                        "flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                        activeTab === 'confession'
                            ? "bg-white text-rose-600 shadow-sm"
                            : "text-gray-500 hover:bg-white/50"
                    )}
                >
                    Confession
                </button>
                <button
                    onClick={() => setActiveTab('bouquet')}
                    className={cn(
                        "flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                        activeTab === 'bouquet'
                            ? "bg-white text-rose-600 shadow-sm"
                            : "text-gray-500 hover:bg-white/50"
                    )}
                >
                    Bouquet
                </button>
            </GlassCard>

            {/* Content */}
            <GlassCard className="min-h-[400px]">
                {activeTab === 'confession' ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-charcoal/80">Choose a Vibe</label>
                            <VibeSelector selected={selectedVibe} onSelect={setSelectedVibe} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-charcoal/80">Your Message</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your confession here..."
                                className="w-full h-40 glass-input rounded-xl p-4 resize-none"
                                maxLength={500}
                            />
                            <div className="text-right text-xs text-gray-400">
                                {message.length}/500
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-charcoal/80">Select a Bouquet</label>
                            <BouquetPicker selected={selectedBouquet} onSelect={setSelectedBouquet} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-charcoal/80">Add a Note (Optional)</label>
                            <Input
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Happy Valentine's Day!"
                            />
                        </div>
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-white/20">
                    <Button
                        className="w-full text-lg h-14 bg-gradient-to-r from-rose-400 to-rose-600 hover:from-rose-500 hover:to-rose-700 shadow-rose/20"
                        onClick={handleSendClick}
                        isLoading={isSending}
                    >
                        {activeTab === 'confession' ? (
                            <><Send className="mr-2 h-5 w-5" /> Send Confession</>
                        ) : (
                            <><Flower className="mr-2 h-5 w-5" /> Send Bouquet</>
                        )}
                    </Button>
                    <p className="text-center text-xs text-gray-400 mt-3">
                        By sending, you agree to our terms of honesty.
                    </p>
                </div>
            </GlassCard>

            <ConsentModal
                isOpen={showConsent}
                onClose={() => setShowConsent(false)}
                onConfirm={handleConfirmSend}
            />
        </div>
    );
}
