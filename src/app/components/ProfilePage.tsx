import { motion } from 'motion/react';
import { User, Mail, Calendar, LogOut, ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

interface ProfilePageProps {
  onBack: () => void;
}

export function ProfilePage({ onBack }: ProfilePageProps) {
  const { user, signOut } = useAuth();

  if (!user) return null;

  const fullName = user.user_metadata?.full_name || 'User';
  const email = user.email || '';
  const createdAt = user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';
  const initials = fullName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  async function handleSignOut() {
    await signOut();
  }

  return (
    <div className="size-full bg-transparent overflow-x-hidden min-h-screen relative z-10" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-orange-500/5 blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-yellow-400/5 blur-[120px]" />
      </div>

      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md border-b border-white/5 bg-black/30">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>
        <span className="text-lg font-bold text-white">Profile</span>
        <div className="w-20" />
      </nav>

      {/* Profile Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-6"
        >
          {/* Avatar Card */}
          <div className="relative p-8 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 overflow-hidden">
            {/* Gradient border glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/20 via-transparent to-yellow-400/10 pointer-events-none" />

            <div className="relative flex flex-col items-center text-center space-y-4">
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-[0_0_40px_rgba(249,115,22,0.3)] border-2 border-orange-500/50"
              >
                <span className="text-3xl font-bold text-white">{initials}</span>
              </motion.div>

              {/* Name */}
              <div>
                <h2 className="text-2xl font-bold text-white">{fullName}</h2>
                <p className="text-gray-400 text-sm mt-1">Qyran Member</p>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-sm"
            >
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                <User className="w-5 h-5 text-orange-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Full Name</p>
                <p className="text-white font-medium truncate">{fullName}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-sm"
            >
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                <Mail className="w-5 h-5 text-orange-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
                <p className="text-white font-medium truncate">{email}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-sm"
            >
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                <Calendar className="w-5 h-5 text-orange-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Member Since</p>
                <p className="text-white font-medium">{createdAt}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-sm"
            >
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20">
                <Shield className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Status</p>
                <p className="text-green-400 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Verified
                </p>
              </div>
            </motion.div>
          </div>

          {/* Sign Out Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 font-medium hover:bg-red-500/10 hover:border-red-500/30 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
