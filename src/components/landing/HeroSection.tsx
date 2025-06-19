import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Globe, Linkedin, Instagram, Youtube, Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { GoogleUser } from '@/lib/google-auth';
import SparklesCore from './SparklesCore';
import NorthSouthMagnetButton from './NorthSouthMagnetButton';

interface HeroSectionProps {
  user: GoogleUser | null;
}

interface PlatformType {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  borderColor: string;
  placeholder: string;
}

// Custom Twitter/X Icon Component - Fixed for better visibility
const TwitterIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

// Curved Arrow Components - Comic Book Style
const CurvedArrowLeft: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 120 80" className={className} fill="none">
    {/* Curved arrow path */}
    <path
      d="M10 40 Q40 10, 80 40 Q90 45, 85 50 L75 45 Q45 25, 20 40 L25 35 L15 45 L25 55 L20 50 Q45 65, 75 45"
      stroke="currentColor"
      strokeWidth="4"
      fill="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Arrow head */}
    <path
      d="M75 35 L85 45 L75 55 L80 50 L85 45 L80 40 Z"
      fill="currentColor"
    />
  </svg>
);

const CurvedArrowRight: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 120 80" className={className} fill="none">
    {/* Curved arrow path */}
    <path
      d="M110 40 Q80 10, 40 40 Q30 45, 35 50 L45 45 Q75 25, 100 40 L95 35 L105 45 L95 55 L100 50 Q75 65, 45 45"
      stroke="currentColor"
      strokeWidth="4"
      fill="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Arrow head */}
    <path
      d="M45 35 L35 45 L45 55 L40 50 L35 45 L40 40 Z"
      fill="currentColor"
    />
  </svg>
);

const CurvedArrowDown: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 80 100" className={className} fill="none">
    {/* Curved arrow path */}
    <path
      d="M40 10 Q10 30, 40 60 Q45 70, 50 65 L45 55 Q25 35, 40 20 L35 25 L45 15 L55 25 L50 20 Q65 35, 45 55"
      stroke="currentColor"
      strokeWidth="4"
      fill="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Arrow head */}
    <path
      d="M35 55 L45 65 L55 55 L50 60 L45 65 L40 60 Z"
      fill="currentColor"
    />
  </svg>
);

const platforms: PlatformType[] = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-400',
    placeholder: 'https://linkedin.com/in/prospect-name'
  },
  {
    id: 'website',
    name: 'Website',
    icon: Globe,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-400',
    placeholder: 'https://company-website.com'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
    borderColor: 'border-pink-400',
    placeholder: 'https://instagram.com/username'
  },
  {
    id: 'twitter',
    name: 'X/Twitter',
    icon: TwitterIcon,
    color: 'text-white',
    bgColor: 'bg-black',
    borderColor: 'border-black',
    placeholder: 'https://x.com/username'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: Youtube,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-400',
    placeholder: 'https://youtube.com/@channel'
  }
];

const HeroSection: React.FC<HeroSectionProps> = ({ user }) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [isAnimating, setIsAnimating] = useState(false);

  const togglePlatform = (platformId: string) => {
    if (selectedPlatforms.includes(platformId)) {
      // Remove platform
      setSelectedPlatforms(prev => prev.filter(id => id !== platformId));
      setUrls(prev => {
        const newUrls = { ...prev };
        delete newUrls[platformId];
        return newUrls;
      });
    } else {
      // Add platform
      setSelectedPlatforms(prev => [...prev, platformId]);
    }
  };

  const removePlatform = (platformId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setSelectedPlatforms(prev => prev.filter(id => id !== platformId));
    setUrls(prev => {
      const newUrls = { ...prev };
      delete newUrls[platformId];
      return newUrls;
    });
  };

  const updateUrl = (platformId: string, url: string) => {
    setUrls(prev => ({
      ...prev,
      [platformId]: url
    }));
  };

  const handleSubmit = async () => {
    const filledUrls = Object.entries(urls).filter(([_, url]) => url.trim());
    
    if (filledUrls.length === 0) {
      alert('Please enter at least one URL');
      return;
    }

    if (!user) {
      alert('Please sign in first');
      return;
    }

    setIsAnimating(true);
    
    try {
      console.log('Sending webhook request with:', {
        urls: filledUrls,
        email: user.email,
        name: user.name
      });

      const response = await fetch('https://n8n.srv850687.hstgr.cloud/webhook/knowleadge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          urls: filledUrls,
          email: user.email,
          name: user.name
        }),
      });

      console.log('Webhook response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Webhook response:', result);
        alert('Lead research initiated! You will receive results via email.');
        setUrls({});
        setSelectedPlatforms([]);
      } else {
        const errorText = await response.text();
        console.error('Webhook error response:', errorText);
        throw new Error(`Failed to submit request: ${response.status}`);
      }
    } catch (error) {
      console.error('Error submitting webhook:', error);
      alert('Error submitting request. Please try again.');
    } finally {
      setTimeout(() => setIsAnimating(false), 2000);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-8 overflow-hidden bg-gradient-to-br from-blue-50 to-white">
      {/* Background Paper Texture */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `repeating-linear-gradient(
            transparent,
            transparent 24px,
            #e0e0e0 24px,
            #e0e0e0 25px
          )`
        }} />
      </div>

      {/* Sparkles Background */}
      <SparklesCore
        className="absolute inset-0 w-full h-full"
        particleColor="#FFE65A"
        particleDensity={50}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 mt-20">
        {/* Main Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl lg:text-7xl font-extrabold leading-tight text-gray-900 drop-shadow-lg"
        >
          Know your lead
          <br />
          <span className="text-blue-600">before you call</span>
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-yellow-100 border-2 border-yellow-400 px-6 py-3 rounded-xl inline-block transform -rotate-1 shadow-md"
        >
          <p className="text-lg font-bold text-gray-900 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
            AI-Powered Lead Research
          </p>
        </motion.div>

        {/* Subtle subtitle text */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
        >
          Turn any URL into your competitive advantage
        </motion.p>

        {/* Multi-Platform Input System with Curved Cartoonish Arrows */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-3xl mx-auto relative"
        >
          {/* Curved Animated Arrows Around Container - Comic Book Style */}
          <motion.div
            animate={{ 
              x: [0, 8, 0],
              y: [0, -3, 0],
              rotate: [0, 2, 0]
            }}
            transition={{ 
              duration: 3.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -left-20 top-1/2 transform -translate-y-1/2 hidden lg:block"
          >
            <div className="relative">
              <CurvedArrowLeft className="w-16 h-12 text-blue-500 opacity-70" />
              {/* Decorative comic elements */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-gray-800"></div>
              <div className="absolute -bottom-1 left-2 w-2 h-2 bg-pink-400 rounded-full border border-gray-800"></div>
              {/* Comic book style "POW" effect */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="absolute -top-3 left-1 text-xs font-black text-blue-600 transform -rotate-12"
              >
                ✨
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            animate={{ 
              x: [0, -8, 0],
              y: [0, -3, 0],
              rotate: [0, -2, 0]
            }}
            transition={{ 
              duration: 3.5, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5
            }}
            className="absolute -right-20 top-1/2 transform -translate-y-1/2 hidden lg:block"
          >
            <div className="relative">
              <CurvedArrowRight className="w-16 h-12 text-red-500 opacity-70" />
              {/* Decorative comic elements */}
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-800"></div>
              <div className="absolute -bottom-1 right-2 w-2 h-2 bg-blue-400 rounded-full border border-gray-800"></div>
              {/* Comic book style effect */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="absolute -top-3 right-1 text-xs font-black text-red-600 transform rotate-12"
              >
                💫
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            animate={{ 
              y: [0, -6, 0],
              x: [0, 2, 0],
              rotate: [0, 1, 0]
            }}
            transition={{ 
              duration: 2.8, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.8
            }}
            className="absolute -top-20 left-1/2 transform -translate-x-1/2 hidden lg:block"
          >
            <div className="relative">
              <CurvedArrowDown className="w-12 h-16 text-purple-500 opacity-70" />
              {/* Decorative comic elements */}
              <div className="absolute -left-1 top-2 w-2 h-2 bg-orange-400 rounded-full border border-gray-800"></div>
              <div className="absolute -right-1 bottom-3 w-3 h-3 bg-cyan-400 rounded-full border-2 border-gray-800"></div>
              {/* Comic book style effect */}
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
                className="absolute top-0 left-1/2 transform -translate-x-1/2 text-xs font-black text-purple-600"
              >
                ⭐
              </motion.div>
            </div>
          </motion.div>

          <div className="relative p-6 bg-white border-3 border-gray-900 rounded-3xl shadow-[12px_12px_0_0_rgb(17,24,39)] transform hover:rotate-1 transition-all duration-300">
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-6 h-6 border-2 border-yellow-400 rounded-full opacity-60"></div>
            <div className="absolute bottom-4 left-4 w-8 h-1 bg-blue-400 opacity-60 transform -rotate-12"></div>
            
            <div className="space-y-5">
              <div className="text-center">
                <h4 className="text-2xl font-black text-gray-900 mb-2">Drop Your Prospect URLs</h4>
                <p className="text-gray-600 mb-4">Any profile or website - we'll extract the insights</p>
                
                {/* Platform Selection */}
                <div className="mb-5">
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {platforms.map((platform) => {
                      const isSelected = selectedPlatforms.includes(platform.id);
                      const IconComponent = platform.icon;
                      
                      return (
                        <motion.button
                          key={platform.id}
                          onClick={() => togglePlatform(platform.id)}
                          whileHover={{ scale: 1.05, rotate: isSelected ? 0 : 5 }}
                          whileTap={{ scale: 0.95 }}
                          className={`relative w-14 h-14 rounded-xl border-3 flex items-center justify-center transition-all duration-200 transform ${
                            isSelected 
                              ? `${platform.bgColor} ${platform.borderColor} shadow-[4px_4px_0_0_rgb(17,24,39)] rotate-3` 
                              : 'bg-gray-100 border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <IconComponent 
                            className={`w-6 h-6 ${
                              isSelected 
                                ? platform.color 
                                : 'text-gray-400'
                            }`} 
                          />
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 border-2 border-gray-900 rounded-full flex items-center justify-center"
                            >
                              <Plus className="w-3 h-3 text-gray-900 rotate-45" />
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* URL Inputs for Selected Platforms */}
              {selectedPlatforms.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-3"
                >
                  {selectedPlatforms.map((platformId) => {
                    const platform = platforms.find(p => p.id === platformId)!;
                    const IconComponent = platform.icon;
                    
                    return (
                      <motion.div
                        key={platformId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`relative p-3 ${platform.bgColor} border-2 ${platform.borderColor} rounded-xl shadow-md transform rotate-1 hover:rotate-0 transition-all duration-200`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 ${platform.id === 'twitter' ? 'bg-black' : 'bg-white'} border-2 ${platform.borderColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <IconComponent className={`w-5 h-5 ${platform.color}`} />
                          </div>
                          <div className="flex-1">
                            <Input
                              value={urls[platformId] || ''}
                              onChange={(e) => updateUrl(platformId, e.target.value)}
                              placeholder={platform.placeholder}
                              className="border-2 border-gray-300 rounded-lg text-sm p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white"
                            />
                          </div>
                          <motion.button
                            onClick={(e) => removePlatform(platformId, e)}
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-8 h-8 bg-red-400 border-2 border-gray-900 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors flex-shrink-0"
                          >
                            <X className="w-4 h-4 text-white" />
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}

              {/* Add More Platforms Hint */}
              {selectedPlatforms.length === 0 && (
                <div className="text-center py-6">
                  <div className="inline-block bg-gray-50 border-2 border-gray-300 rounded-xl p-4 transform -rotate-1">
                    <p className="text-gray-600 font-bold mb-1">👆 Select platforms above to get started</p>
                    <p className="text-sm text-gray-500">Add multiple URLs from different platforms</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              {selectedPlatforms.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  animate={isAnimating ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 0.5 }}
                  className="flex justify-center pt-2"
                >
                  <NorthSouthMagnetButton
                    label={`Pull Lead Intel`}
                    onClick={handleSubmit}
                    disabled={isAnimating}
                  />
                </motion.div>
              )}

              {/* Examples - Compact */}
              {selectedPlatforms.length > 0 && (
                <div className="text-center pt-2">
                  <p className="text-xs text-gray-500 mb-2">💡 Pro Tip: Add multiple platforms for deeper insights!</p>
                  <div className="flex flex-wrap justify-center gap-2 text-xs">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-200 font-bold">LinkedIn + Website</span>
                    <span className="bg-pink-50 text-pink-700 px-2 py-1 rounded-full border border-pink-200 font-bold">Instagram + YouTube</span>
                    <span className="bg-gray-50 text-gray-700 px-2 py-1 rounded-full border border-gray-200 font-bold">All Platforms</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {isAnimating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-green-50 border-2 border-green-400 rounded-lg max-w-md mx-auto shadow-md"
          >
            <div className="flex items-center space-x-2 justify-center">
              <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-bold text-green-700">Researching across {selectedPlatforms.length} platform{selectedPlatforms.length > 1 ? 's' : ''}...</span>
            </div>
            <p className="text-sm text-green-600 mt-2 text-center">
              Results will be sent to {user?.email}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;