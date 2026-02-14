'use client';

import { useState } from 'react';
import { MessageCard } from './MessageCard';
import { GlassCard } from './ui/GlassCard';
import { RefreshCcw, LogOut } from 'lucide-react';
import { Button } from './ui/Button';

// Mock Data
const MOCK_MESSAGES = [
    {
        id: '1',
        type: 'confession' as const,
        content: "I've had a crush on you since sophomore year... just wanted to finally say it.",
        vibe: 'romance',
        timestamp: '2 mins ago',
        metadata: {
            device: 'iPhone 14 Pro',
            city: 'Brooklyn',
            country: 'US',
            timezone: 'America/New_York',
            screen: '393x852',
            browser: 'Mobile Safari 17'
        }
    },
    {
        id: '2',
        type: 'bouquet' as const,
        bouquetId: 'bouquet-02',
        content: "Happy Valentine's! You deserve the best.",
        timestamp: '15 mins ago',
        metadata: {
            device: 'Samsung S23',
            city: 'Queens',
            country: 'US',
            timezone: 'America/New_York',
            screen: '360x780',
            browser: 'Chrome Mobile'
        }
    },
    {
        id: '3',
        type: 'confession' as const,
        content: "Let's grab coffee sometime? No pressure!",
        vibe: 'coffee',
        timestamp: '1 hour ago',
        metadata: {
            device: 'MacBook Air',
            city: 'Manhattan',
            country: 'US',
            timezone: 'America/New_York',
            screen: '1440x900',
            browser: 'Chrome Desktop'
        }
    }
];

export function InboxDashboard({ slug }: { slug: string }) {
    const [messages, setMessages] = useState(MOCK_MESSAGES);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const refresh = async () => {
        setIsRefreshing(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsRefreshing(false);
    };

    return (
        <div className="w-full max-w-3xl mx-auto space-y-6 pb-20">
            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4">
                <GlassCard className="p-4 text-center space-y-1">
                    <div className="text-3xl font-display text-rose-600">{messages.length}</div>
                    <div className="text-xs uppercase tracking-wider text-gray-500">Messages</div>
                </GlassCard>
                <GlassCard className="p-4 text-center space-y-1">
                    <div className="text-3xl font-display text-lavender-600">3</div>
                    <div className="text-xs uppercase tracking-wider text-gray-500">Senders</div>
                </GlassCard>
                <GlassCard className="p-4 text-center space-y-1">
                    <div className="text-3xl font-display text-gray-400">0</div>
                    <div className="text-xs uppercase tracking-wider text-gray-500">Blocked</div>
                </GlassCard>
            </div>

            {/* Toolbar */}
            <div className="flex justify-between items-center px-2">
                <h2 className="text-xl font-medium text-charcoal">Your Inbox</h2>
                <Button variant="ghost" size="sm" onClick={refresh} disabled={isRefreshing}>
                    <RefreshCcw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Messages Feed */}
            <div className="space-y-4">
                {messages.map((msg) => (
                    <MessageCard key={msg.id} {...msg} />
                ))}
            </div>
        </div>
    );
}
