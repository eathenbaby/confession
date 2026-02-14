import { SendPage } from '@/components/SendPage';
import { AnimatedBackground } from '@/components/AnimatedBackground';

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const slug = (await params).slug;

    return (
        <main className="min-h-screen p-4 flex flex-col items-center">
            <AnimatedBackground />
            <div className="w-full pt-10">
                <SendPage slug={slug} />
            </div>
        </main>
    );
}
