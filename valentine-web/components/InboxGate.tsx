'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { GlassCard } from './ui/GlassCard';
import { Lock, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export function InboxGate({ slug }: { slug: string }) {
    const [passcode, setPasscode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleUnlock = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Mock verification
            await new Promise(resolve => setTimeout(resolve, 800));

            if (passcode.length >= 4) {
                // Success
                document.cookie = `auth-${slug}=true; path=/; max-age=1800`; // simple cookie mock
                router.refresh();
            } else {
                toast.error('Incorrect passcode');
            }
        } catch (error) {
            toast.error('Failed to verify passcode');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <GlassCard className="max-w-md w-full p-8 text-center space-y-6">
                <div className="inline-flex p-3 bg-rose/10 rounded-full text-rose-600 mb-2">
                    <Lock size={32} />
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-display font-medium text-charcoal">Creator Access</h2>
                    <p className="text-sm text-gray-500">
                        Enter the passcode for <span className="font-medium">@{slug}</span>
                    </p>
                </div>

                <form onSubmit={handleUnlock} className="space-y-4">
                    <Input
                        type="password"
                        placeholder="Enter passcode"
                        className="text-center tracking-widest text-lg"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                    />

                    <Button
                        type="submit"
                        className="w-full"
                        isLoading={isLoading}
                    >
                        Unlock Inbox <ArrowRight size={16} className="ml-2" />
                    </Button>
                </form>
            </GlassCard>
        </div>
    );
}
