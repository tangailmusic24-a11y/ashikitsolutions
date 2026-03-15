import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

export interface SiteSetting {
  id: string;
  key: string;
  valueBn: string;
  valueEn: string;
}

interface DataContextType {
  packages: Package[];
  notices: Notice[];
  transactions: Transaction[];
  shopItems: ShopItem[];
  socialServices: SocialService[];
  siteSettings: SiteSetting[];
  getSetting: (key: string, lang?: 'bn' | 'en') => string;
  addPackage: (pkg: Omit<Package, 'id'>) => Promise<void>;
  updatePackage: (id: string, pkg: Partial<Package>) => Promise<void>;
  deletePackage: (id: string) => Promise<void>;
  addNotice: (notice: Omit<Notice, 'id'>) => Promise<void>;
  updateNotice: (id: string, notice: Partial<Notice>) => Promise<void>;
  deleteNotice: (id: string) => Promise<void>;
  addTransaction: (tx: Omit<Transaction, 'id' | 'status' | 'date'>) => Promise<void>;
  updateTransactionStatus: (id: string, status: Transaction['status']) => Promise<void>;
  addShopItem: (item: Omit<ShopItem, 'id'>) => Promise<void>;
  updateShopItem: (id: string, item: Partial<ShopItem>) => Promise<void>;
  deleteShopItem: (id: string) => Promise<void>;
  addSocialService: (svc: Omit<SocialService, 'id'>) => Promise<void>;
  updateSocialService: (id: string, svc: Partial<SocialService>) => Promise<void>;
  deleteSocialService: (id: string) => Promise<void>;
  updateSiteSetting: (key: string, valueBn: string, valueEn: string) => Promise<void>;
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mappers: DB (snake_case) -> App (camelCase)
const mapPkg = (r: any): Package => ({
  id: r.id, nameBn: r.name_bn, nameEn: r.name_en, descriptionBn: r.description_bn,
  descriptionEn: r.description_en, price: r.price, features: r.features || [],
  featuresBn: r.features_bn || [], popular: r.popular || false,
});
const mapNotice = (r: any): Notice => ({
  id: r.id, titleBn: r.title_bn, titleEn: r.title_en, contentBn: r.content_bn,
  contentEn: r.content_en, date: r.date || r.created_at, important: r.important || false,
});
const mapTx = (r: any): Transaction => ({
  id: r.id, userId: r.user_id, userName: r.user_name, packageId: r.package_id,
  packageName: r.package_name, amount: r.amount, method: r.method,
  transactionId: r.transaction_id, mobile: r.mobile, status: r.status as any,
  date: r.created_at,
});
const mapShop = (r: any): ShopItem => ({
  id: r.id, nameBn: r.name_bn, nameEn: r.name_en, descriptionBn: r.description_bn,
  descriptionEn: r.description_en, price: r.price, image: r.image || '',
  category: r.category || '', inStock: r.in_stock ?? true,
});
const mapSvc = (r: any): SocialService => ({
  id: r.id, platform: r.platform, serviceType: r.service_type, nameBn: r.name_bn,
  nameEn: r.name_en, descriptionBn: r.description_bn, descriptionEn: r.description_en,
  price: r.price, minQuantity: r.min_quantity, maxQuantity: r.max_quantity, unit: r.unit || '',
});

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [socialServices, setSocialServices] = useState<SocialService[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    const [pkgRes, noticeRes, shopRes, svcRes, txRes] = await Promise.all([
      supabase.from('packages').select('*').order('created_at'),
      supabase.from('notices').select('*').order('date', { ascending: false }),
      supabase.from('shop_items').select('*').order('created_at'),
      supabase.from('social_services').select('*').order('platform'),
      supabase.from('transactions').select('*').order('created_at', { ascending: false }),
    ]);
    if (pkgRes.data) setPackages(pkgRes.data.map(mapPkg));
    if (noticeRes.data) setNotices(noticeRes.data.map(mapNotice));
    if (shopRes.data) setShopItems(shopRes.data.map(mapShop));
    if (svcRes.data) setSocialServices(svcRes.data.map(mapSvc));
    if (txRes.data) setTransactions(txRes.data.map(mapTx));
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Packages
  const addPackage = async (pkg: Omit<Package, 'id'>) => {
    const { data } = await supabase.from('packages').insert({
      name_bn: pkg.nameBn, name_en: pkg.nameEn, description_bn: pkg.descriptionBn,
      description_en: pkg.descriptionEn, price: pkg.price, features: pkg.features,
      features_bn: pkg.featuresBn, popular: pkg.popular || false,
    }).select().single();
    if (data) setPackages(p => [...p, mapPkg(data)]);
  };
  const updatePackage = async (id: string, pkg: Partial<Package>) => {
    const up: any = {};
    if (pkg.nameBn !== undefined) up.name_bn = pkg.nameBn;
    if (pkg.nameEn !== undefined) up.name_en = pkg.nameEn;
    if (pkg.descriptionBn !== undefined) up.description_bn = pkg.descriptionBn;
    if (pkg.descriptionEn !== undefined) up.description_en = pkg.descriptionEn;
    if (pkg.price !== undefined) up.price = pkg.price;
    if (pkg.features !== undefined) up.features = pkg.features;
    if (pkg.featuresBn !== undefined) up.features_bn = pkg.featuresBn;
    if (pkg.popular !== undefined) up.popular = pkg.popular;
    await supabase.from('packages').update(up).eq('id', id);
    setPackages(p => p.map(x => x.id === id ? { ...x, ...pkg } : x));
  };
  const deletePackage = async (id: string) => {
    await supabase.from('packages').delete().eq('id', id);
    setPackages(p => p.filter(x => x.id !== id));
  };

  // Notices
  const addNotice = async (notice: Omit<Notice, 'id'>) => {
    const { data } = await supabase.from('notices').insert({
      title_bn: notice.titleBn, title_en: notice.titleEn, content_bn: notice.contentBn,
      content_en: notice.contentEn, date: notice.date, important: notice.important || false,
    }).select().single();
    if (data) setNotices(n => [mapNotice(data), ...n]);
  };
  const updateNotice = async (id: string, notice: Partial<Notice>) => {
    const up: any = {};
    if (notice.titleBn !== undefined) up.title_bn = notice.titleBn;
    if (notice.titleEn !== undefined) up.title_en = notice.titleEn;
    if (notice.contentBn !== undefined) up.content_bn = notice.contentBn;
    if (notice.contentEn !== undefined) up.content_en = notice.contentEn;
    if (notice.important !== undefined) up.important = notice.important;
    await supabase.from('notices').update(up).eq('id', id);
    setNotices(n => n.map(x => x.id === id ? { ...x, ...notice } : x));
  };
  const deleteNotice = async (id: string) => {
    await supabase.from('notices').delete().eq('id', id);
    setNotices(n => n.filter(x => x.id !== id));
  };

  // Transactions
  const addTransaction = async (tx: Omit<Transaction, 'id' | 'status' | 'date'>) => {
    const { data } = await supabase.from('transactions').insert({
      user_id: tx.userId, user_name: tx.userName, package_id: tx.packageId,
      package_name: tx.packageName, amount: tx.amount, method: tx.method,
      transaction_id: tx.transactionId, mobile: tx.mobile, status: 'pending',
    }).select().single();
    if (data) setTransactions(t => [mapTx(data), ...t]);
  };
  const updateTransactionStatus = async (id: string, status: Transaction['status']) => {
    await supabase.from('transactions').update({ status }).eq('id', id);
    setTransactions(t => t.map(x => x.id === id ? { ...x, status } : x));
  };

  // Shop Items
  const addShopItem = async (item: Omit<ShopItem, 'id'>) => {
    const { data } = await supabase.from('shop_items').insert({
      name_bn: item.nameBn, name_en: item.nameEn, description_bn: item.descriptionBn,
      description_en: item.descriptionEn, price: item.price, image: item.image,
      category: item.category, in_stock: item.inStock,
    }).select().single();
    if (data) setShopItems(s => [...s, mapShop(data)]);
  };
  const updateShopItem = async (id: string, item: Partial<ShopItem>) => {
    const up: any = {};
    if (item.nameBn !== undefined) up.name_bn = item.nameBn;
    if (item.nameEn !== undefined) up.name_en = item.nameEn;
    if (item.descriptionBn !== undefined) up.description_bn = item.descriptionBn;
    if (item.descriptionEn !== undefined) up.description_en = item.descriptionEn;
    if (item.price !== undefined) up.price = item.price;
    if (item.image !== undefined) up.image = item.image;
    if (item.category !== undefined) up.category = item.category;
    if (item.inStock !== undefined) up.in_stock = item.inStock;
    await supabase.from('shop_items').update(up).eq('id', id);
    setShopItems(s => s.map(x => x.id === id ? { ...x, ...item } : x));
  };
  const deleteShopItem = async (id: string) => {
    await supabase.from('shop_items').delete().eq('id', id);
    setShopItems(s => s.filter(x => x.id !== id));
  };

  // Social Services
  const addSocialService = async (svc: Omit<SocialService, 'id'>) => {
    const { data } = await supabase.from('social_services').insert({
      platform: svc.platform, service_type: svc.serviceType, name_bn: svc.nameBn,
      name_en: svc.nameEn, description_bn: svc.descriptionBn, description_en: svc.descriptionEn,
      price: svc.price, min_quantity: svc.minQuantity, max_quantity: svc.maxQuantity, unit: svc.unit,
    }).select().single();
    if (data) setSocialServices(s => [...s, mapSvc(data)]);
  };
  const updateSocialService = async (id: string, svc: Partial<SocialService>) => {
    const up: any = {};
    if (svc.platform !== undefined) up.platform = svc.platform;
    if (svc.serviceType !== undefined) up.service_type = svc.serviceType;
    if (svc.nameBn !== undefined) up.name_bn = svc.nameBn;
    if (svc.nameEn !== undefined) up.name_en = svc.nameEn;
    if (svc.descriptionBn !== undefined) up.description_bn = svc.descriptionBn;
    if (svc.descriptionEn !== undefined) up.description_en = svc.descriptionEn;
    if (svc.price !== undefined) up.price = svc.price;
    if (svc.minQuantity !== undefined) up.min_quantity = svc.minQuantity;
    if (svc.maxQuantity !== undefined) up.max_quantity = svc.maxQuantity;
    if (svc.unit !== undefined) up.unit = svc.unit;
    await supabase.from('social_services').update(up).eq('id', id);
    setSocialServices(s => s.map(x => x.id === id ? { ...x, ...svc } : x));
  };
  const deleteSocialService = async (id: string) => {
    await supabase.from('social_services').delete().eq('id', id);
    setSocialServices(s => s.filter(x => x.id !== id));
  };

  return (
    <DataContext.Provider value={{
      packages, notices, transactions, shopItems, socialServices, loading,
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
