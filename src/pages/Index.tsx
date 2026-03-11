import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ArrowRight, Facebook, Youtube, MessageCircle, Instagram, Zap, Shield, Clock, Send, Mail, Phone, Globe } from 'lucide-react';
import Layout from '@/components/Layout';

const HeroSection: React.FC = () => {
  const { t } = useLanguage();
  return (
    <section className="relative overflow-hidden gradient-hero text-primary-foreground py-16 px-4">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-secondary blur-3xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-accent blur-3xl" />
      </div>
      <div className="relative max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm text-sm">
          <Zap className="w-4 h-4 text-accent" />
          {t('বিশ্বস্ততার এক ধাপ এগিয়ে', 'One step ahead in trust')}
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
          {t('সোশ্যাল মিডিয়ার সকল সমস্যার', 'Complete Solutions for All')}
          <br />
          <span className="text-secondary">{t('সম্পূর্ণ সমাধান', 'Social Media Issues')}</span>
        </h1>
        <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
          {t(
            'ফেসবুক, ইউটিউব, টিকটক, ইনস্টাগ্রাম, টেলিগ্রাম সহ সকল প্ল্যাটফর্মের মনিটাইজেশন সেটআপ ও সমস্যা সমাধান',
            'Monetization setup & problem solving for Facebook, YouTube, TikTok, Instagram, Telegram and all platforms'
          )}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/packages" className="btn-3d gradient-primary px-8 py-3 text-primary-foreground inline-flex items-center justify-center gap-2">
            {t('প্যাকেজ দেখুন', 'View Packages')} <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/tools" className="btn-3d bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 px-8 py-3 text-primary-foreground inline-flex items-center justify-center gap-2">
            {t('ফ্রি টুলস', 'Free Tools')}
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
  const { t } = useLanguage();
  const contacts = [
    { icon: Send, label: 'Telegram', value: '@mdashikahmed_official', url: 'https://t.me/mdashikahmed_official' },
    { icon: Globe, label: t('ওয়েবসাইট', 'Website'), value: 'ashik360info.blogspot.com', url: 'https://ashik360info.blogspot.com' },
    { icon: Facebook, label: 'Facebook', value: 'mdashikahmed02', url: 'https://facebook.com/mdashikahmed02' },
    { icon: Instagram, label: 'Instagram', value: 'mdashikahmed02', url: 'https://instagram.com/mdashikahmed02' },
    { icon: Mail, label: t('ইমেইল', 'Email'), value: 'ashik.oysterit@gmail.com', url: 'mailto:ashik.oysterit@gmail.com' },
    { icon: Phone, label: t('মোবাইল', 'Mobile'), value: '+8801303216921', url: 'https://wa.me/8801303216921' },
  ];

  return (
    <section className="py-12 px-4 bg-muted/50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-foreground mb-2 text-center">{t('যোগাযোগ করুন', 'Contact Us')}</h2>
        <p className="text-sm text-muted-foreground text-center mb-8">
          {t('সকাল ১১টা থেকে রাত ৮টা পর্যন্ত শুধুমাত্র হোয়াটসঅ্যাপে', 'WhatsApp only, 11 AM to 8 PM')}
        </p>
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

const HomePage: React.FC = () => {
  return (
    <Layout>
      <HeroSection />
      <NoticeBoard />
      <PackagesPreview />
      <FeaturesSection />
      <ContactSection />
    </Layout>
  );
};

export default HomePage;
