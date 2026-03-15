import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ArrowRight, Facebook, Youtube, MessageCircle, Instagram, Zap, Shield, Clock, Send, Mail, Phone, Globe, ShoppingBag, Tag, Megaphone } from 'lucide-react';
import Layout from '@/components/Layout';

const BreakingNews: React.FC = () => {
  const { language } = useLanguage();
  const { getSetting } = useData();
  const text = getSetting('breaking_news', language);
  if (!text) return null;

  return (
    <div className="bg-destructive/90 text-destructive-foreground py-2 overflow-hidden">
      <div className="flex items-center gap-3 max-w-6xl mx-auto px-4">
        <span className="shrink-0 flex items-center gap-1 text-xs font-bold bg-destructive-foreground/20 px-2 py-0.5 rounded">
          <Megaphone className="w-3.5 h-3.5" /> LIVE
        </span>
        <div className="overflow-hidden flex-1">
          <div className="animate-marquee whitespace-nowrap text-sm font-medium">
            {text} &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; {text} &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; {text}
          </div>
        </div>
      </div>
    </div>
  );
};

const HeroSection: React.FC = () => {
  const { language } = useLanguage();
  const { getSetting } = useData();
  const subtitle = getSetting('hero_subtitle_bn', language);
  const line1 = getSetting('hero_title_line1_bn', language);
  const line2 = getSetting('hero_title_line2_bn', language);
  const desc = getSetting('hero_description_bn', language);

  return (
    <section className="relative overflow-hidden gradient-hero text-primary-foreground py-16 px-4">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-secondary blur-3xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-accent blur-3xl" />
      </div>
      <div className="relative max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm text-sm">
          <Zap className="w-4 h-4 text-accent" />
          {subtitle || (language === 'bn' ? 'বিশ্বস্ততার এক ধাপ এগিয়ে' : 'One step ahead in trust')}
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
          {line1 || (language === 'bn' ? 'সোশ্যাল মিডিয়ার সকল সমস্যার' : 'Complete Solutions for All')}
          <br />
          <span className="text-secondary">{line2 || (language === 'bn' ? 'সম্পূর্ণ সমাধান' : 'Social Media Issues')}</span>
        </h1>
        <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
          {desc || (language === 'bn' ? 'ফেসবুক, ইউটিউব, টিকটক, ইনস্টাগ্রাম, টেলিগ্রাম সহ সকল প্ল্যাটফর্মের মনিটাইজেশন সেটআপ ও সমস্যা সমাধান' : 'Monetization setup & problem solving for all platforms')}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/packages" className="btn-3d gradient-primary px-8 py-3 text-primary-foreground inline-flex items-center justify-center gap-2">
            {language === 'bn' ? 'প্যাকেজ দেখুন' : 'View Packages'} <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/tools" className="btn-3d bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 px-8 py-3 text-primary-foreground inline-flex items-center justify-center gap-2">
            {language === 'bn' ? 'ফ্রি টুলস' : 'Free Tools'}
          </Link>
        </div>
        <div className="flex justify-center gap-6 pt-4">
          {[Facebook, Youtube, Instagram, Send].map((Icon, i) => (
            <div key={i} className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary-foreground/70" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const NoticeBoard: React.FC = () => {
  const { t, language } = useLanguage();
  const { notices } = useData();

  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          📢 {t('নোটিশ বোর্ড', 'Notice Board')}
        </h2>
        <div className="space-y-3">
          {notices.slice(0, 3).map(notice => (
            <div key={notice.id} className={`card-3d p-4 ${notice.important ? 'border-l-4 border-l-accent' : ''}`}>
              <h3 className="font-semibold text-foreground">
                {language === 'bn' ? notice.titleBn : notice.titleEn}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {language === 'bn' ? notice.contentBn : notice.contentEn}
              </p>
              <span className="text-xs text-muted-foreground mt-2 block">
                {new Date(notice.date).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US')}
              </span>
            </div>
          ))}
        </div>
        <Link to="/notices" className="inline-flex items-center gap-1 text-primary text-sm font-medium mt-4 hover:underline">
          {t('সকল নোটিশ দেখুন', 'View all notices')} <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </section>
  );
};

const PackagesPreview: React.FC = () => {
  const { t, language } = useLanguage();
  const { packages } = useData();

  return (
    <section className="py-12 px-4 bg-muted/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground">{t('আমাদের প্যাকেজসমূহ', 'Our Packages')}</h2>
          <p className="text-muted-foreground mt-2">{t('আপনার প্রয়োজন অনুযায়ী প্যাকেজ বেছে নিন', 'Choose the package that suits your needs')}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {packages.map(pkg => (
            <div key={pkg.id} className={`card-3d p-5 flex flex-col ${pkg.popular ? 'ring-2 ring-primary' : ''}`}>
              {pkg.popular && (
                <span className="self-start text-xs px-2 py-0.5 rounded-full gradient-primary text-primary-foreground mb-3">
                  {t('জনপ্রিয়', 'Popular')}
                </span>
              )}
              <h3 className="font-bold text-foreground">{language === 'bn' ? pkg.nameBn : pkg.nameEn}</h3>
              <p className="text-sm text-muted-foreground mt-1 flex-1">{language === 'bn' ? pkg.descriptionBn : pkg.descriptionEn}</p>
              <div className="mt-4">
                <span className="text-2xl font-bold text-primary">৳{pkg.price}</span>
              </div>
              <ul className="mt-3 space-y-1">
                {(language === 'bn' ? pkg.featuresBn : pkg.features).map((f, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="text-secondary">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link to="/packages" className="mt-4 btn-3d gradient-primary text-primary-foreground text-center py-2 text-sm">
                {t('এখনই কিনুন', 'Buy Now')}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturesSection: React.FC = () => {
  const { t } = useLanguage();
  const features = [
    { icon: Shield, titleBn: 'নিরাপদ সেবা', titleEn: 'Secure Service', descBn: 'আপনার তথ্য সম্পূর্ণ নিরাপদ', descEn: 'Your data is completely safe' },
    { icon: Clock, titleBn: 'দ্রুত সমাধান', titleEn: 'Quick Solution', descBn: '২৪ ঘণ্টার মধ্যে সমাধান', descEn: 'Solution within 24 hours' },
    { icon: Zap, titleBn: 'সাশ্রয়ী মূল্য', titleEn: 'Affordable Price', descBn: 'সবচেয়ে কম খরচে সেবা', descEn: 'Service at the lowest cost' },
  ];

  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <div key={i} className="card-3d p-6 text-center">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
              <f.icon className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="font-bold text-foreground">{t(f.titleBn, f.titleEn)}</h3>
            <p className="text-sm text-muted-foreground mt-1">{t(f.descBn, f.descEn)}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const ContactSection: React.FC = () => {
  const { t, language } = useLanguage();
  const { getSetting } = useData();

  const contacts = [
    { icon: Send, label: 'Telegram', value: getSetting('contact_telegram', language) || '@mdashikahmed_official', url: `https://t.me/${(getSetting('contact_telegram', language) || '@mdashikahmed_official').replace('@', '')}` },
    { icon: Globe, label: t('ওয়েবসাইট', 'Website'), value: getSetting('contact_website', language) || 'ashik360info.blogspot.com', url: `https://${getSetting('contact_website', language) || 'ashik360info.blogspot.com'}` },
    { icon: Facebook, label: 'Facebook', value: getSetting('contact_facebook', language) || 'mdashikahmed02', url: `https://facebook.com/${getSetting('contact_facebook', language) || 'mdashikahmed02'}` },
    { icon: Instagram, label: 'Instagram', value: getSetting('contact_instagram', language) || 'mdashikahmed02', url: `https://instagram.com/${getSetting('contact_instagram', language) || 'mdashikahmed02'}` },
    { icon: Mail, label: t('ইমেইল', 'Email'), value: getSetting('contact_email', language) || 'ashik.oysterit@gmail.com', url: `mailto:${getSetting('contact_email', language) || 'ashik.oysterit@gmail.com'}` },
    { icon: Phone, label: t('মোবাইল', 'Mobile'), value: getSetting('contact_phone', language) || '+8801303216921', url: `https://wa.me/${(getSetting('contact_phone', language) || '+8801303216921').replace('+', '')}` },
  ];

  const hours = getSetting('contact_hours_bn', language) || t('সকাল ১১টা থেকে রাত ৮টা পর্যন্ত শুধুমাত্র হোয়াটসঅ্যাপে', 'WhatsApp only, 11 AM to 8 PM');

  return (
    <section className="py-12 px-4 bg-muted/50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-foreground mb-2 text-center">{t('যোগাযোগ করুন', 'Contact Us')}</h2>
        <p className="text-sm text-muted-foreground text-center mb-8">{hours}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {contacts.map((c, i) => (
            <a key={i} href={c.url} target="_blank" rel="noopener noreferrer" className="card-3d p-4 flex items-center gap-3 hover:border-primary/50">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <c.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{c.label}</p>
                <p className="text-sm font-medium text-foreground truncate">{c.value}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

const ShopPreview: React.FC = () => {
  const { t, language } = useLanguage();
  const { shopItems } = useData();
  const { user } = useAuth();

  if (shopItems.length === 0) return null;
  const items = shopItems.filter(i => i.inStock).slice(0, 8);

  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
            <ShoppingBag className="w-6 h-6 text-primary" /> {t('শপ', 'Shop')}
          </h2>
          <p className="text-muted-foreground mt-2">{t('আমাদের জনপ্রিয় আইটেম', 'Our popular items')}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {items.map(item => (
            <div key={item.id} className="card-3d p-3 flex flex-col">
              <div className="w-full aspect-square rounded-lg bg-muted flex items-center justify-center mb-2 overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={language === 'bn' ? item.nameBn : item.nameEn} className="w-full h-full object-cover" />
                ) : (
                  <ShoppingBag className="w-8 h-8 text-muted-foreground/30" />
                )}
              </div>
              {item.category && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary self-start mb-1 capitalize">
                  <Tag className="w-2.5 h-2.5 inline mr-0.5" />{item.category}
                </span>
              )}
              <h3 className="text-sm font-bold text-foreground line-clamp-2 leading-tight">{language === 'bn' ? item.nameBn : item.nameEn}</h3>
              <p className="text-xs text-muted-foreground mt-1 flex-1 line-clamp-2">{language === 'bn' ? item.descriptionBn : item.descriptionEn}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-lg font-bold text-primary">৳{item.price}</span>
                {user ? (
                  <Link to="/shop" className="btn-3d gradient-primary text-primary-foreground px-2.5 py-1.5 text-xs">
                    {t('কিনুন', 'Buy')}
                  </Link>
                ) : (
                  <Link to="/login" className="btn-3d gradient-primary text-primary-foreground px-2.5 py-1.5 text-xs">
                    {t('লগইন', 'Login')}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <Link to="/shop" className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline">
            {t('সকল আইটেম দেখুন', 'View all items')} <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </section>
  );
};

const SocialServicesPreview: React.FC = () => {
  const { t, language } = useLanguage();
  const { socialServices } = useData();

  return (
    <section className="py-12 px-4 bg-muted/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground">🚀 {t('সোশ্যাল মিডিয়া সার্ভিস', 'Social Media Services')}</h2>
          <p className="text-muted-foreground mt-2">{t('লাইক, ফলোয়ার, সাবস্ক্রাইবার এবং আরো', 'Likes, followers, subscribers and more')}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {socialServices.slice(0, 6).map(svc => (
            <div key={svc.id} className="card-3d p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground text-sm truncate">{language === 'bn' ? svc.nameBn : svc.nameEn}</h3>
                <p className="text-xs text-muted-foreground">৳{svc.price}/{svc.unit} • {svc.platform}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <Link to="/social-services" className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline">
            {t('সকল সার্ভিস দেখুন', 'View all services')} <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </section>
  );
};

const HomePage: React.FC = () => {
  return (
    <Layout>
      <BreakingNews />
      <HeroSection />
      <NoticeBoard />
      <ShopPreview />
      <SocialServicesPreview />
      <PackagesPreview />
      <FeaturesSection />
      <ContactSection />
    </Layout>
  );
};

export default HomePage;
