import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(username, password);
    
    if (result.success) {
      toast.success('Login successful');
      navigate('/admin/dashboard');
    } else {
      toast.error(result.error || 'Invalid credentials');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6" data-testid="login-page">
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-700 hover:text-slate-900"
        data-testid="back-button"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-xs font-mono uppercase tracking-wider">{t('nav.home')}</span>
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white border border-slate-200 shadow-sm p-8">
          <div className="flex flex-col items-center justify-center mb-8">
            <img 
              src="https://customer-assets.emergentagent.com/job_news-by-nation/artifacts/e3iapp74_logo.jpg" 
              alt="EconomiX Logo" 
              className="h-20 w-auto object-contain mb-4"
            />
            <div className="bg-slate-900 p-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-serif font-bold text-center text-slate-900 mb-2">
            {t('admin.login')}
          </h2>
          <p className="text-center text-xs font-mono uppercase tracking-wider text-slate-400 mb-8">
            Economicxs - {t('admin.dashboard')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-slate-700">
                {t('admin.username')}
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border-slate-200 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                required
                data-testid="username-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                {t('admin.password')}
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-slate-200 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                required
                data-testid="password-input"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white hover:bg-slate-800 py-6 text-sm font-medium tracking-wide transition-all"
              data-testid="login-button"
            >
              {loading ? 'Loading...' : t('admin.login')}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            <p>Default: admin / admin123</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;