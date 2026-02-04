'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { confessionSubmissionSchema } from '../../../shared/schema';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Heart, Coffee, Utensils, MessageCircle, BookOpen, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingHearts } from './FloatingHearts';

const vibeOptions = [
  { id: 'coffee_date', label: 'Coffee Date', icon: Coffee, color: 'bg-amber-500', description: 'Casual coffee, get to know each other' },
  { id: 'dinner', label: 'Dinner', icon: Utensils, color: 'bg-rose-500', description: 'Nice dinner, proper date' },
  { id: 'just_talk', label: 'Just Talk', icon: MessageCircle, color: 'bg-blue-500', description: 'Want to talk and see where it goes' },
  { id: 'study_session', label: 'Study Session', icon: BookOpen, color: 'bg-green-500', description: 'Study together, maybe more' },
  { id: 'adventure', label: 'Adventure', icon: Sparkles, color: 'bg-purple-500', description: 'Something exciting and spontaneous' },
  { id: 'the_one', label: 'The One', icon: Heart, color: 'bg-red-500', description: 'I think you might be the one' },
];

interface ConfessionFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  user?: {
    fullName: string;
    email: string;
    instagramUsername?: string;
  };
}

export default function ConfessionForm({ onSubmit, isLoading = false, user }: ConfessionFormProps) {
  const [selectedVibe, setSelectedVibe] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm({
    resolver: zodResolver(confessionSubmissionSchema),
    defaultValues: {
      vibeType: '',
      message: ''
    }
  });

  const message = watch('message');
  const characterCount = message?.length || 0;

  const handleVibeSelect = (vibeId: string) => {
    setSelectedVibe(vibeId);
    setValue('vibeType', vibeId);
  };

  const onFormSubmit = (data: any) => {
    onSubmit(data);
    setShowSuccess(true);
  };

  if (showSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto"
      >
        <Card className="border-0 shadow-xl bg-gradient-to-br from-pink-50 to-purple-50">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Heart className="w-10 h-10 text-white" />
            </motion.div>
            
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-4">
              Confession Submitted! 💕
            </h2>
            
            <p className="text-gray-600 mb-6">
              Your anonymous confession has been submitted to our admin team for review. 
              If approved, it will be posted to our Instagram page soon!
            </p>
            
            <div className="bg-white rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 mb-2">What happens next:</p>
              <ul className="text-left text-sm text-gray-600 space-y-2">
                <li>• Admin reviews your confession (usually within 24 hours)</li>
                <li>• If approved, we create a beautiful Instagram post</li>
                <li>• People can see it and ask to reveal who sent it</li>
                <li>• You stay anonymous unless someone pays to reveal</li>
              </ul>
            </div>
            
            <Button 
              onClick={() => setShowSuccess(false)}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              Submit Another Confession
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <FloatingHearts />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-0 shadow-xl bg-gradient-to-br from-pink-50 to-purple-50">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Send an Anonymous Confession 💕
            </CardTitle>
            <p className="text-gray-600">
              Your identity will be hidden. We'll post it to Instagram and people can pay to reveal who sent it.
            </p>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            {user && (
              <div className="mb-6 p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Submitting as:</p>
                <p className="font-semibold">{user.fullName}</p>
                {user.instagramUsername && (
                  <p className="text-sm text-gray-600">@{user.instagramUsername}</p>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
              {/* Vibe Selector */}
              <div>
                <label className="block text-lg font-semibold mb-4 text-gray-700">
                  What's the vibe? 💫
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vibeOptions.map((vibe) => {
                    const Icon = vibe.icon;
                    const isSelected = selectedVibe === vibe.id;
                    
                    return (
                      <motion.div
                        key={vibe.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? 'ring-2 ring-purple-500 bg-white shadow-lg'
                              : 'hover:shadow-md bg-white/80'
                          }`}
                          onClick={() => handleVibeSelect(vibe.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <div className={`w-10 h-10 rounded-lg ${vibe.color} flex items-center justify-center flex-shrink-0`}>
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-800">{vibe.label}</h3>
                                <p className="text-sm text-gray-600">{vibe.description}</p>
                              </div>
                              {isSelected && (
                                <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full" />
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
                {errors.vibeType && (
                  <p className="text-red-500 text-sm mt-2">{errors.vibeType.message}</p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-lg font-semibold mb-4 text-gray-700">
                  Your Confession 💌
                </label>
                <div className="relative">
                  <Textarea
                    {...register('message')}
                    placeholder="Write your anonymous confession here... Be honest, be vulnerable, be real. This will be posted publicly (but your identity stays hidden)."
                    className="min-h-[150px] resize-none border-2 focus:border-purple-500 rounded-lg"
                    maxLength={1000}
                  />
                  <div className="absolute bottom-2 right-2 text-sm text-gray-400">
                    {characterCount}/1000
                  </div>
                </div>
                {errors.message && (
                  <p className="text-red-500 text-sm mt-2">{errors.message.message}</p>
                )}
              </div>

              {/* Guidelines */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Community Guidelines:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Be respectful and kind in your confession</li>
                  <li>• No inappropriate content or harassment</li>
                  <li>• Your identity will remain anonymous</li>
                  <li>• We reserve the right to reject inappropriate confessions</li>
                </ul>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={!isValid || isLoading}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-3 text-lg font-semibold disabled:opacity-50"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    'Submit Confession 💕'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
