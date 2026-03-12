import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Globe, Home, Package, Wrench, User, Shield, LogOut, LogIn, Bell, ShoppingBag, Zap } from 'lucide-react';
import logoImg from '@/assets/logo.jpg';

const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, isAdmin, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, labelBn: 'হোম', labelEn: 'Home' },
    { path: '/packages', icon: Package, labelBn: 'প্যাকেজ', labelEn: 'Packages' },
    { path: '/shop', icon: ShoppingBag, labelBn: 'শপ', labelEn: 'Shop' },
    { path: '/social-services', icon: Zap, labelBn: 'সোশ্যাল সার্ভিস', labelEn: 'Social Services' },
    { path: '/tools', icon: Wrench, labelBn: 'ফ্রি টুলস', labelEn: 'Free Tools' },
    { path: '/notices', icon: Bell, labelBn: 'নোটিশ বোর্ড', labelEn: 'Notices' },
  ];

  const userItems = user ? [
    { path: '/profile', icon: User, labelBn: 'প্রোফাইল', labelEn: 'Profile' },
    ...(isAdmin ? [{ path: '/admin', icon: Shield, labelBn: 'এডমিন প্যানেল', labelEn: 'Admin Panel' }] : []),
  ] : [];

  return (
    <>
      <header className="sticky top-0 z-50 glass-effect">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-muted transition-colors">
              <Menu className="w-5 h-5 text-foreground" />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                AIT
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm font-bold text-foreground leading-tight">Ashik IT Solutions</h1>
                <p className="text-xs text-muted-foreground leading-tight">{t('বিশ্বস্ততার এক ধাপ এগিয়ে', 'One step ahead in trust')}</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-xs font-medium text-foreground"
            >
              <Globe className="w-3.5 h-3.5" />
              {language === 'bn' ? 'EN' : 'বাং'}
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              {theme === 'light' ? <Moon className="w-4 h-4 text-foreground" /> : <Sun className="w-4 h-4 text-foreground" />}
            </button>

            {user ? (
              <Link to="/profile" className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                {(user.fullName || user.username || '?').charAt(0).toUpperCase()}
              </Link>
            ) : (
              <Link to="/login" className="flex items-center gap-1 px-3 py-1.5 rounded-lg gradient-primary text-primary-foreground text-xs font-medium">
                <LogIn className="w-3.5 h-3.5" />
                {t('লগইন', 'Login')}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-72 max-w-[80vw] bg-card border-r border-border h-full flex flex-col animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between p-4 border-b border-border relative overflow-hidden">
              {/* Logo background */}
              <div className="absolute inset-0">
                <img src={logoImg} alt="" className="w-full h-full object-cover opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-b from-card/60 to-card/90" />
              </div>
              <div className="relative flex items-center gap-2">
                <img src={logoImg} alt="Ashik IT Solutions" className="w-12 h-12 rounded-full object-cover border-2 border-primary shadow-lg" />
                <div>
                  <h2 className="font-bold text-sm text-foreground">Ashik IT Solutions</h2>
                  <p className="text-xs text-muted-foreground">{t('বিশ্বস্ততার এক ধাপ এগিয়ে', 'One step ahead in trust')}</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="relative p-1.5 rounded-lg hover:bg-muted">
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            <nav className="flex-1 p-3 space-y-1">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                    location.pathname === item.path
                      ? 'gradient-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {t(item.labelBn, item.labelEn)}
                </Link>
              ))}

              {userItems.length > 0 && (
                <>
                  <div className="border-t border-border my-3" />
                  {userItems.map(item => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                        location.pathname === item.path
                          ? 'gradient-primary text-primary-foreground'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {t(item.labelBn, item.labelEn)}
                    </Link>
                  ))}
                </>
              )}
            </nav>

            {user && (
              <div className="p-3 border-t border-border">
                <button
                  onClick={() => { logout(); setSidebarOpen(false); }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-destructive hover:bg-destructive/10 w-full text-sm transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  {t('লগআউট', 'Logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
