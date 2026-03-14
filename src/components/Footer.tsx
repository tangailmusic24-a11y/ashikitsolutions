import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, Phone, MapPin, User, Facebook, Instagram, Youtube, Send, Globe } from 'lucide-react';
import logoImg from '@/assets/logo.jpg';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  const contactInfo = [
    { icon: User, text: 'Md Ashik Ahmed' },
    { icon: MapPin, text: t('বরিশাল, বাংলাদেশ', 'Barisal, Bangladesh') },
    { icon: Phone, text: '+8801303216921', url: 'tel:+8801303216921' },
    { icon: Mail, text: 'ashik.oysterit@gmail.com', url: 'mailto:ashik.oysterit@gmail.com' },
  ];

  const socialLinks = [
    { icon: Facebook, url: 'https://facebook.com/mdashikahmed02', label: 'Facebook' },
    { icon: Instagram, url: 'https://instagram.com/mdashikahmed02', label: 'Instagram' },
    { icon: Youtube, url: 'https://youtube.com/@mdashikahmed02', label: 'YouTube' },
    { icon: Send, url: 'https://t.me/mdashikahmed_official', label: 'Telegram' },
    { icon: Globe, url: 'https://ashik360info.blogspot.com', label: 'Blog' },
  ];

  return (
    <footer className="border-t border-border bg-card">
      {/* App description box */}
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-4">
        <div className="card-3d p-4 sm:p-5 flex flex-col sm:flex-row items-start gap-4 mb-6">
          <img src={logoImg} alt="Logo" className="w-14 h-14 rounded-full object-cover border-2 border-primary shadow-lg shrink-0" />
          <div className="min-w-0">
            <h3 className="font-bold text-foreground text-sm sm:text-base">Ashik IT Solutions</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
              {t(
                'আমরা সোশ্যাল মিডিয়া মনিটাইজেশন, ডিজিটাল মার্কেটিং, ওয়েব ডেভেলপমেন্ট এবং আইটি সমাধান প্রদান করি। আমাদের লক্ষ্য হলো সাশ্রয়ী মূল্যে বিশ্বমানের সেবা দেওয়া।',
                'We provide social media monetization, digital marketing, web development and IT solutions. Our goal is to deliver world-class services at affordable prices.'
              )}
            </p>
          </div>
        </div>

        {/* Contact + Social */}
        <div className="flex flex-col sm:flex-row justify-between gap-6">
          {/* Contact info - left */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">{t('যোগাযোগ', 'Contact')}</h4>
            {contactInfo.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                <item.icon className="w-3.5 h-3.5 text-primary shrink-0" />
                {item.url ? (
                  <a href={item.url} className="hover:text-primary transition-colors truncate">{item.text}</a>
                ) : (
                  <span className="truncate">{item.text}</span>
                )}
              </div>
            ))}
          </div>

          {/* Social links - right */}
          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">{t('সোশ্যাল মিডিয়া', 'Social Media')}</h4>
            <div className="flex gap-2">
              {socialLinks.map((item, i) => (
                <a key={i} href={item.url} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors group" title={item.label}>
                  <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border py-3 text-center">
        <p className="text-[10px] sm:text-xs text-muted-foreground">
          © {new Date().getFullYear()} Ashik IT Solutions. {t('সর্বস্বত্ব সংরক্ষিত', 'All rights reserved')}.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
