import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Check, ArrowRight } from 'lucide-react';

const PackagesPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { packages, addTransaction } = useData();
  const { user } = useAuth();
  const [selectedPkg, setSelectedPkg] = useState<string | null>(null);
  const [txId, setTxId] = useState('');
  const [txMobile, setTxMobile] = useState('');
  const [method, setMethod] = useState('bkash');
  const [success, setSuccess] = useState(false);

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedPkg || !txId || !txMobile) return;
    const pkg = packages.find(p => p.id === selectedPkg);
    if (!pkg) return;
    addTransaction({
      userId: user.id,
      userName: user.fullName,
      packageId: pkg.id,
      packageName: language === 'bn' ? pkg.nameBn : pkg.nameEn,
      amount: pkg.price,
      method,
      transactionId: txId,
      mobile: txMobile,
    });
    setSuccess(true);
    setSelectedPkg(null);
    setTxId('');
    setTxMobile('');
    setTimeout(() => setSuccess(false), 5000);
  };

  const paymentNumbers = {
    bkash: '01688230246',
    nagad: '01303216921',
    rocket: '013032169215',
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">{t('আমাদের প্যাকেজসমূহ', 'Our Packages')}</h1>
          <p className="text-muted-foreground mt-2">{t('আপনার প্রয়োজন অনুযায়ী প্যাকেজ বেছে নিন', 'Choose the right package for you')}</p>
        </div>

        {success && (
          <div className="card-3d p-4 mb-6 border-l-4 border-l-secondary bg-secondary/10">
            <p className="text-sm font-medium text-foreground">
              ✅ {t('আপনার পেমেন্ট রিকোয়েস্ট পাঠানো হয়েছে! এডমিন ভেরিফাই করলে প্যাকেজ অ্যাক্টিভ হবে।', 'Payment request sent! Package will be activated after admin verification.')}
            </p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {packages.map(pkg => (
            <div key={pkg.id} className={`card-3d p-6 flex flex-col ${pkg.popular ? 'ring-2 ring-primary' : ''}`}>
              {pkg.popular && (
                <span className="self-start text-xs px-2 py-0.5 rounded-full gradient-primary text-primary-foreground mb-3">
                  ⭐ {t('জনপ্রিয়', 'Popular')}
                </span>
              )}
              <h3 className="text-lg font-bold text-foreground">{language === 'bn' ? pkg.nameBn : pkg.nameEn}</h3>
              <p className="text-sm text-muted-foreground mt-2 flex-1">{language === 'bn' ? pkg.descriptionBn : pkg.descriptionEn}</p>
              <div className="mt-4 mb-3">
                <span className="text-3xl font-bold text-primary">৳{pkg.price}</span>
              </div>
              <ul className="space-y-2 mb-4">
                {(language === 'bn' ? pkg.featuresBn : pkg.features).map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-secondary shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              {user ? (
                <button
                  onClick={() => setSelectedPkg(pkg.id)}
                  className="btn-3d gradient-primary text-primary-foreground py-2.5 text-sm w-full"
                >
                  {t('এখনই কিনুন', 'Buy Now')}
                </button>
              ) : (
                <Link to="/login" className="btn-3d gradient-primary text-primary-foreground py-2.5 text-sm w-full text-center block">
                  {t('লগইন করুন', 'Login to Buy')}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Payment Modal */}
        {selectedPkg && user && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm">
            <div className="card-3d w-full max-w-md p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">{t('পেমেন্ট করুন', 'Make Payment')}</h3>

              <div className="space-y-3 mb-4">
                {Object.entries(paymentNumbers).map(([key, num]) => (
                  <div key={key} className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    method === key ? 'border-primary bg-primary/5' : 'border-border'
                  }`} onClick={() => setMethod(key)}>
                    <p className="font-semibold text-foreground capitalize">{key === 'bkash' ? 'বিকাশ (bKash)' : key === 'nagad' ? 'নগদ (Nagad)' : 'রকেট (Rocket)'}</p>
                    <p className="text-lg font-bold text-primary">{num}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handlePurchase} className="space-y-3">
                <input
                  type="text"
                  placeholder={t('ট্রানজেকশন আইডি', 'Transaction ID')}
                  value={txId}
                  onChange={e => setTxId(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:ring-2 focus:ring-primary outline-none"
                />
                <input
                  type="text"
                  placeholder={t('আপনার মোবাইল নম্বর', 'Your Mobile Number')}
                  value={txMobile}
                  onChange={e => setTxMobile(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:ring-2 focus:ring-primary outline-none"
                />
                <div className="flex gap-3">
                  <button type="button" onClick={() => setSelectedPkg(null)} className="flex-1 py-2.5 rounded-lg border border-border text-foreground text-sm hover:bg-muted">
                    {t('বাতিল', 'Cancel')}
                  </button>
                  <button type="submit" className="flex-1 btn-3d gradient-primary text-primary-foreground py-2.5 text-sm">
                    {t('কনফার্ম করুন', 'Confirm')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PackagesPage;
