import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertConfessionSchema, type InsertConfession } from "@shared/schema";
import { useCreateConfession } from "@/hooks/use-confessions";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function CreateForm() {
  const { toast } = useToast();
  const createMutation = useCreateConfession();
  const [createdId, setCreatedId] = useState<string | null>(null);

  const form = useForm<InsertConfession>({
    resolver: zodResolver(insertConfessionSchema),
    defaultValues: {
      senderName: "",
      senderContact: "",
    },
  });

  const onSubmit = (data: InsertConfession) => {
    createMutation.mutate(data, {
      onSuccess: (confession) => {
        setCreatedId(confession.id);
        toast({
          title: "Link Created! 💘",
          description: "Time to shoot your shot!",
        });
      },
      onError: () => {
        toast({
          title: "Oops! 💔",
          description: "Something went wrong. Try again!",
          variant: "destructive",
        });
      },
    });
  };

  const copyLink = () => {
    if (!createdId) return;
    const link = `${window.location.origin}/v/${createdId}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Copied! 🔗",
      description: "Send it to your crush ASAP!",
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto"
      >
        <div className="glass-card rounded-3xl p-8 border-2 border-pink-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl text-primary mb-2">Create Your Valentine</h2>
            <p className="text-muted-foreground">Don't be shy, just send it! 🫣</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="senderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold text-foreground/80">Your Name (The Secret Admirer)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Rahul, Priya, 'Mystery Boy'" 
                        className="bg-white/50 border-pink-200 focus:border-pink-400 focus:ring-pink-200 h-12 text-lg rounded-xl"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="senderContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold text-foreground/80">Insta Handle (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="@cutie.pie" 
                        className="bg-white/50 border-pink-200 focus:border-pink-400 focus:ring-pink-200 h-12 text-lg rounded-xl"
                        value={field.value || ""} 
                        onChange={field.onChange} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                disabled={createMutation.isPending}
                className="w-full h-14 text-xl font-bold rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all active:scale-95"
              >
                {createMutation.isPending ? (
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                ) : (
                  <>
                    Create Link <Sparkles className="ml-2 h-5 w-5 fill-white" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </motion.div>

      <Dialog open={!!createdId} onOpenChange={() => setCreatedId(null)}>
        <DialogContent className="glass-card sm:max-w-md border-2 border-pink-200">
          <DialogHeader>
            <DialogTitle className="text-3xl text-center text-primary pt-4">It's Ready! 🎉</DialogTitle>
            <DialogDescription className="text-center text-lg text-foreground/80">
              Your secret valentine link has been generated. Send it now or regret it later!
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-6 py-6">
            <div className="bg-pink-50 p-4 rounded-xl border border-pink-200 w-full text-center break-all font-mono text-sm text-pink-600">
              {window.location.origin}/v/{createdId}
            </div>
            <Button 
              onClick={copyLink}
              className="w-full h-12 text-lg bg-primary hover:bg-primary/90 text-white rounded-xl shadow-md"
            >
              Copy Link 🔗
            </Button>
            <p className="text-xs text-muted-foreground text-center px-4">
              Tip: Send this to them and say "I found something weird about you..." works every time 😉
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
