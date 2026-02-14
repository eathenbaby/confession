import { cookies } from 'next/headers';
import { InboxGate } from '@/components/InboxGate';
import { InboxDashboard } from '@/components/InboxDashboard';
import { AnimatedBackground } from '@/components/AnimatedBackground';

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const slug = (await params).slug;
    const cookieStore = await cookies();
    const isAuthenticated = cookieStore.get(`auth-${slug}`);

    return (
        <main className="min-h-screen p-4 flex flex-col items-center">
            <AnimatedBackground />
            <div className="w-full pt-10">
                {isAuthenticated ? (
                    <InboxDashboard slug={slug} />
                ) : (
                    <InboxGate slug={slug} />
                )}
            </div>
        </main>
    );
}
