import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Facebook, Youtube, Instagram, Star, Heart, Users, Eye, MessageCircle, Share2, Clock, Send } from 'lucide-react';

const platformIcons: Record<string, any> = {
  facebook: Facebook, youtube: Youtube, instagram: Instagram, tiktok: Star, telegram: Send,
};

const platformColors: Record<string, string> = {
  facebook: 'bg-[hsl(220,70%,50%)]', youtube: 'bg-[hsl(0,70%,50%)]', instagram: 'bg-[hsl(330,70%,50%)]',
  tiktok: 'bg-[hsl(170,70%,40%)]', telegram: 'bg-[hsl(200,70%,50%)]',
};

const SocialServicesPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { socialServices, addTransaction } = useData();
  const { user } = useAuth();
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(100);
  const [link, setLink] = useState('');
  const [txId, setTxId] = useState('');
  const [txMobile, setTxMobile] = useState('');
  const [method, setMethod] = useState('bkash');
  const [success, setSuccess] = useState(false);

  const platforms = ['all', ...Array.from(new Set(socialServices.map(s => s.platform)))];
  const filtered = selectedPlatform === 'all' ? socialServices : socialServices.filter(s => s.platform === selectedPlatform);

  const activeSvc = socialServices.find(s => s.id === selectedService);
  const totalPrice = activeSvc ? activeSvc.price * quantity : 0;

  const paymentNumbers: Record<string, string> = { bkash: '01688230246', nagad: '01303216921', rocket: '013032169215' };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !activeSvc || !txId || !txMobile) return;
    await addTransaction({
      userId: user.id, userName: user.fullName, packageId: activeSvc.id,
      packageName: `${language === 'bn' ? activeSvc.nameBn : activeSvc.nameEn} (${quantity} ${activeSvc.unit})`,
      amount: totalPrice, method, transactionId: txId, mobile: txMobile,
    });
    setSuccess(true); setSelectedService(null); setTxId(''); setTxMobile(''); setLink('');
    setTimeout(() => setSuccess(false), 5000);
  };

  const platformNameMap: Record<string, { bn: string; en: string }> = {
    all: { bn: 'সকল', en: 'All' }, facebook: { bn: 'ফেসবুক', en: 'Facebook' },
    youtube: { bn: 'ইউটিউব', en: 'YouTube' }, instagram: { bn: 'ইনস্টাগ্রাম', en: 'Instagram' },
    tiktok: { bn: 'টিকটক', en: 'TikTok' }, telegram: { bn: 'টেলিগ্রাম', en: 'Telegram' },
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">🚀 {t('সোশ্যাল মিডিয়া সার্ভিস', 'Social Media Services')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('লাইক, কমেন্ট, শেয়ার, ফলোয়ার, সাবস্ক্রাইবার এবং আরো অনেক কিছু', 'Likes, comments, shares, followers, subscribers and more')}
          </p>
        </div>

        {success && (
          <div className="card-3d p-4 mb-6 border-l-4 border-l-secondary bg-secondary/10">
            <p className="text-sm font-medium text-foreground">✅ {t('আপনার অর্ডার রিকোয়েস্ট পাঠানো হয়েছে!', 'Your order request has been sent!')}</p>
          </div>
        )}

        {/* Platform Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {platforms.map(p => {
            const Icon = platformIcons[p] || Star;
            const name = platformNameMap[p] || { bn: p, en: p };
            return (
              <button key={p} onClick={() => setSelectedPlatform(p)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  selectedPlatform === p ? 'gradient-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/80'
                }`}>
                {p !== 'all' && <Icon className="w-4 h-4" />}
                {t(name.bn, name.en)}
              </button>
            );
          })}
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(svc => {
            const Icon = platformIcons[svc.platform] || Star;
            const bgColor = platformColors[svc.platform] || 'bg-primary';
            return (
              <div key={svc.id} className="card-3d p-5 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">{language === 'bn' ? svc.nameBn : svc.nameEn}</h3>
                    <span className="text-xs text-muted-foreground capitalize">{svc.platform}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground flex-1">{language === 'bn' ? svc.descriptionBn : svc.descriptionEn}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-primary">৳{svc.price}</span>
                    <span className="text-xs text-muted-foreground">/{svc.unit}</span>
                  </div>
                  {user ? (
                    <button onClick={() => { setSelectedService(svc.id); setQuantity(svc.minQuantity); }} className="btn-3d gradient-primary text-primary-foreground px-4 py-2 text-sm">
                      {t('অর্ডার', 'Order')}
                    </button>
                  ) : (
                    <Link to="/login" className="btn-3d gradient-primary text-primary-foreground px-4 py-2 text-sm">{t('লগইন', 'Login')}</Link>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {t('সর্বনিম্ন', 'Min')}: {svc.minQuantity} | {t('সর্বোচ্চ', 'Max')}: {svc.maxQuantity}
                </p>
              </div>
            );
          })}
        </div>

        {/* Order Modal */}
        {selectedService && activeSvc && user && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm">
            <div className="card-3d w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-bold text-foreground mb-1">{language === 'bn' ? activeSvc.nameBn : activeSvc.nameEn}</h3>
              <p className="text-sm text-muted-foreground mb-4">{t('অর্ডার ফর্ম পূরণ করুন', 'Fill the order form')}</p>

              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-sm font-medium text-foreground">{t('পরিমাণ', 'Quantity')} ({activeSvc.unit})</label>
                  <input type="number" min={activeSvc.minQuantity} max={activeSvc.maxQuantity} value={quantity}
                    onChange={e => setQuantity(Math.min(activeSvc.maxQuantity, Math.max(activeSvc.minQuantity, Number(e.target.value))))}
                    className="w-full mt-1 px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">{t('লিংক দিন', 'Enter Link/URL')}</label>
                  <input type="url" value={link} onChange={e => setLink(e.target.value)} placeholder={t('পেজ/পোস্ট/চ্যানেল লিংক', 'Page/Post/Channel link')}
                    className="w-full mt-1 px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-sm text-foreground">{t('মোট মূল্য', 'Total Price')}: <span className="text-xl font-bold text-primary">৳{totalPrice}</span></p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                {Object.entries(paymentNumbers).map(([key, num]) => (
                  <div key={key} className={`p-3 rounded-lg border cursor-pointer transition-all ${method === key ? 'border-primary bg-primary/5' : 'border-border'}`} onClick={() => setMethod(key)}>
                    <p className="font-semibold text-foreground capitalize">{key === 'bkash' ? 'বিকাশ (bKash)' : key === 'nagad' ? 'নগদ (Nagad)' : 'রকেট (Rocket)'}</p>
                    <p className="text-lg font-bold text-primary">{num}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleOrder} className="space-y-3">
                <input type="text" placeholder={t('ট্রানজেকশন আইডি', 'Transaction ID')} value={txId} onChange={e => setTxId(e.target.value)} required className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:ring-2 focus:ring-primary outline-none" />
                <input type="text" placeholder={t('আপনার মোবাইল নম্বর', 'Your Mobile Number')} value={txMobile} onChange={e => setTxMobile(e.target.value)} required className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:ring-2 focus:ring-primary outline-none" />
                <div className="flex gap-3">
                  <button type="button" onClick={() => setSelectedService(null)} className="flex-1 py-2.5 rounded-lg border border-border text-foreground text-sm hover:bg-muted">{t('বাতিল', 'Cancel')}</button>
                  <button type="submit" className="flex-1 btn-3d gradient-primary text-primary-foreground py-2.5 text-sm">{t('অর্ডার কনফার্ম', 'Confirm Order')}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SocialServicesPage;
