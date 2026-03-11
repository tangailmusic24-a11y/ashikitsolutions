import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Package {
  id: string;
  nameBn: string;
  nameEn: string;
  descriptionBn: string;
  descriptionEn: string;
  price: number;
  features: string[];
  featuresBn: string[];
  popular?: boolean;
}

export interface Notice {
  id: string;
  titleBn: string;
  titleEn: string;
  contentBn: string;
  contentEn: string;
  date: string;
  important?: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  packageId: string;
  packageName: string;
  amount: number;
  method: string;
  transactionId: string;
  mobile: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

interface DataContextType {
  packages: Package[];
  notices: Notice[];
  transactions: Transaction[];
  addPackage: (pkg: Omit<Package, 'id'>) => void;
  updatePackage: (id: string, pkg: Partial<Package>) => void;
  deletePackage: (id: string) => void;
  addNotice: (notice: Omit<Notice, 'id'>) => void;
  updateNotice: (id: string, notice: Partial<Notice>) => void;
  deleteNotice: (id: string) => void;
  addTransaction: (tx: Omit<Transaction, 'id' | 'status' | 'date'>) => void;
  updateTransactionStatus: (id: string, status: Transaction['status']) => void;
}

const defaultPackages: Package[] = [
  {
    id: 'pkg-1',
    nameBn: 'ফেসবুক মনিটাইজেশন সেটআপ',
    nameEn: 'Facebook Monetization Setup',
    descriptionBn: 'আপনার ফেসবুক পেজের জন্য সম্পূর্ণ মনিটাইজেশন সেটআপ করে দেওয়া হবে',
    descriptionEn: 'Complete monetization setup for your Facebook page',
    price: 500,
    features: ['Page Review', 'Eligibility Check', 'Full Setup', '24/7 Support'],
    featuresBn: ['পেজ রিভিউ', 'যোগ্যতা যাচাই', 'সম্পূর্ণ সেটআপ', '২৪/৭ সাপোর্ট'],
    popular: true,
  },
  {
    id: 'pkg-2',
    nameBn: 'ইউটিউব চ্যানেল মনিটাইজেশন',
    nameEn: 'YouTube Channel Monetization',
    descriptionBn: 'ইউটিউব চ্যানেলের মনিটাইজেশন সম্পূর্ণ গাইডলাইন ও সেটআপ',
    descriptionEn: 'Complete YouTube channel monetization guide & setup',
    price: 1000,
    features: ['Channel Audit', 'AdSense Setup', 'Optimization Tips', 'Priority Support'],
    featuresBn: ['চ্যানেল অডিট', 'অ্যাডসেন্স সেটআপ', 'অপটিমাইজেশন টিপস', 'প্রায়োরিটি সাপোর্ট'],
  },
  {
    id: 'pkg-3',
    nameBn: 'সোশ্যাল মিডিয়া ফুল প্যাকেজ',
    nameEn: 'Social Media Full Package',
    descriptionBn: 'ফেসবুক, ইউটিউব, ইনস্টাগ্রাম, টিকটক সকল প্ল্যাটফর্মের সমাধান',
    descriptionEn: 'Solutions for Facebook, YouTube, Instagram, TikTok - all platforms',
    price: 2000,
    features: ['All Platforms', 'Monetization', 'Growth Strategy', 'Dedicated Manager'],
    featuresBn: ['সকল প্ল্যাটফর্ম', 'মনিটাইজেশন', 'গ্রোথ স্ট্র্যাটেজি', 'ডেডিকেটেড ম্যানেজার'],
    popular: true,
  },
  {
    id: 'pkg-4',
    nameBn: 'সমস্যা সমাধান বেসিক',
    nameEn: 'Problem Solving Basic',
    descriptionBn: 'যেকোনো একটি সোশ্যাল মিডিয়া সমস্যার সমাধান',
    descriptionEn: 'Solution for any single social media issue',
    price: 200,
    features: ['Single Issue', 'Quick Fix', 'Chat Support'],
    featuresBn: ['একটি সমস্যা', 'দ্রুত সমাধান', 'চ্যাট সাপোর্ট'],
  },
];

const defaultNotices: Notice[] = [
  {
    id: 'notice-1',
    titleBn: '🎉 নতুন প্যাকেজ এসেছে!',
    titleEn: '🎉 New Packages Available!',
    contentBn: 'আমাদের নতুন সোশ্যাল মিডিয়া ফুল প্যাকেজ এখন পাওয়া যাচ্ছে। সকল প্ল্যাটফর্মের সমাধান একসাথে!',
    contentEn: 'Our new Social Media Full Package is now available. Solutions for all platforms in one package!',
    date: new Date().toISOString(),
    important: true,
  },
  {
    id: 'notice-2',
    titleBn: '⏰ সার্ভিস টাইম পরিবর্তন',
    titleEn: '⏰ Service Hours Update',
    contentBn: 'সকাল ১১টা থেকে রাত ৮টা পর্যন্ত হোয়াটসঅ্যাপে যোগাযোগ করুন।',
    contentEn: 'Contact us on WhatsApp from 11 AM to 8 PM.',
    date: new Date().toISOString(),
  },
  {
    id: 'notice-3',
    titleBn: '💰 পেমেন্ট মেথড আপডেট',
    titleEn: '💰 Payment Methods Updated',
    contentBn: 'এখন বিকাশ, নগদ এবং রকেট - তিনটি মাধ্যমেই পেমেন্ট করতে পারবেন!',
    contentEn: 'Now you can pay via bKash, Nagad, and Rocket - all three methods!',
    date: new Date().toISOString(),
  },
];

const DataContext = createContext<DataContextType | undefined>(undefined);

const load = <T,>(key: string, def: T): T => {
  try {
    const d = localStorage.getItem(key);
    return d ? JSON.parse(d) : def;
  } catch { return def; }
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [packages, setPackages] = useState<Package[]>(() => load('ashik-packages', defaultPackages));
  const [notices, setNotices] = useState<Notice[]>(() => load('ashik-notices', defaultNotices));
  const [transactions, setTransactions] = useState<Transaction[]>(() => load('ashik-transactions', []));

  useEffect(() => { localStorage.setItem('ashik-packages', JSON.stringify(packages)); }, [packages]);
  useEffect(() => { localStorage.setItem('ashik-notices', JSON.stringify(notices)); }, [notices]);
  useEffect(() => { localStorage.setItem('ashik-transactions', JSON.stringify(transactions)); }, [transactions]);

  const addPackage = (pkg: Omit<Package, 'id'>) => setPackages(p => [...p, { ...pkg, id: 'pkg-' + Date.now() }]);
  const updatePackage = (id: string, pkg: Partial<Package>) => setPackages(p => p.map(x => x.id === id ? { ...x, ...pkg } : x));
  const deletePackage = (id: string) => setPackages(p => p.filter(x => x.id !== id));

  const addNotice = (notice: Omit<Notice, 'id'>) => setNotices(n => [{ ...notice, id: 'notice-' + Date.now() }, ...n]);
  const updateNotice = (id: string, notice: Partial<Notice>) => setNotices(n => n.map(x => x.id === id ? { ...x, ...notice } : x));
  const deleteNotice = (id: string) => setNotices(n => n.filter(x => x.id !== id));

  const addTransaction = (tx: Omit<Transaction, 'id' | 'status' | 'date'>) =>
    setTransactions(t => [...t, { ...tx, id: 'tx-' + Date.now(), status: 'pending', date: new Date().toISOString() }]);
  const updateTransactionStatus = (id: string, status: Transaction['status']) =>
    setTransactions(t => t.map(x => x.id === id ? { ...x, status } : x));

  return (
    <DataContext.Provider value={{
      packages, notices, transactions,
      addPackage, updatePackage, deletePackage,
      addNotice, updateNotice, deleteNotice,
      addTransaction, updateTransactionStatus,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};
