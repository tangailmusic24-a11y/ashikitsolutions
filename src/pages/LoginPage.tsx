import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { t } = useLanguage();
  const { loginWithUsername, register } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        if (!email || !username || !password || !fullName) {
          setError(t('সকল ফিল্ড পূরণ করুন', 'Please fill all fields'));
          setLoading(false);
          return;
        }
        const ok = await register(email, username, password, fullName);
        if (ok) navigate('/profile');
        else setError(t('এই ইউজারনেম বা ইমেইল ইতোমধ্যে ব্যবহৃত', 'Username or email already taken'));
      } else {
        if (!username || !password) {
          setError(t('ইউজারনেম ও পাসওয়ার্ড দিন', 'Enter username and password'));
          setLoading(false);
          return;
        }
        const ok = await loginWithUsername(username, password);
        if (ok) navigate('/');
        else setError(t('ভুল ইউজারনেম বা পাসওয়ার্ড', 'Wrong username or password'));
      }
    } catch {
      setError(t('কিছু সমস্যা হয়েছে', 'Something went wrong'));
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="card-3d w-full max-w-md p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center mx-auto mb-3">
              {isRegister ? <UserPlus className="w-7 h-7 text-primary-foreground" /> : <LogIn className="w-7 h-7 text-primary-foreground" />}
            </div>
            <h2 className="text-xl font-bold text-foreground">
              {isRegister ? t('রেজিস্ট্রেশন', 'Register') : t('লগইন', 'Login')}
            </h2>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div>
                  <label className="text-sm font-medium text-foreground">{t('পুরো নাম', 'Full Name')}</label>
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                    className="w-full mt-1 px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">{t('ইমেইল', 'Email')}</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full mt-1 px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </>
            )}
            <div>
              <label className="text-sm font-medium text-foreground">{t('ইউজারনেম', 'Username')}</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                className="w-full mt-1 px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">{t('পাসওয়ার্ড', 'Password')}</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full mt-1 px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:ring-2 focus:ring-primary outline-none pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-muted-foreground">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full btn-3d gradient-primary text-primary-foreground py-3 text-sm font-semibold disabled:opacity-50">
              {loading ? t('অপেক্ষা করুন...', 'Please wait...') : isRegister ? t('রেজিস্ট্রেশন করুন', 'Register') : t('লগইন করুন', 'Login')}
            </button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-4">
            {isRegister ? t('ইতোমধ্যে অ্যাকাউন্ট আছে?', 'Already have an account?') : t('অ্যাকাউন্ট নেই?', "Don't have an account?")}
            {' '}
            <button onClick={() => { setIsRegister(!isRegister); setError(''); }} className="text-primary font-medium hover:underline">
              {isRegister ? t('লগইন', 'Login') : t('রেজিস্ট্রেশন', 'Register')}
            </button>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
