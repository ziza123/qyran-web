import { QyranHero } from '@/app/components/qyran-hero';
import { AIProcessingWindow } from '@/app/components/ai-processing-window';
import { BentoFeatures } from '@/app/components/bento-features';
import { SocialImpact } from '@/app/components/social-impact';
import { Footer } from '@/app/components/footer';
import { MediaPipeDetail } from '@/app/components/mediapipe-detail';
import { TensorFlowDetail } from '@/app/components/tensorflow-detail';
import { PyTorchDetail } from '@/app/components/pytorch-detail';
import { OpenCVDetail } from '@/app/components/opencv-detail';
import { AuthLayout } from '@/app/components/auth/AuthLayout';
import { SignInForm } from '@/app/components/auth/SignInForm';
import { SignUpForm } from '@/app/components/auth/SignUpForm';
import { ProfilePage } from '@/app/components/ProfilePage';
import { TranslatorPage } from '@/app/components/TranslatorPage';
import { RecognizerPage } from '@/app/components/RecognizerPage';
import { AuthProvider, useAuth } from '@/app/context/AuthContext';
import { useState } from 'react';
import { motion } from 'motion/react';
import { User } from 'lucide-react';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<
    'home' | 'mediapipe' | 'tensorflow' | 'pytorch' | 'opencv' | 'signin' | 'signup' | 'profile' | 'translator' | 'recognizer'
  >('signin');

  // Loading state
  if (loading) {
    return (
      <div className="size-full bg-[#0F172A] flex items-center justify-center min-h-screen" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#FDE047] flex items-center justify-center font-bold text-white text-2xl animate-pulse">
            Q
          </div>
          <div className="w-32 h-1 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#4F46E5] to-[#FDE047]"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: '50%' }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  // Not authenticated — show auth forms
  if (!user) {
    if (currentView === 'signup') {
      return (
        <AuthLayout title="Join Qyran" subtitle="Begin your journey into AI translation">
          <SignUpForm
            onSignIn={() => setCurrentView('signin')}
          />
        </AuthLayout>
      );
    }

    // Default to sign in
    return (
      <AuthLayout title="Welcome Back" subtitle="Secure access to your Qyran workspace">
        <SignInForm
          onSignUp={() => setCurrentView('signup')}
        />
      </AuthLayout>
    );
  }

  // Authenticated views

if (currentView === 'translator') {
    return <TranslatorPage onBack={() => setCurrentView('home')} />;
  }

  if (currentView === 'recognizer') {
    return <RecognizerPage onBack={() => setCurrentView('home')} />;
  }

  if (currentView === 'profile') {
    return <ProfilePage onBack={() => setCurrentView('home')} />;
  }

  if (currentView === 'mediapipe') {
    return (
      <div className="size-full bg-[#0F172A] overflow-x-hidden" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
        <MediaPipeDetail onBack={() => setCurrentView('home')} />
      </div>
    );
  }

  if (currentView === 'tensorflow') {
    return (
      <div className="size-full bg-[#0F172A] overflow-x-hidden" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
        <TensorFlowDetail onBack={() => setCurrentView('home')} />
      </div>
    );
  }

  if (currentView === 'pytorch') {
    return (
      <div className="size-full bg-[#0F172A] overflow-x-hidden" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
        <PyTorchDetail onBack={() => setCurrentView('home')} />
      </div>
    );
  }

  if (currentView === 'opencv') {
    return (
      <div className="size-full bg-[#0F172A] overflow-x-hidden" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
        <OpenCVDetail onBack={() => setCurrentView('home')} />
      </div>
    );
  }

  // Home view (authenticated)
  const fullName = user.user_metadata?.full_name || 'User';
  const initials = fullName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="size-full bg-[#0F172A] overflow-x-hidden" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md border-b border-white/5 bg-[#0F172A]/50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('home')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#FDE047] flex items-center justify-center font-bold text-white text-xl">Q</div>
          <span className="text-xl font-bold text-white tracking-tight">Qyran</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentView('profile')}
            className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#4F46E5]/30 transition-all group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#6366F1] flex items-center justify-center text-xs font-bold text-white">
              {initials}
            </div>
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors hidden sm:inline">
              {fullName}
            </span>
          </button>
        </div>
      </nav>

      <QyranHero onGetStarted={() => setCurrentView('signup')} onTranslate={() => setCurrentView('translator')} onRecognize={() => setCurrentView('recognizer')} />
      <AIProcessingWindow />
      <BentoFeatures />
      <SocialImpact onNavigateToTech={(tech) => {
        if (tech === 'mediapipe') {
          setCurrentView('mediapipe');
        } else if (tech === 'tensorflow') {
          setCurrentView('tensorflow');
        } else if (tech === 'pytorch') {
          setCurrentView('pytorch');
        } else if (tech === 'opencv') {
          setCurrentView('opencv');
        }
      }} />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
