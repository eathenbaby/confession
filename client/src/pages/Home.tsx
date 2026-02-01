import { CreateForm } from "@/components/CreateForm";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const headlines = [
    "Shoot Your Shot 🏹",
    "Don't Die Single 💀",
    "Be Bold, Be Cringe 🤪",
    "Send a Virtual Rose 🌹",
  ];
  
  const randomHeadline = headlines[Math.floor(Math.random() * headlines.length)];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 left-10 opacity-20 animate-pulse text-pink-400">
        <Heart size={64} fill="currentColor" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-20 animate-pulse text-red-400" style={{ animationDelay: "1s" }}>
        <Heart size={96} fill="currentColor" />
      </div>
      <div className="absolute top-1/4 right-1/4 opacity-10 text-rose-300">
        <Heart size={48} fill="currentColor" />
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8 relative z-10"
      >
        <header className="text-center space-y-4">
          <div className="inline-block bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full border border-pink-100 shadow-sm mb-4">
            <span className="text-sm font-medium text-pink-500 tracking-wide uppercase">
              Cupid's Helper v2.0
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-pink-500 bg-clip-text text-transparent pb-2 drop-shadow-sm">
            {randomHeadline}
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
            Create a cute, interactive "Will You Be My Valentine?" page. 
            If they say no, the button runs away. Literally. 🏃‍♂️💨
          </p>
        </header>

        <CreateForm />

        <footer className="mt-12 text-center text-sm text-muted-foreground/60">
          <p>© {new Date().getFullYear()} Made with 💖 and a bit of desperation.</p>
        </footer>
      </motion.div>
    </div>
  );
}
