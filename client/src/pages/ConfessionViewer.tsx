import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useConfession, useUpdateConfessionStatus, useGifts } from "@/hooks/use-confessions";
import { Button } from "@/components/ui/button";
import { NoButton } from "@/components/NoButton";
import { Loader2, Heart, Gift, Share2, Instagram } from "lucide-react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const SUBTITLES = [
  "Someone thinks you're adorable! 🥺",
  "You > My CGPA fr 📉",
  "Capybaras approve this message 🦦",
  "Mom said it's my turn to date you 😤",
  "Are you a loan? Coz you got my interest 💸",
  "Is your name Wi-Fi? I'm feeling a connection 📶",
];

export default function ConfessionViewer() {
  const [, params] = useRoute("/v/:id");
  const id = params?.id || "";
  const { data: confession, isLoading, error } = useConfession(id);
  const { data: gifts } = useGifts();
  const updateStatus = useUpdateConfessionStatus();
  const { toast } = useToast();

  const [yesScale, setYesScale] = useState(1);
  const [subtitle, setSubtitle] = useState(SUBTITLES[0]);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    setSubtitle(SUBTITLES[Math.floor(Math.random() * SUBTITLES.length)]);
  }, []);

  useEffect(() => {
    if (confession?.response === "yes") {
      setAccepted(true);
    }
  }, [confession?.response]);

  const handleNoHover = () => {
    setYesScale((prev) => Math.min(prev + 0.1, 3));
  };

  const handleYesClick = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#ff4d6d", "#ff8fa3", "#ffffff"]
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#ff4d6d", "#ff8fa3", "#ffffff"]
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    updateStatus.mutate({ id, response: "yes" });
    setAccepted(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50">
        <Loader2 className="h-12 w-12 text-pink-500 animate-spin mb-4" />
        <p className="text-pink-400 font-medium animate-pulse">Loading feelings...</p>
      </div>
    );
  }

  if (error || !confession) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-pink-50">
        <h1 className="text-4xl mb-4">404: Heart Not Found 💔</h1>
        <p className="text-muted-foreground">This link might be broken or expired.</p>
        <Button className="mt-8" onClick={() => window.location.href = "/"}>Create Your Own</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-pink-50 flex flex-col items-center justify-center p-4 relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-40" style={{
        backgroundImage: "radial-gradient(#ffccd5 1px, transparent 1px)",
        backgroundSize: "30px 30px"
      }}></div>

      <AnimatePresence mode="wait">
        {!accepted ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="text-center z-10 max-w-2xl w-full"
          >
            <div className="mb-8 relative inline-block">
              <img 
                src="https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=400&h=400&fit=crop&crop=center" 
                alt="Cute puppy"
                className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border-4 border-white shadow-xl mx-auto"
              />
              <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md animate-bounce">
                <Heart className="text-red-500 fill-red-500" />
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-rose-600 mb-4 drop-shadow-sm px-4">
              Will you be my Valentine? 🌹
            </h1>
            
            <p className="text-xl md:text-2xl text-rose-400 font-medium mb-12 h-8">
              {subtitle}
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 min-h-[120px]">
              <motion.button
                layout
                style={{ scale: yesScale }}
                whileHover={{ scale: yesScale * 1.1 }}
                whileTap={{ scale: yesScale * 0.9 }}
                onClick={handleYesClick}
                className="px-8 py-3 bg-gradient-to-tr from-green-400 to-green-600 text-white font-bold text-xl rounded-full shadow-lg shadow-green-400/30 hover:shadow-green-400/50 transition-shadow min-w-[120px] z-50"
              >
                YES! 😍
              </motion.button>

              <div className="relative h-12 w-32 flex items-center justify-center">
                <NoButton onHover={handleNoHover} />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center z-10 w-full max-w-3xl"
          >
             <motion.img 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                src="https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=500&h=300&fit=crop" 
                alt="Celebration"
                className="w-full max-w-md mx-auto rounded-3xl shadow-2xl mb-8 border-4 border-white rotate-2 hover:rotate-0 transition-transform duration-500"
              />

            <h1 className="text-5xl md:text-7xl font-bold text-rose-600 mb-6 drop-shadow-sm">
              YAYYYYY! 🎉💖
            </h1>
            
            <div className="glass-card p-8 rounded-3xl border-4 border-pink-200 shadow-xl mb-12 max-w-lg mx-auto">
              <p className="text-xl text-gray-600 mb-2">It was</p>
              <h2 className="text-4xl font-bold text-primary mb-4">{confession.senderName}</h2>
              <p className="text-xl text-gray-600">all along!</p>
              
              {confession.senderContact && (
                <div className="mt-6 pt-6 border-t border-pink-100">
                  <p className="text-sm text-muted-foreground mb-2">Slide into their DMs maybe? 😉</p>
                  <a 
                    href={`https://instagram.com/${confession.senderContact.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-bold bg-pink-100 px-4 py-2 rounded-full transition-colors"
                  >
                    <Instagram size={20} />
                    {confession.senderContact}
                  </a>
                </div>
              )}
            </div>

            <div className="w-full max-w-2xl mx-auto mt-16">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Gift className="text-purple-500" />
                <h3 className="text-2xl font-bold text-purple-700">Send a Virtual Gift</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {gifts?.map((gift) => (
                  <motion.div 
                    key={gift.id}
                    whileHover={{ y: -5 }}
                    className="bg-white p-4 rounded-xl shadow-md border border-purple-100 cursor-pointer hover:shadow-lg transition-all"
                    onClick={() => toast({ title: "Coming Soon!", description: "Payments aren't real yet, but the love is! 💖" })}
                  >
                    <div className="text-4xl mb-2">{gift.emoji}</div>
                    <p className="font-bold text-gray-800">{gift.name}</p>
                    <p className="text-sm text-purple-600 font-medium">{gift.price}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <Button 
              variant="outline" 
              className="mt-16 rounded-full border-2"
              onClick={() => window.location.href = "/"}
            >
              <Share2 className="mr-2 h-4 w-4" /> Create Your Own Link
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
