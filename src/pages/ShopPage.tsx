import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { ShoppingBag, Tag, ChevronLeft, ChevronRight, AlertCircle, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import bkashLogo from '@/assets/bkash-logo.png';
import nagadLogo from '@/assets/nagad-logo.png';
import rocketLogo from '@/assets/rocket-logo.png';

const ITEMS_PER_PAGE = 12;

const paymentLogos: Record<string, string> = {
  bkash: bkashLogo,
  nagad: nagadLogo,
  rocket: rocketLogo,
};

const ShopPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { shopItems, transactions, addTransaction } = useData();
  const { user } = useAuth();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [txId, setTxId] = useState('');
  const [txMobile, setTxMobile] = useState('');
  const [method, setMethod] = useState('bkash');
  const [success, setSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showOrders, setShowOrders] = useState(false);

  const paymentNumbers: Record<string, string> = { bkash: '01688230246', nagad: '01303216921', rocket: '013032169215' };

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(shopItems.filter(i => i.category).map(i => i.category)));
    return ['all', ...cats];
  }, [shopItems]);

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

  const filteredItems = shopItems.filter(i => i.inStock && (selectedCategory === 'all' || i.category === selectedCategory));
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // User's orders
  const myOrders = user ? transactions.filter(tx => tx.userId === user.id) : [];

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

  const statusIcon = (status: string) => {
    if (status === 'approved') return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (status === 'rejected') return <XCircle className="w-4 h-4 text-destructive" />;
    return <Clock className="w-4 h-4 text-yellow-500" />;
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
            <ShoppingBag className="w-8 h-8 text-primary" />
            {t('শপ', 'Shop')}
          </h1>
          <p className="text-muted-foreground mt-2">{t('আমাদের সার্ভিস ও প্রোডাক্ট কিনুন', 'Browse our services & products')}</p>
        </div>

        {/* Order Tracking Toggle */}
        {user && myOrders.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => setShowOrders(!showOrders)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
            >
              <Package className="w-4 h-4" />
              {t(`আমার অর্ডার (${myOrders.length})`, `My Orders (${myOrders.length})`)}
            </button>

            {showOrders && (
              <div className="mt-3 space-y-2">
                {myOrders.map(order => (
                  <div key={order.id} className={`card-3d p-3 flex items-center justify-between border-l-4 ${
                    order.status === 'approved' ? 'border-l-green-500' : order.status === 'rejected' ? 'border-l-destructive' : 'border-l-yellow-500'
                  }`}>
                    <div className="flex items-center gap-3">
                      {statusIcon(order.status)}
                      <div>
                        <p className="text-sm font-semibold text-foreground">{order.packageName}</p>
                        <p className="text-xs text-muted-foreground">৳{order.amount} • {order.method} • TxID: {order.transactionId}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      order.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      order.status === 'rejected' ? 'bg-destructive/10 text-destructive' :
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {order.status === 'pending' ? t('অপেক্ষমান', 'Pending') : order.status === 'approved' ? t('অনুমোদিত', 'Approved') : t('প্রত্যাখ্যাত', 'Rejected')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {success && (
          <div className="card-3d p-4 mb-6 border-l-4 border-l-green-500 bg-green-500/10">
            <p className="text-sm font-medium text-foreground">
              ✅ {t('আপনার অর্ডার রিকোয়েস্ট পাঠানো হয়েছে! আপনি উপরের "আমার অর্ডার" থেকে ট্র্যাক করতে পারবেন।', 'Your order request has been sent! You can track it from "My Orders" above.')}
            </p>
          </div>
        )}

        {/* Category Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all capitalize ${
                selectedCategory === cat
                  ? 'gradient-primary text-primary-foreground'
                  : 'bg-muted text-foreground hover:bg-muted/80 border border-border'
              }`}
            >
              <Tag className="w-3 h-3" />
              {cat === 'all' ? t('সকল', 'All') : cat}
            </button>
          ))}
        </div>

        {/* Grid */}
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
          {filteredItems.length === 0 && (
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
            <div className="card-3d w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-bold text-foreground mb-4">{t('পেমেন্ট করুন', 'Make Payment')}</h3>
              
              {/* Payment Instructions */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-xl p-3 mb-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
                  <div className="text-xs text-yellow-800 dark:text-yellow-300 space-y-1">
                    <p className="font-semibold">{t('পেমেন্ট নির্দেশনা:', 'Payment Instructions:')}</p>
                    <p>{t('১. নিচের যেকোনো একটি নম্বরে "Send Money" করুন', '1. Send money to any number below')}</p>
                    <p>{t('২. ট্রানজেকশন আইডি এবং আপনার মোবাইল নম্বর দিন', '2. Enter transaction ID and your mobile number')}</p>
                    <p>{t('৩. এডমিন ভেরিফাই করার পর আপনার অর্ডার কনফার্ম হবে', '3. Your order will be confirmed after admin verification')}</p>
                  </div>
                </div>
              </div>

              {/* Payment Methods with Logos */}
              <div className="space-y-2 mb-4">
                {Object.entries(paymentNumbers).map(([key, num]) => (
                  <div
                    key={key}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                      method === key ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-primary/30'
                    }`}
                    onClick={() => setMethod(key)}
                  >
                    <img
                      src={paymentLogos[key]}
                      alt={key}
                      className="w-10 h-10 rounded-lg object-contain bg-white p-1"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-foreground text-sm">
                        {key === 'bkash' ? 'বিকাশ (bKash)' : key === 'nagad' ? 'নগদ (Nagad)' : 'রকেট (Rocket)'}
                      </p>
                      <p className="text-base font-bold text-primary">{num}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      method === key ? 'border-primary bg-primary' : 'border-muted-foreground'
                    }`}>
                      {method === key && <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground" />}
                    </div>
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
