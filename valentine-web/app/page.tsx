import { AnimatedBackground } from '@/components/AnimatedBackground';
import { CreateLinkForm } from '@/components/CreateLinkForm';
import { GlassCard } from '@/components/ui/GlassCard';
import { Shield, Sparkles, Heart } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground />

      <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 z-10 pt-20 lg:pt-0">

        {/* Hero Section */}
        <div className="flex-1 text-center lg:text-left space-y-6">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/30 backdrop-blur-md border border-white/40 text-rose-600 text-sm font-medium animate-fade-in-up">
            <Sparkles className="w-4 h-4 mr-2" />
            <span>Honesty is the new romance</span>
          </div>

          <h1 className="font-display text-6xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-br from-rose-500 to-rose-700 animate-fade-in drop-shadow-sm pb-2">
            Valentine
          </h1>

          <p className="text-xl lg:text-2xl font-light text-charcoal/80 max-w-lg mx-auto lg:mx-0">
            Say what you feel — honestly.
            <br />
            <span className="text-base text-gray-500 mt-2 block">
              The ethical, transparent anonymous messaging platform.
            </span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
            <FeatureCard
              icon={<Heart className="w-6 h-6 text-rose-500" />}
              title="Digital Bouquets"
              description="Send illustrated flowers with your message."
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-lavender-600" />}
              title="Safe & Honest"
              description="Transparency about what creators see."
            />
            <FeatureCard
              icon={<Sparkles className="w-6 h-6 text-amber-500" />}
              title="Confessions"
              description="Share your true feelings, anonymously."
            />
          </div>
        </div>

        {/* Form Section */}
        <div className="flex-1 w-full max-w-md">
          <CreateLinkForm />
        </div>
      </div>

      <footer className="absolute bottom-4 text-center w-full text-sm text-gray-400 z-10">
        &copy; {new Date().getFullYear()} Valentine Platform. Built with transparency.
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <GlassCard className="p-4 flex flex-col items-center text-center space-y-2 bg-white/10" hoverEffect={true}>
      <div className="p-2 bg-white/40 rounded-full">
        {icon}
      </div>
      <h3 className="font-medium text-charcoal">{title}</h3>
      <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
    </GlassCard>
  );
}
