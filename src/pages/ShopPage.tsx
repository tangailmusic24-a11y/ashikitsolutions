import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { ShoppingBag, Tag } from 'lucide-react';

const ShopPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { shopItems, addTransaction } = useData();
  const { user } = useAuth();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [txId, setTxId] = useState('');
  const [txMobile, setTxMobile] = useState('');
  const [method, setMethod] = useState('bkash');
  const [success, setSuccess] = useState(false);

  const paymentNumbers: Record<string, string> = { bkash: '01688230246', nagad: '01303216921', rocket: '013032169215' };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedItem || !txId || !txMobile) return;
    const item = shopItems.find(i => i.id === selectedItem);
    if (!item) return;
    await addTransaction({
      userId: user.id, userName: user.fullName, packageId: item.id,
      packageName: language === 'bn' ? item.nameBn : item.nameEn,
      amount: item.price, method, transactionId: txId, mobile: txMobile,
    });
    setSuccess(true); setSelectedItem(null); setTxId(''); setTxMobile('');
    setTimeout(() => setSuccess(false), 5000);
  };

  const inStockItems = shopItems.filter(i => i.inStock);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
            <ShoppingBag className="w-8 h-8 text-primary" />
            {t('শপ', 'Shop')}
          </h1>
          <p className="text-muted-foreground mt-2">{t('আমাদের সার্ভিস ও প্রোডাক্ট কিনুন', 'Browse our services & products')}</p>
        </div>

        {success && (
          <div className="card-3d p-4 mb-6 border-l-4 border-l-secondary bg-secondary/10">
            <p className="text-sm font-medium text-foreground">
              ✅ {t('আপনার অর্ডার রিকোয়েস্ট পাঠানো হয়েছে!', 'Your order request has been sent!')}
            </p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {inStockItems.map(item => (
            <div key={item.id} className="card-3d p-5 flex flex-col">
              <div className="w-full h-32 rounded-lg bg-muted flex items-center justify-center mb-4">
                <ShoppingBag className="w-12 h-12 text-muted-foreground/30" />
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary self-start mb-2 capitalize">
                <Tag className="w-3 h-3 inline mr-1" />{item.category}
              </span>
              <h3 className="text-lg font-bold text-foreground">{language === 'bn' ? item.nameBn : item.nameEn}</h3>
              <p className="text-sm text-muted-foreground mt-1 flex-1">{language === 'bn' ? item.descriptionBn : item.descriptionEn}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">৳{item.price}</span>
                {user ? (
                  <button onClick={() => setSelectedItem(item.id)} className="btn-3d gradient-primary text-primary-foreground px-4 py-2 text-sm">
                    {t('কিনুন', 'Buy')}
                  </button>
                ) : (
                  <Link to="/login" className="btn-3d gradient-primary text-primary-foreground px-4 py-2 text-sm">
                    {t('লগইন', 'Login')}
                  </Link>
                )}
              </div>
            </div>
          ))}
          {inStockItems.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground py-10">{t('কোনো আইটেম নেই', 'No items available')}</p>
          )}
        </div>

        {/* Payment Modal */}
        {selectedItem && user && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm">
            <div className="card-3d w-full max-w-md p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">{t('পেমেন্ট করুন', 'Make Payment')}</h3>
              <div className="space-y-3 mb-4">
                {Object.entries(paymentNumbers).map(([key, num]) => (
                  <div key={key} className={`p-3 rounded-lg border cursor-pointer transition-all ${method === key ? 'border-primary bg-primary/5' : 'border-border'}`} onClick={() => setMethod(key)}>
                    <p className="font-semibold text-foreground capitalize">{key === 'bkash' ? 'বিকাশ (bKash)' : key === 'nagad' ? 'নগদ (Nagad)' : 'রকেট (Rocket)'}</p>
                    <p className="text-lg font-bold text-primary">{num}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={handlePurchase} className="space-y-3">
                <input type="text" placeholder={t('ট্রানজেকশন আইডি', 'Transaction ID')} value={txId} onChange={e => setTxId(e.target.value)} required className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:ring-2 focus:ring-primary outline-none" />
                <input type="text" placeholder={t('আপনার মোবাইল নম্বর', 'Your Mobile Number')} value={txMobile} onChange={e => setTxMobile(e.target.value)} required className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:ring-2 focus:ring-primary outline-none" />
                <div className="flex gap-3">
                  <button type="button" onClick={() => setSelectedItem(null)} className="flex-1 py-2.5 rounded-lg border border-border text-foreground text-sm hover:bg-muted">{t('বাতিল', 'Cancel')}</button>
                  <button type="submit" className="flex-1 btn-3d gradient-primary text-primary-foreground py-2.5 text-sm">{t('কনফার্ম', 'Confirm')}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ShopPage;
