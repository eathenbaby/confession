import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useConfession, useUpdateConfessionStatus, useGifts } from "@/hooks/use-confessions";
import { Button } from "@/components/ui/button";
import { NoButton } from "@/components/NoButton";
import { Loader2, Heart, Gift, Share2, Instagram } from "lucide-react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { FloatingHearts } from "@/components/FloatingHearts";

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
  
  // Type assertion - public confession doesn't have senderName
  const publicConfession = confession as Omit<typeof confession, 'senderName'> | null;
  const { data: gifts } = useGifts();
  const updateStatus = useUpdateConfessionStatus();
  const { toast } = useToast();

  const [yesScale, setYesScale] = useState(1);
  const [subtitle, setSubtitle] = useState(SUBTITLES[0]);
  const [accepted, setAccepted] = useState(false);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [letterVisible, setLetterVisible] = useState(false);

  useEffect(() => {
    setSubtitle(SUBTITLES[Math.floor(Math.random() * SUBTITLES.length)]);
    
    // Envelope opening sequence
    const timer1 = setTimeout(() => setEnvelopeOpen(true), 2000);
    const timer2 = setTimeout(() => {
      setLetterVisible(true);
      // Confetti burst
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#FF6B9D', '#FFC2E2', '#FFD700', '#E6B8E8']
      });
    }, 3000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
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
        colors: ["#FF6B9D", "#FFC2E2", "#FFD700", "#E6B8E8"]
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#FF6B9D", "#FFC2E2", "#FFD700", "#E6B8E8"]
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#FFF0F5] via-[#FFE5EC] to-[#FFC2E2]">
        <Loader2 className="h-12 w-12 text-[#FF6B9D] animate-spin mb-4" />
        <p className="text-[#C73866] font-medium animate-pulse">Loading feelings...</p>
      </div>
    );
  }

  if (error || !confession) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#FFF0F5] via-[#FFE5EC] to-[#FFC2E2]">
        <h1 className="text-4xl mb-4 gradient-text">404: Heart Not Found 💔</h1>
        <p className="text-gray-600 mb-4">This link might be broken or expired.</p>
        <Button className="mt-8" onClick={() => window.location.href = "/"}>Create Your Own</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#FFF0F5] via-[#FFE5EC] to-[#FFC2E2] flex flex-col items-center justify-center p-4 relative overflow-x-hidden">
      <FloatingHearts />

      <AnimatePresence mode="wait">
        {!letterVisible ? (
          <motion.div
            key="envelope"
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center z-10"
          >
            <motion.div
              animate={envelopeOpen ? { rotateX: -180 } : { rotateX: 0 }}
              transition={{ duration: 1 }}
              style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
              className="text-8xl mb-4"
            >
              💌
            </motion.div>
            <p className="text-xl text-gray-600">Opening your secret confession...</p>
          </motion.div>
        ) : !accepted ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="text-center z-10 max-w-3xl w-full"
          >
            {/* Main Heading */}
            <motion.h1
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold gradient-text-gold mb-8"
              style={{ animation: "pulse-glow 2s ease-in-out infinite" }}
            >
              💌 You've Got a Secret Confession! 💌
            </motion.h1>

            {/* From Card */}
            {publicConfession && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="from-card bg-white p-6 rounded-[20px] border-2 border-[#FFC2E2] shadow-[0_8px_25px_rgba(255,107,157,0.15)] mb-6 relative max-w-2xl mx-auto"
              >
                <div className="absolute -top-5 right-6 text-4xl" style={{ animation: "float 3s ease-in-out infinite" }}>
                  💌
                </div>
                <div className="text-sm uppercase text-gray-400 mb-2">From:</div>
                <div className="text-2xl md:text-3xl font-bold gradient-text mb-4">
                  A Secret Admirer 💕
                </div>
                <div className="flex items-center gap-2 text-gray-400 mb-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent"></div>
                  <span className="text-xs">💕</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent"></div>
                </div>
                {publicConfession.intentOption && (
                  <div className="intent-display flex items-center gap-3 bg-gradient-to-br from-[#FFF0F5] to-[#FFE5EC] p-4 rounded-xl">
                    <span className="text-3xl">
                      {publicConfession.intentOption.includes("coffee") ? "☕" :
                       publicConfession.intentOption.includes("dinner") ? "🌹" :
                       publicConfession.intentOption.includes("movie") ? "🎬" :
                       publicConfession.intentOption.includes("game") ? "🎮" :
                       publicConfession.intentOption.includes("walk") ? "🌳" : "💫"}
                    </span>
                    <span className="text-lg text-[#C73866] font-semibold">
                      {publicConfession.intentOption}
                    </span>
                  </div>
                )}
              </motion.div>
            )}

            {/* Confession Message */}
            {publicConfession?.message && (
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="confession-message bg-gradient-to-br from-white to-[#FFF0F5] p-8 rounded-[20px] border-3 border-transparent relative my-6 max-w-2xl mx-auto"
                style={{
                  borderWidth: "3px",
                  backgroundClip: "padding-box",
                  boxShadow: "0 10px 30px rgba(255, 107, 157, 0.1)",
                }}
              >
                <div
                  className="confession-text font-['Dancing_Script'] text-xl md:text-2xl leading-relaxed text-[#4A4A4A] text-center relative z-10"
                  style={{
                    fontFamily: "'Dancing Script', cursive",
                  }}
                >
                  <span className="text-6xl text-[#FFC2E2] opacity-30 absolute -top-5 -left-3">"</span>
                  {publicConfession.message}
                  <span className="text-6xl text-[#FFC2E2] opacity-30 absolute -bottom-10 -right-3">"</span>
                </div>
              </motion.div>
            )}

            {/* Valentine Prompt */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="valentine-prompt text-center my-12"
            >
              <h2 className="font-['Pacifico'] text-3xl md:text-4xl gradient-text mb-6" style={{ animation: "pulse-glow 2s ease-in-out infinite" }}>
                💕 Will You Be My Valentine? 💕
              </h2>
              
              <p className="text-xl md:text-2xl text-rose-400 font-medium mb-8 h-8">
                {subtitle}
              </p>

              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 min-h-[120px]">
                <motion.button
                  layout
                  style={{ scale: yesScale }}
                  whileHover={{ scale: yesScale * 1.1, rotate: -2 }}
                  whileTap={{ scale: yesScale * 0.9 }}
                  onClick={handleYesClick}
                  className="response-btn yes px-8 py-4 rounded-[50px] text-white font-semibold text-lg shadow-[0_8px_20px_rgba(255,20,147,0.4)] hover:shadow-[0_12px_30px_rgba(255,20,147,0.6)] transition-all min-w-[140px] bg-gradient-to-r from-[#FF6B9D] to-[#FF1493]"
                >
                  Yes! 💖
                </motion.button>

                <div className="relative h-12 w-32 flex items-center justify-center">
                  <NoButton onHover={handleNoHover} />
                </div>
              </div>
            </motion.div>
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

            <h1 className="text-5xl md:text-7xl font-bold gradient-text mb-6">
              YAYYYYY! 🎉💖
            </h1>
            
            <div className="glass-card p-8 rounded-3xl border-4 border-pink-200 shadow-xl mb-12 max-w-lg mx-auto">
              <p className="text-xl text-gray-600 mb-2">They said YES! 🎉</p>
              <h2 className="text-4xl font-bold gradient-text mb-4">Time to celebrate! 💖</h2>
              <p className="text-xl text-gray-600">Your secret admirer is waiting for you to reach out!</p>
              
              {publicConfession?.senderContact && (
                <div className="mt-6 pt-6 border-t border-pink-100">
                  <p className="text-sm text-muted-foreground mb-2">Check their contact info! 😉</p>
                  <a 
                    href={`https://instagram.com/${publicConfession.senderContact.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-bold bg-pink-100 px-4 py-2 rounded-full transition-colors"
                  >
                    <Instagram size={20} />
                    {publicConfession.senderContact}
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
