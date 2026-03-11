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

export interface ShopItem {
  id: string;
  nameBn: string;
  nameEn: string;
  descriptionBn: string;
  descriptionEn: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
}

export interface SocialService {
  id: string;
  platform: string;
  serviceType: string;
  nameBn: string;
  nameEn: string;
  descriptionBn: string;
  descriptionEn: string;
  price: number;
  minQuantity: number;
  maxQuantity: number;
  unit: string;
}

interface DataContextType {
  packages: Package[];
  notices: Notice[];
  transactions: Transaction[];
  shopItems: ShopItem[];
  socialServices: SocialService[];
  addPackage: (pkg: Omit<Package, 'id'>) => void;
  updatePackage: (id: string, pkg: Partial<Package>) => void;
  deletePackage: (id: string) => void;
  addNotice: (notice: Omit<Notice, 'id'>) => void;
  updateNotice: (id: string, notice: Partial<Notice>) => void;
  deleteNotice: (id: string) => void;
  addTransaction: (tx: Omit<Transaction, 'id' | 'status' | 'date'>) => void;
  updateTransactionStatus: (id: string, status: Transaction['status']) => void;
  addShopItem: (item: Omit<ShopItem, 'id'>) => void;
  updateShopItem: (id: string, item: Partial<ShopItem>) => void;
  deleteShopItem: (id: string) => void;
  addSocialService: (svc: Omit<SocialService, 'id'>) => void;
  updateSocialService: (id: string, svc: Partial<SocialService>) => void;
  deleteSocialService: (id: string) => void;
}

const defaultPackages: Package[] = [
  {
    id: 'pkg-1', nameBn: 'ফেসবুক মনিটাইজেশন সেটআপ', nameEn: 'Facebook Monetization Setup',
    descriptionBn: 'আপনার ফেসবুক পেজের জন্য সম্পূর্ণ মনিটাইজেশন সেটআপ করে দেওয়া হবে',
    descriptionEn: 'Complete monetization setup for your Facebook page',
    price: 500, features: ['Page Review', 'Eligibility Check', 'Full Setup', '24/7 Support'],
    featuresBn: ['পেজ রিভিউ', 'যোগ্যতা যাচাই', 'সম্পূর্ণ সেটআপ', '২৪/৭ সাপোর্ট'], popular: true,
  },
  {
    id: 'pkg-2', nameBn: 'ইউটিউব চ্যানেল মনিটাইজেশন', nameEn: 'YouTube Channel Monetization',
    descriptionBn: 'ইউটিউব চ্যানেলের মনিটাইজেশন সম্পূর্ণ গাইডলাইন ও সেটআপ',
    descriptionEn: 'Complete YouTube channel monetization guide & setup',
    price: 1000, features: ['Channel Audit', 'AdSense Setup', 'Optimization Tips', 'Priority Support'],
    featuresBn: ['চ্যানেল অডিট', 'অ্যাডসেন্স সেটআপ', 'অপটিমাইজেশন টিপস', 'প্রায়োরিটি সাপোর্ট'],
  },
  {
    id: 'pkg-3', nameBn: 'সোশ্যাল মিডিয়া ফুল প্যাকেজ', nameEn: 'Social Media Full Package',
    descriptionBn: 'ফেসবুক, ইউটিউব, ইনস্টাগ্রাম, টিকটক সকল প্ল্যাটফর্মের সমাধান',
    descriptionEn: 'Solutions for Facebook, YouTube, Instagram, TikTok - all platforms',
    price: 2000, features: ['All Platforms', 'Monetization', 'Growth Strategy', 'Dedicated Manager'],
    featuresBn: ['সকল প্ল্যাটফর্ম', 'মনিটাইজেশন', 'গ্রোথ স্ট্র্যাটেজি', 'ডেডিকেটেড ম্যানেজার'], popular: true,
  },
  {
    id: 'pkg-4', nameBn: 'সমস্যা সমাধান বেসিক', nameEn: 'Problem Solving Basic',
    descriptionBn: 'যেকোনো একটি সোশ্যাল মিডিয়া সমস্যার সমাধান',
    descriptionEn: 'Solution for any single social media issue',
    price: 200, features: ['Single Issue', 'Quick Fix', 'Chat Support'],
    featuresBn: ['একটি সমস্যা', 'দ্রুত সমাধান', 'চ্যাট সাপোর্ট'],
  },
];

const defaultNotices: Notice[] = [
  { id: 'notice-1', titleBn: '🎉 নতুন প্যাকেজ এসেছে!', titleEn: '🎉 New Packages Available!',
    contentBn: 'আমাদের নতুন সোশ্যাল মিডিয়া ফুল প্যাকেজ এখন পাওয়া যাচ্ছে।', contentEn: 'Our new Social Media Full Package is now available.',
    date: new Date().toISOString(), important: true },
  { id: 'notice-2', titleBn: '⏰ সার্ভিস টাইম পরিবর্তন', titleEn: '⏰ Service Hours Update',
    contentBn: 'সকাল ১১টা থেকে রাত ৮টা পর্যন্ত হোয়াটসঅ্যাপে যোগাযোগ করুন।', contentEn: 'Contact us on WhatsApp from 11 AM to 8 PM.',
    date: new Date().toISOString() },
  { id: 'notice-3', titleBn: '💰 পেমেন্ট মেথড আপডেট', titleEn: '💰 Payment Methods Updated',
    contentBn: 'এখন বিকাশ, নগদ এবং রকেট - তিনটি মাধ্যমেই পেমেন্ট করতে পারবেন!', contentEn: 'Now you can pay via bKash, Nagad, and Rocket!',
    date: new Date().toISOString() },
];

const defaultShopItems: ShopItem[] = [
  { id: 'shop-1', nameBn: 'ফেসবুক বিজনেস পেজ তৈরি', nameEn: 'Facebook Business Page Creation',
    descriptionBn: 'প্রফেশনাল ফেসবুক বিজনেস পেজ তৈরি করে দেওয়া হবে', descriptionEn: 'Professional Facebook Business Page creation service',
    price: 300, image: '', category: 'service', inStock: true },
  { id: 'shop-2', nameBn: 'কাস্টম লোগো ডিজাইন', nameEn: 'Custom Logo Design',
    descriptionBn: 'আপনার ব্র্যান্ডের জন্য কাস্টম লোগো ডিজাইন', descriptionEn: 'Custom logo design for your brand',
    price: 500, image: '', category: 'design', inStock: true },
  { id: 'shop-3', nameBn: 'ওয়েবসাইট তৈরি বেসিক', nameEn: 'Basic Website Development',
    descriptionBn: 'একটি বেসিক ওয়েবসাইট তৈরি করে দেওয়া হবে', descriptionEn: 'Basic website development service',
    price: 2000, image: '', category: 'development', inStock: true },
];

const defaultSocialServices: SocialService[] = [
  { id: 'ss-1', platform: 'facebook', serviceType: 'likes', nameBn: 'ফেসবুক পেজ/পোস্ট লাইক', nameEn: 'Facebook Page/Post Likes',
    descriptionBn: 'আপনার ফেসবুক পেজ বা পোস্টে লাইক বাড়ান', descriptionEn: 'Increase likes on your Facebook page or post',
    price: 1, minQuantity: 100, maxQuantity: 10000, unit: 'likes' },
  { id: 'ss-2', platform: 'facebook', serviceType: 'followers', nameBn: 'ফেসবুক ফলোয়ার', nameEn: 'Facebook Followers',
    descriptionBn: 'আপনার ফেসবুক প্রোফাইল/পেজে ফলোয়ার বাড়ান', descriptionEn: 'Increase followers on your Facebook profile/page',
    price: 2, minQuantity: 100, maxQuantity: 50000, unit: 'followers' },
  { id: 'ss-3', platform: 'facebook', serviceType: 'stars', nameBn: 'ফেসবুক স্টার', nameEn: 'Facebook Stars',
    descriptionBn: 'ফেসবুক স্টার কিনুন বা গিফট করুন', descriptionEn: 'Buy or gift Facebook Stars',
    price: 5, minQuantity: 50, maxQuantity: 5000, unit: 'stars' },
  { id: 'ss-4', platform: 'youtube', serviceType: 'subscribers', nameBn: 'ইউটিউব সাবস্ক্রাইবার', nameEn: 'YouTube Subscribers',
    descriptionBn: 'আপনার ইউটিউব চ্যানেলে সাবস্ক্রাইবার বাড়ান', descriptionEn: 'Increase subscribers on your YouTube channel',
    price: 3, minQuantity: 100, maxQuantity: 50000, unit: 'subscribers' },
  { id: 'ss-5', platform: 'youtube', serviceType: 'watch_time', nameBn: 'ইউটিউব ওয়াচ টাইম', nameEn: 'YouTube Watch Time',
    descriptionBn: 'ইউটিউব চ্যানেলে ওয়াচ টাইম বাড়ান (ঘণ্টা)', descriptionEn: 'Increase watch time on your YouTube channel (hours)',
    price: 10, minQuantity: 100, maxQuantity: 4000, unit: 'hours' },
  { id: 'ss-6', platform: 'youtube', serviceType: 'views', nameBn: 'ইউটিউব ভিউ', nameEn: 'YouTube Views',
    descriptionBn: 'আপনার ভিডিওতে ভিউ বাড়ান', descriptionEn: 'Increase views on your videos',
    price: 1, minQuantity: 500, maxQuantity: 100000, unit: 'views' },
  { id: 'ss-7', platform: 'instagram', serviceType: 'followers', nameBn: 'ইনস্টাগ্রাম ফলোয়ার', nameEn: 'Instagram Followers',
    descriptionBn: 'ইনস্টাগ্রামে ফলোয়ার বাড়ান', descriptionEn: 'Increase Instagram followers',
    price: 2, minQuantity: 100, maxQuantity: 50000, unit: 'followers' },
  { id: 'ss-8', platform: 'instagram', serviceType: 'likes', nameBn: 'ইনস্টাগ্রাম লাইক', nameEn: 'Instagram Likes',
    descriptionBn: 'ইনস্টাগ্রাম পোস্টে লাইক বাড়ান', descriptionEn: 'Increase likes on Instagram posts',
    price: 1, minQuantity: 100, maxQuantity: 10000, unit: 'likes' },
  { id: 'ss-9', platform: 'tiktok', serviceType: 'followers', nameBn: 'টিকটক ফলোয়ার', nameEn: 'TikTok Followers',
    descriptionBn: 'টিকটকে ফলোয়ার বাড়ান', descriptionEn: 'Increase TikTok followers',
    price: 2, minQuantity: 100, maxQuantity: 50000, unit: 'followers' },
  { id: 'ss-10', platform: 'tiktok', serviceType: 'likes', nameBn: 'টিকটক লাইক', nameEn: 'TikTok Likes',
    descriptionBn: 'টিকটক ভিডিওতে লাইক বাড়ান', descriptionEn: 'Increase likes on TikTok videos',
    price: 1, minQuantity: 100, maxQuantity: 10000, unit: 'likes' },
  { id: 'ss-11', platform: 'telegram', serviceType: 'members', nameBn: 'টেলিগ্রাম মেম্বার', nameEn: 'Telegram Members',
    descriptionBn: 'টেলিগ্রাম গ্রুপ/চ্যানেলে মেম্বার বাড়ান', descriptionEn: 'Increase Telegram group/channel members',
    price: 2, minQuantity: 100, maxQuantity: 50000, unit: 'members' },
  { id: 'ss-12', platform: 'facebook', serviceType: 'comments', nameBn: 'ফেসবুক কমেন্ট', nameEn: 'Facebook Comments',
    descriptionBn: 'ফেসবুক পোস্টে কমেন্ট পান', descriptionEn: 'Get comments on Facebook posts',
    price: 5, minQuantity: 10, maxQuantity: 1000, unit: 'comments' },
  { id: 'ss-13', platform: 'facebook', serviceType: 'shares', nameBn: 'ফেসবুক শেয়ার', nameEn: 'Facebook Shares',
    descriptionBn: 'ফেসবুক পোস্ট শেয়ার করান', descriptionEn: 'Get shares on Facebook posts',
    price: 3, minQuantity: 10, maxQuantity: 5000, unit: 'shares' },
  { id: 'ss-14', platform: 'youtube', serviceType: 'likes', nameBn: 'ইউটিউব লাইক', nameEn: 'YouTube Likes',
    descriptionBn: 'ইউটিউব ভিডিওতে লাইক বাড়ান', descriptionEn: 'Increase likes on YouTube videos',
    price: 2, minQuantity: 50, maxQuantity: 10000, unit: 'likes' },
  { id: 'ss-15', platform: 'youtube', serviceType: 'comments', nameBn: 'ইউটিউব কমেন্ট', nameEn: 'YouTube Comments',
    descriptionBn: 'ইউটিউব ভিডিওতে কমেন্ট পান', descriptionEn: 'Get comments on YouTube videos',
    price: 5, minQuantity: 10, maxQuantity: 1000, unit: 'comments' },
];

const DataContext = createContext<DataContextType | undefined>(undefined);

const load = <T,>(key: string, def: T): T => {
  try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : def; } catch { return def; }
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [packages, setPackages] = useState<Package[]>(() => load('ashik-packages', defaultPackages));
  const [notices, setNotices] = useState<Notice[]>(() => load('ashik-notices', defaultNotices));
  const [transactions, setTransactions] = useState<Transaction[]>(() => load('ashik-transactions', []));
  const [shopItems, setShopItems] = useState<ShopItem[]>(() => load('ashik-shop', defaultShopItems));
  const [socialServices, setSocialServices] = useState<SocialService[]>(() => load('ashik-social-services', defaultSocialServices));

  useEffect(() => { localStorage.setItem('ashik-packages', JSON.stringify(packages)); }, [packages]);
  useEffect(() => { localStorage.setItem('ashik-notices', JSON.stringify(notices)); }, [notices]);
  useEffect(() => { localStorage.setItem('ashik-transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('ashik-shop', JSON.stringify(shopItems)); }, [shopItems]);
  useEffect(() => { localStorage.setItem('ashik-social-services', JSON.stringify(socialServices)); }, [socialServices]);

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
  const addShopItem = (item: Omit<ShopItem, 'id'>) => setShopItems(s => [...s, { ...item, id: 'shop-' + Date.now() }]);
  const updateShopItem = (id: string, item: Partial<ShopItem>) => setShopItems(s => s.map(x => x.id === id ? { ...x, ...item } : x));
  const deleteShopItem = (id: string) => setShopItems(s => s.filter(x => x.id !== id));
  const addSocialService = (svc: Omit<SocialService, 'id'>) => setSocialServices(s => [...s, { ...svc, id: 'ss-' + Date.now() }]);
  const updateSocialService = (id: string, svc: Partial<SocialService>) => setSocialServices(s => s.map(x => x.id === id ? { ...x, ...svc } : x));
  const deleteSocialService = (id: string) => setSocialServices(s => s.filter(x => x.id !== id));

  return (
    <DataContext.Provider value={{
      packages, notices, transactions, shopItems, socialServices,
      addPackage, updatePackage, deletePackage,
      addNotice, updateNotice, deleteNotice,
      addTransaction, updateTransactionStatus,
      addShopItem, updateShopItem, deleteShopItem,
      addSocialService, updateSocialService, deleteSocialService,
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
