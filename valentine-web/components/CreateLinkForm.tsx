'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { GlassCard } from './ui/GlassCard';
import { ArrowRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const schema = z.object({
    displayName: z.string().min(2, 'Name must be at least 2 characters').max(30),
    slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-zA-Z0-9-_]+$/, 'Only letters, numbers, dashes, and underscores allowed'),
    passcode: z.string().min(4, 'Passcode must be at least 4 characters'),
});

type FormData = z.infer<typeof schema>;

export function CreateLinkForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            displayName: '',
            slug: '',
            passcode: '',
        }
    });

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        try {
            // TODO: Call API to create link
            console.log('Creating link:', data);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast.success('Your Valentine link has been created!');
            router.push(`/to/${data.slug}`);
        } catch (error) {
            toast.error('Failed to create link. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <GlassCard className="max-w-md w-full mx-auto" hoverEffect={false}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-display font-medium text-rose-600 mb-2">Create Your Link</h2>
                    <p className="text-sm text-gray-500">Share it to receive honest messages.</p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-charcoal/80">Display Name</label>
                    <Input
                        {...register('displayName')}
                        placeholder="e.g. Sarah J."
                    />
                    {errors.displayName && <p className="text-xs text-rose-500">{errors.displayName.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-charcoal/80">Custom URL</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">valentine.app/</span>
                        <Input
                            {...register('slug')}
                            className="pl-28"
                            placeholder="sarah"
                        />
                    </div>
                    {errors.slug && <p className="text-xs text-rose-500">{errors.slug.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-charcoal/80">Private Passcode</label>
                    <Input
                        {...register('passcode')}
                        type="password"
                        placeholder="For your eyes only"
                    />
                    {errors.passcode && <p className="text-xs text-rose-500">{errors.passcode.message}</p>}
                </div>

                <Button
                    type="submit"
                    className="w-full mt-4 bg-gradient-to-r from-rose-400 to-rose-600 hover:from-rose-500 hover:to-rose-700 text-white shadow-rose/30"
                    size="lg"
                    isLoading={isLoading}
                >
                    <span>Create My Valentine Link</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </form>
        </GlassCard>
    );
}
