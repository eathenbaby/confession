import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Share2, 
  Download, 
  Calendar,
  Mail,
  Send,
  ArrowLeft,
  Eye,
  EyeOff,
  Gift,
  Sparkles
} from 'lucide-react';

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
  sentAt?: string;
}

const flowers = {
  rose: { name: 'Rose', color: '#c41e3a', icon: '🌹' },
  sunflower: { name: 'Sunflower', color: '#f4d03f', icon: '🌻' },
  tulip: { name: 'Tulip', color: '#ff6b9d', icon: '🌷' },
  daisy: { name: 'Daisy', color: '#f0f0e0', icon: '🌼' },
  orchid: { name: 'Orchid', color: '#9b7fb7', icon: '🌺' },
  lily: { name: 'Lily', color: '#f9d4e0', icon: '🌸' },
  carnation: { name: 'Carnation', color: '#f4b4c4', icon: '🌺' },
  iris: { name: 'Iris', color: '#6f4f8b', icon: '🌺' },
  poppy: { name: 'Poppy', color: '#ff6b35', icon: '🌺' },
};

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

export default function BouquetViewer() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [bouquet, setBouquet] = useState<Bouquet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchBouquet = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/bouquets/${id}`);
        
        if (response.ok) {
          const data = await response.json();
          setBouquet(data.bouquet);
        } else {
          throw new Error('Bouquet not found');
        }
      } catch (err) {
        setError('Failed to load bouquet');
        console.error('Error fetching bouquet:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBouquet();
  }, [id]);

  const handleShare = async () => {
    if (bouquet?.url) {
      try {
        await navigator.clipboard.writeText(bouquet.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const handleSend = async () => {
    if (!bouquet) return;
    
    try {
      const response = await fetch(`/api/bouquets/${id}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const result = await response.json();
        setBouquet(prev => prev ? { ...prev, sentAt: new Date().toISOString() } : null);
        alert('Bouquet sent successfully!');
      } else {
        throw new Error('Failed to send bouquet');
      }
    } catch (err) {
      console.error('Error sending bouquet:', err);
      alert('Failed to send bouquet. Please try again.');
    }
  };

  const renderBouquet = () => {
    if (!bouquet) return null;
    
    const currentTheme = themes[bouquet.theme];
    const selectedFlowerObjects = bouquet.flowerTypes.map(flowerId => flowers[flowerId as keyof typeof flowers]);

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            {/* Back button */}
            <div className="mb-6">
              <button
                onClick={() => window.history.back()}
                className="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Creator
              </button>
            </div>

            {/* Bouquet Display */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header with theme styling */}
              <div 
                className="relative h-48 flex items-center justify-center text-center p-6"
                style={{ background: currentTheme.background }}
              >
                <motion.h1 
                  className="text-3xl font-bold mb-2"
                  style={{ color: currentTheme.textColor }}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Digital Bouquet
                </motion.h1>
                <motion.p 
                  className="text-lg opacity-90"
                  style={{ color: currentTheme.textColor }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  For {bouquet.recipientName}
                </motion.p>
              </div>

              {/* Flower Arrangement */}
              <div className="relative h-80 bg-gradient-to-b from-pink-50 to-purple-50">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    {selectedFlowerObjects.map((flower, index) => (
                      <motion.div
                        key={flower.id}
                        className="absolute"
                        style={{
                          top: `${15 + (index % 3) * 20}%`,
                          left: `${10 + (index % 2) * 40}%`,
                          color: flower.color,
                        }}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ 
                          scale: 1.1, 
                          rotate: [5, -5, 3, -3][index % 4],
                          transition: { duration: 0.3 }
                        }}
                      >
                        <div className="text-5xl drop-shadow-lg">{flower.icon}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Message Card */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <motion.div
                    className="bg-white/95 backdrop-blur-sm rounded-xl p-6 max-w-sm mx-auto shadow-lg"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    <p className="text-gray-800 text-base font-medium text-center leading-relaxed mb-4">
                      {bouquet.message}
                    </p>
                    <div className="flex items-center justify-center space-x-3 text-sm text-gray-600">
                      <span>From: {bouquet.senderName}</span>
                      <Heart className="w-4 h-4 text-red-500 fill-current" />
                      <span>To: {bouquet.recipientName}</span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Details Section */}
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Created
                    </h3>
                    <p className="text-gray-900">
                      {new Date(bouquet.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Palette className="w-4 h-4 mr-2" />
                      Theme
                    </h3>
                    <p className="text-gray-900">{currentTheme.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Flowers</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedFlowerObjects.map((flower) => (
                        <span key={flower.id} className="text-2xl" title={flower.name}>
                          {flower.icon}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {bouquet.deliveryDate && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Delivery Date
                      </h3>
                      <p className="text-gray-900">
                        {new Date(bouquet.deliveryDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                  
                  {bouquet.sentAt && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Send className="w-4 h-4 mr-2" />
                        Status
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600 font-medium">Sent</span>
                        <span className="text-gray-500">
                          on {new Date(bouquet.sentAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 bg-gray-100 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Bouquet
                  </button>
                  
                  {!bouquet.sentAt && (
                    <button
                      onClick={handleSend}
                      className="flex-1 px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium flex items-center justify-center"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send to Recipient
                    </button>
                  )}
                  
                  <button
                    onClick={() => window.print()}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium flex items-center justify-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Save as Image
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-6xl mb-4"
          >
            🌸
          </motion.div>
          <p className="text-gray-600 text-lg">Loading beautiful bouquet...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Bouquet Not Found</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={() => window.location.href = '/bouquet/create'}
            className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Create New Bouquet
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {renderBouquet()}
      
      {/* Share Modal */}
      {showShareModal && bouquet && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowShareModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Share This Bouquet</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <EyeOff className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bouquet URL
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={bouquet.url}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
                  />
                  <button
                    onClick={handleShare}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm flex items-center"
                  >
                    {copied ? (
                      <>
                        <Eye className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-2" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <p>Share this beautiful digital bouquet with your crush!</p>
                <p>They can view the arrangement and your heartfelt message.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
