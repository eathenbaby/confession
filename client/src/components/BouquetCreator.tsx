import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import { 
  Heart, 
  Sparkles, 
  Send, 
  Flower2,
  Calendar,
  User,
  Mail,
  Eye,
  EyeOff,
  Palette,
  Gift
} from 'lucide-react';

interface Flower {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface Bouquet {
  id: string;
  senderName: string;
  recipientName: string;
  message: string;
  flowerTypes: string[];
  theme: 'romantic' | 'friendly' | 'cheerful' | 'elegant';
  isPublic: boolean;
  deliveryDate?: string;
  createdAt: string;
  url?: string;
}

const flowers: Flower[] = [
  { id: 'rose', name: 'Rose', color: '#c41e3a', icon: '🌹' },
  { id: 'sunflower', name: 'Sunflower', color: '#f4d03f', icon: '🌻' },
  { id: 'tulip', name: 'Tulip', color: '#ff6b9d', icon: '🌷' },
  { id: 'daisy', name: 'Daisy', color: '#f0f0e0', icon: '🌼' },
  { id: 'orchid', name: 'Orchid', color: '#9b7fb7', icon: '🌺' },
  { id: 'lily', name: 'Lily', color: '#f9d4e0', icon: '🌸' },
  { id: 'carnation', name: 'Carnation', color: '#f4b4c4', icon: '🌺' },
  { id: 'iris', name: 'Iris', color: '#6f4f8b', icon: '🌺' },
  { id: 'poppy', name: 'Poppy', color: '#ff6b35', icon: '🌺' },
];

const themes = {
  romantic: {
    name: 'Romantic',
    background: 'linear-gradient(135deg, #ff6b9d 0%, #c41e3a 100%)',
    textColor: '#ffffff',
    accentColor: '#ff6b9d',
  },
  friendly: {
    name: 'Friendly',
    background: 'linear-gradient(135deg, #f9d4e0 0%, #f4b4c4 100%)',
    textColor: '#2d3748',
    accentColor: '#f9d4e0',
  },
  cheerful: {
    name: 'Cheerful',
    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    textColor: '#ffffff',
    accentColor: '#fbbf24',
  },
  elegant: {
    name: 'Elegant',
    background: 'linear-gradient(135deg, #64748b 0%, #1e293b 100%)',
    textColor: '#ffffff',
    accentColor: '#64748b',
  },
};

const bouquetSchema = z.object({
  senderName: z.string().min(1, 'Your name is required'),
  senderEmail: z.string().email('Please enter a valid email').optional(),
  recipientName: z.string().min(1, 'Recipient name is required'),
  recipientEmail: z.string().email('Please enter a valid email').optional(),
  message: z.string().min(1, 'Message is required').max(500, 'Message is too long (max 500 characters)'),
  flowerTypes: z.array(z.string()).min(1, 'Please select at least one flower'),
  theme: z.enum(['romantic', 'friendly', 'cheerful', 'elegant']).default('romantic'),
  isPublic: z.boolean().default(false),
  deliveryDate: z.string().optional(),
});

export default function BouquetCreator() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    recipientName: '',
    recipientEmail: '',
    message: '',
    flowerTypes: [] as string[],
    theme: 'romantic' as const,
    isPublic: false,
    deliveryDate: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdBouquet, setCreatedBouquet] = useState<Bouquet | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        if (!formData.senderName.trim()) newErrors.senderName = 'Your name is required';
        if (!formData.recipientName.trim()) newErrors.recipientName = 'Recipient name is required';
        break;
      case 2:
        if (!formData.message.trim()) newErrors.message = 'Message is required';
        if (formData.message.length > 500) newErrors.message = 'Message is too long (max 500 characters)';
        if (formData.flowerTypes.length === 0) newErrors.flowerTypes = 'Please select at least one flower';
        break;
      case 3:
        if (!formData.senderEmail.trim() && !formData.senderEmail.includes('@')) {
          newErrors.senderEmail = 'Please enter a valid email';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
      setErrors({});
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/bouquets/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setCreatedBouquet(result.bouquet);
        setStep(4); // Success step
      } else {
        throw new Error('Failed to create bouquet');
      }
    } catch (error) {
      console.error('Error creating bouquet:', error);
      setErrors({ submit: 'Failed to create bouquet. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderBouquetPreview = () => {
    const currentTheme = themes[formData.theme];
    const selectedFlowers = flowers.filter(f => formData.flowerTypes.includes(f.id));

    return (
      <div 
        className="relative w-full h-96 rounded-xl overflow-hidden shadow-2xl"
        style={{ background: currentTheme.background }}
      >
        {/* Decorative header */}
        <div className="absolute top-0 left-0 right-0 p-6 text-center">
          <h3 className="text-2xl font-bold" style={{ color: currentTheme.textColor }}>
            Digital Bouquet
          </h3>
          <p className="text-sm opacity-80" style={{ color: currentTheme.textColor }}>
            For {formData.recipientName}
          </p>
        </div>

        {/* Flower arrangement */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full">
            {selectedFlowers.map((flower, index) => (
              <motion.div
                key={flower.id}
                className="absolute"
                style={{
                  top: `${20 + (index % 3) * 25}%`,
                  left: `${15 + (index % 2) * 35}%`,
                  color: flower.color,
                }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-6xl">{flower.icon}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Message card */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <motion.div
            className="bg-white/90 backdrop-blur-sm rounded-lg p-4 max-w-xs mx-auto"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <p className="text-gray-800 text-sm font-medium text-center leading-relaxed">
              {formData.message}
            </p>
            <div className="flex items-center justify-center mt-3 space-x-2">
              <span className="text-gray-600 text-xs">From: {formData.senderName}</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span className="text-gray-600 text-xs">To: {formData.recipientName}</span>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1 
              className="text-4xl font-bold text-gray-800 mb-2"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              🌸 Create Your Digital Bouquet
            </motion.h1>
            <p className="text-gray-600 text-lg">
              Send a beautiful digital flower arrangement to your crush
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex justify-center mb-8">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className={`w-12 h-1 rounded-full mx-1 transition-all duration-300 ${
                  step >= num ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {step === 4 && createdBouquet ? (
            /* Success Screen */
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                  className="text-6xl mb-4"
                >
                  🎉
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Bouquet Created Successfully!
                </h2>
                <p className="text-gray-600 mb-6">
                  Your digital bouquet has been created and is ready to send.
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Bouquet URL:</strong>
                  </p>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={createdBouquet.url}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <button
                      onClick={() => navigator.clipboard.writeText(createdBouquet.url || '')}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowPreview(true)}
                    className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    View Bouquet
                  </button>
                  <button
                    onClick={() => {
                      // Send functionality would go here
                      alert('Send functionality would be implemented here');
                    }}
                    className="flex-1 px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
                  >
                    Send to Recipient
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Form Steps */
            <form onSubmit={handleSubmit} className="space-y-8">
              {step === 1 && (
                /* Step 1: Basic Info */
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                      <User className="w-6 h-6 mr-3" />
                      Who's sending this bouquet?
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          value={formData.senderName}
                          onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            errors.senderName ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter your name"
                        />
                        {errors.senderName && (
                          <p className="mt-1 text-sm text-red-600">{errors.senderName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Recipient's Name *
                        </label>
                        <input
                          type="text"
                          value={formData.recipientName}
                          onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            errors.recipientName ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter their name"
                        />
                        {errors.recipientName && (
                          <p className="mt-1 text-sm text-red-600">{errors.recipientName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Email (optional)
                        </label>
                        <input
                          type="email"
                          value={formData.senderEmail}
                          onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            errors.senderEmail ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="your@email.com"
                        />
                        {errors.senderEmail && (
                          <p className="mt-1 text-sm text-red-600">{errors.senderEmail}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end mt-6">
                      <button
                        type="button"
                        onClick={nextStep}
                        className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                      >
                        Next Step
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                /* Step 2: Message */
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                      <Heart className="w-6 h-6 mr-3" />
                      What's your message?
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Message *
                        </label>
                        <textarea
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          rows={6}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            errors.message ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Write your heartfelt message here..."
                          maxLength={500}
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{formData.message.length}/500 characters</span>
                        </div>
                        {errors.message && (
                          <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between mt-6">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                      >
                        Next Step
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                /* Step 3: Flower Selection */
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                      <Flower2 className="w-6 h-6 mr-3" />
                      Choose Your Flowers
                    </h2>
                    
                    {/* Theme Selection */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Bouquet Theme
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(themes).map(([key, theme]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setFormData({ ...formData, theme: key as any })}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              formData.theme === key 
                                ? 'border-purple-500 bg-purple-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div 
                              className="w-full h-16 rounded mb-2"
                              style={{ background: theme.background }}
                            />
                            <p className="text-sm font-medium">{theme.name}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Flower Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Select Flowers *
                      </label>
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                        {flowers.map((flower) => (
                          <button
                            key={flower.id}
                            type="button"
                            onClick={() => {
                              const newFlowers = formData.flowerTypes.includes(flower.id)
                                ? formData.flowerTypes.filter(f => f !== flower.id)
                                : [...formData.flowerTypes, flower.id];
                              setFormData({ ...formData, flowerTypes: newFlowers });
                            }}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              formData.flowerTypes.includes(flower.id)
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="text-3xl mb-2">{flower.icon}</div>
                            <p className="text-sm font-medium">{flower.name}</p>
                          </button>
                        ))}
                      </div>
                      {errors.flowerTypes && (
                        <p className="mt-2 text-sm text-red-600">{errors.flowerTypes}</p>
                      )}
                    </div>

                    <div className="flex justify-between mt-6">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPreview(true)}
                        className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                      >
                        Preview Bouquet
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                /* Step 4: Final Review */
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                      <Eye className="w-6 h-6 mr-3" />
                      Review Your Bouquet
                    </h2>
                    
                    <div className="space-y-4 mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 mb-2">From:</h3>
                          <p className="text-gray-900">{formData.senderName}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 mb-2">To:</h3>
                          <p className="text-gray-900">{formData.recipientName}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Theme:</h3>
                        <p className="text-gray-900">{themes[formData.theme].name}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Flowers:</h3>
                        <div className="flex flex-wrap gap-2">
                          {formData.flowerTypes.map(flowerId => {
                            const flower = flowers.find(f => f.id === flowerId);
                            return flower ? (
                              <span key={flowerId} className="text-2xl">
                                {flower.icon}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Message:</h3>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{formData.message}</p>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors font-medium flex items-center"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-r-2 border-t-2 border-l-2 border-purple-600 mr-2"></div>
                            Creating...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Create Bouquet
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </form>
          )}
        </motion.div>

        {/* Preview Modal */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowPreview(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">Bouquet Preview</h3>
                    <button
                      onClick={() => setShowPreview(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <EyeOff className="w-6 h-6" />
                    </button>
                  </div>
                  {renderBouquetPreview()}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
