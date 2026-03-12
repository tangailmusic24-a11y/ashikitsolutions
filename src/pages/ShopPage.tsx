import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { ShoppingBag, Tag, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

const ShopPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { shopItems, addTransaction } = useData();
  const { user } = useAuth();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [txId, setTxId] = useState('');
  const [txMobile, setTxMobile] = useState('');
  const [method, setMethod] = useState('bkash');
  const [success, setSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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
  const totalPages = Math.ceil(inStockItems.length / ITEMS_PER_PAGE);
  const paginatedItems = inStockItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

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

        {/* Grid: 2 cols mobile, 3 cols sm, 4 cols lg */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {paginatedItems.map(item => (
            <div key={item.id} className="card-3d p-3 flex flex-col">
              <div className="w-full aspect-square rounded-lg bg-muted flex items-center justify-center mb-2 overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={language === 'bn' ? item.nameBn : item.nameEn} className="w-full h-full object-cover" />
                ) : (
                  <ShoppingBag className="w-8 h-8 text-muted-foreground/30" />
                )}
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary self-start mb-1 capitalize">
                <Tag className="w-2.5 h-2.5 inline mr-0.5" />{item.category}
              </span>
              <h3 className="text-sm font-bold text-foreground line-clamp-2 leading-tight">{language === 'bn' ? item.nameBn : item.nameEn}</h3>
              <p className="text-xs text-muted-foreground mt-1 flex-1 line-clamp-2">{language === 'bn' ? item.descriptionBn : item.descriptionEn}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-lg font-bold text-primary">৳{item.price}</span>
                {user ? (
                  <button onClick={() => setSelectedItem(item.id)} className="btn-3d gradient-primary text-primary-foreground px-2.5 py-1.5 text-xs">
                    {t('কিনুন', 'Buy')}
                  </button>
                ) : (
                  <Link to="/login" className="btn-3d gradient-primary text-primary-foreground px-2.5 py-1.5 text-xs">
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-border text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {getPageNumbers().map((page, idx) =>
              typeof page === 'string' ? (
                <span key={`dots-${idx}`} className="px-2 text-muted-foreground text-sm">...</span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                    currentPage === page
                      ? 'gradient-primary text-primary-foreground'
                      : 'border border-border text-foreground hover:bg-muted'
                  }`}
                >
                  {page}
                </button>
              )
            )}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-border text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

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
