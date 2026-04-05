import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Hand, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

interface SignInFormProps {
  onSignUp: () => void;
  onSuccess?: () => void;
}

export function SignInForm({ onSignUp, onSuccess }: SignInFormProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        setError(signInError);
      } else {
        onSuccess?.();
      }
    } catch (err: any) {
      setError(err?.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </motion.div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <label className="text-sm font-medium text-gray-300">Password</label>
            <button type="button" className="text-xs text-orange-500 hover:text-yellow-400 transition-colors">Forgot password?</button>
          </div>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
            />
          </div>
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        className="w-full relative group py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 font-bold text-black shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] transition-all overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </span>
      </motion.button>

      <div className="relative flex items-center gap-4 py-2">
        <div className="h-[1px] flex-1 bg-white/10" />
        <span className="text-xs text-gray-500 uppercase tracking-widest">or</span>
        <div className="h-[1px] flex-1 bg-white/10" />
      </div>

      <motion.button
        type="button"
        whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(253, 224, 71, 0.2)" }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 rounded-xl border border-yellow-400/30 bg-yellow-400/5 text-yellow-400 font-medium flex items-center justify-center gap-2 hover:bg-yellow-400/10 transition-all"
      >
        <Hand className="w-5 h-5" />
        <span>Sign in with Gesture</span>
        <span className="text-[10px] uppercase bg-yellow-400/20 px-1.5 py-0.5 rounded ml-1">Experimental</span>
      </motion.button>

      <p className="text-center text-sm text-gray-500">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onSignUp}
          className="text-orange-500 font-medium hover:text-yellow-400 transition-colors"
        >
          Sign Up
        </button>
      </p>
    </form>
  );
}
