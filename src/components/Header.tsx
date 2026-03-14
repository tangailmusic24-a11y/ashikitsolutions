import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Globe, Home, Package, Wrench, User, Shield, LogOut, LogIn, Bell, ShoppingBag, Zap, HelpCircle, Sparkles, ChevronDown } from 'lucide-react';
import { useSignedUrl } from '@/hooks/useSignedUrl';
import logoImg from '@/assets/logo.jpg';

const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, isAdmin, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const profilePicUrl = useSignedUrl('user-uploads', user?.profilePicture || null);

  // Close profile menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navItems = [
    { path: '/', icon: Home, labelBn: 'হোম', labelEn: 'Home' },
    { path: '/packages', icon: Package, labelBn: 'প্যাকেজ', labelEn: 'Packages' },
    { path: '/shop', icon: ShoppingBag, labelBn: 'শপ', labelEn: 'Shop' },
    { path: '/social-services', icon: Zap, labelBn: 'সোশ্যাল সার্ভিস', labelEn: 'Social Services' },
    { path: '/tools', icon: Wrench, labelBn: 'ফ্রি টুলস', labelEn: 'Free Tools' },
    { path: '/ai-tools', icon: Sparkles, labelBn: 'AI টুলস', labelEn: 'AI Tools' },
    { path: '/notices', icon: Bell, labelBn: 'নোটিশ বোর্ড', labelEn: 'Notices' },
  ];

  const userItems = user ? [
    { path: '/profile', icon: User, labelBn: 'প্রোফাইল', labelEn: 'Profile' },
    ...(isAdmin ? [{ path: '/admin', icon: Shield, labelBn: 'এডমিন প্যানেল', labelEn: 'Admin Panel' }] : []),
  ] : [];

  return (
    <>
      <header className="sticky top-0 z-50 glass-effect">
        <div className="flex items-center justify-between px-3 sm:px-4 py-2.5">
          {/* Left: menu + logo + name */}
          <div className="flex items-center gap-2 min-w-0">
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-muted transition-colors shrink-0">
              <Menu className="w-5 h-5 text-foreground" />
            </button>
            <Link to="/" className="flex items-center gap-2 min-w-0">
              <img src={logoImg} alt="Logo" className="w-8 h-8 rounded-full object-cover border border-primary/30 shrink-0" />
              <div className="min-w-0">
                <h1 className="text-sm font-bold text-foreground leading-tight truncate">Ashik IT Solutions</h1>
                <p className="text-[10px] text-muted-foreground leading-tight truncate">{t('বিশ্বস্ততার এক ধাপ এগিয়ে', 'One step ahead in trust')}</p>
              </div>
            </Link>
          </div>

          {/* Right: controls */}
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-[10px] sm:text-xs font-medium text-foreground">
              <Globe className="w-3.5 h-3.5" /> {language === 'bn' ? 'EN' : 'বাং'}
            </button>
            <button onClick={toggleTheme} className="p-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
              {theme === 'light' ? <Moon className="w-4 h-4 text-foreground" /> : <Sun className="w-4 h-4 text-foreground" />}
            </button>

            {user ? (
              <div className="relative" ref={profileMenuRef}>
                <button onClick={() => setProfileMenuOpen(!profileMenuOpen)} className="flex items-center gap-1 rounded-full hover:ring-2 hover:ring-primary/30 transition-all">
                  {profilePicUrl ? (
                    <img src={profilePicUrl} alt="" className="w-8 h-8 rounded-full object-cover border-2 border-primary/30" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold border-2 border-primary/30">
                      {(user.fullName || user.username || '?').charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>

                {/* Profile dropdown */}
                {profileMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 rounded-xl bg-card border border-border shadow-xl z-50 overflow-hidden">
                    <div className="p-3 border-b border-border bg-muted/50">
                      <p className="text-sm font-semibold text-foreground truncate">{user.fullName || user.username}</p>
                      <p className="text-[10px] text-muted-foreground truncate">@{user.username}</p>
                    </div>
                    <div className="py-1">
                      <Link to="/profile" onClick={() => setProfileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                        <User className="w-4 h-4" /> {t('প্রোফাইল', 'Profile')}
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setProfileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                          <Shield className="w-4 h-4" /> {t('এডমিন প্যানেল', 'Admin Panel')}
                        </Link>
                      )}
                      <a href="https://wa.me/8801303216921" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                        <HelpCircle className="w-4 h-4" /> {t('হেল্প ও সাপোর্ট', 'Help & Support')}
                      </a>
                    </div>
                    <div className="border-t border-border py-1">
                      <button onClick={() => { logout(); setProfileMenuOpen(false); }} className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 w-full transition-colors">
                        <LogOut className="w-4 h-4" /> {t('লগআউট', 'Logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg gradient-primary text-primary-foreground text-xs font-medium">
                <LogIn className="w-3.5 h-3.5" /> {t('লগইন', 'Login')}
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
              <div className="absolute inset-0">
                <img src={logoImg} alt="" className="w-full h-full object-cover opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-b from-card/60 to-card/90" />
              </div>
              <div className="relative flex items-center gap-2">
                <img src={logoImg} alt="Logo" className="w-12 h-12 rounded-full object-cover border-2 border-primary shadow-lg" />
                <div>
                  <h2 className="font-bold text-sm text-foreground">Ashik IT Solutions</h2>
                  <p className="text-xs text-muted-foreground">{t('বিশ্বস্ততার এক ধাপ এগিয়ে', 'One step ahead in trust')}</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="relative p-1.5 rounded-lg hover:bg-muted">
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {navItems.map(item => (
                <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                    location.pathname === item.path ? 'gradient-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
                  }`}>
                  <item.icon className="w-4 h-4" /> {t(item.labelBn, item.labelEn)}
                </Link>
              ))}

              {userItems.length > 0 && (
                <>
                  <div className="border-t border-border my-3" />
                  {userItems.map(item => (
                    <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                        location.pathname === item.path ? 'gradient-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
                      }`}>
                      <item.icon className="w-4 h-4" /> {t(item.labelBn, item.labelEn)}
                    </Link>
                  ))}
                </>
              )}
            </nav>

            {user && (
              <div className="p-3 border-t border-border">
                <button onClick={() => { logout(); setSidebarOpen(false); }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-destructive hover:bg-destructive/10 w-full text-sm transition-colors">
                  <LogOut className="w-4 h-4" /> {t('লগআউট', 'Logout')}
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
