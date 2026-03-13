import React, { useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Package as PkgIcon, Bell, Users, CreditCard, Plus, Trash2, Check, X, ShoppingBag, Zap, Upload, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AdminPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, isAdmin, allProfiles, refreshProfiles } = useAuth();
  const {
    packages, notices, transactions, shopItems, socialServices,
    addPackage, deletePackage, addNotice, deleteNotice,
    updateTransactionStatus, addShopItem, deleteShopItem,
    addSocialService, deleteSocialService,
  } = useData();
  const [tab, setTab] = useState('packages');
  const [newPkg, setNewPkg] = useState({ nameBn: '', nameEn: '', descriptionBn: '', descriptionEn: '', price: 0 });
  const [newNotice, setNewNotice] = useState({ titleBn: '', titleEn: '', contentBn: '', contentEn: '' });
  const [newShop, setNewShop] = useState({ nameBn: '', nameEn: '', descriptionBn: '', descriptionEn: '', price: 0, category: 'service', image: '', inStock: true });
  const [uploadingShopImg, setUploadingShopImg] = useState(false);
  const shopImgRef = useRef<HTMLInputElement>(null);
  const [newSvc, setNewSvc] = useState({ platform: 'facebook', serviceType: 'likes', nameBn: '', nameEn: '', descriptionBn: '', descriptionEn: '', price: 0, minQuantity: 100, maxQuantity: 10000, unit: 'likes' });

  if (!user || !isAdmin) return <Navigate to="/login" />;

  const tabs = [
    { key: 'packages', icon: PkgIcon, labelBn: 'প্যাকেজ', labelEn: 'Packages' },
    { key: 'shop', icon: ShoppingBag, labelBn: 'শপ', labelEn: 'Shop' },
    { key: 'social', icon: Zap, labelBn: 'সোশ্যাল সার্ভিস', labelEn: 'Social Services' },
    { key: 'notices', icon: Bell, labelBn: 'নোটিশ', labelEn: 'Notices' },
    { key: 'transactions', icon: CreditCard, labelBn: 'পেমেন্ট', labelEn: 'Payments' },
    { key: 'users', icon: Users, labelBn: 'ইউজার', labelEn: 'Users' },
  ];

  const handleAddPkg = async () => { if (!newPkg.nameEn) return; await addPackage({ ...newPkg, features: [], featuresBn: [] }); setNewPkg({ nameBn: '', nameEn: '', descriptionBn: '', descriptionEn: '', price: 0 }); };
  const handleAddNotice = async () => { if (!newNotice.titleEn) return; await addNotice({ ...newNotice, date: new Date().toISOString(), important: false }); setNewNotice({ titleBn: '', titleEn: '', contentBn: '', contentEn: '' }); };
  const handleAddShop = async () => { if (!newShop.nameEn) return; await addShopItem(newShop); setNewShop({ nameBn: '', nameEn: '', descriptionBn: '', descriptionEn: '', price: 0, category: 'service', image: '', inStock: true }); };

  const handleShopImageUpload = async (file: File) => {
    if (!file || file.size > 5 * 1024 * 1024) { toast.error('File must be under 5MB'); return; }
    if (!file.type.startsWith('image/')) { toast.error('Only images allowed'); return; }
    setUploadingShopImg(true);
    const ext = file.name.split('.').pop();
    const filePath = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('shop-images').upload(filePath, file, { upsert: true });
    if (error) { toast.error('Upload failed'); setUploadingShopImg(false); return; }
    const { data: urlData } = supabase.storage.from('shop-images').getPublicUrl(filePath);
    setNewShop(prev => ({ ...prev, image: urlData.publicUrl }));
    setUploadingShopImg(false);
    toast.success(t('ছবি আপলোড হয়েছে', 'Image uploaded'));
  };
  const handleAddSvc = async () => { if (!newSvc.nameEn) return; await addSocialService(newSvc); setNewSvc({ platform: 'facebook', serviceType: 'likes', nameBn: '', nameEn: '', descriptionBn: '', descriptionEn: '', price: 0, minQuantity: 100, maxQuantity: 10000, unit: 'likes' }); };

  const inputCls = "px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm";

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">🛡️ {t('এডমিন প্যানেল', 'Admin Panel')}</h1>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tb => (
            <button key={tb.key} onClick={() => { setTab(tb.key); if (tb.key === 'users') refreshProfiles(); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${tab === tb.key ? 'gradient-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/80'}`}>
              <tb.icon className="w-4 h-4" /> {t(tb.labelBn, tb.labelEn)}
            </button>
          ))}
        </div>

        {/* Packages */}
        {tab === 'packages' && (
          <div className="space-y-4">
            <div className="card-3d p-4">
              <h3 className="font-bold text-foreground mb-3">{t('নতুন প্যাকেজ', 'New Package')}</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <input placeholder="Name (EN)" value={newPkg.nameEn} onChange={e => setNewPkg({ ...newPkg, nameEn: e.target.value })} className={inputCls} />
                <input placeholder="নাম (বাংলা)" value={newPkg.nameBn} onChange={e => setNewPkg({ ...newPkg, nameBn: e.target.value })} className={inputCls} />
                <input placeholder="Description (EN)" value={newPkg.descriptionEn} onChange={e => setNewPkg({ ...newPkg, descriptionEn: e.target.value })} className={inputCls} />
                <input placeholder="বিবরণ (বাংলা)" value={newPkg.descriptionBn} onChange={e => setNewPkg({ ...newPkg, descriptionBn: e.target.value })} className={inputCls} />
                <input type="number" placeholder="Price" value={newPkg.price || ''} onChange={e => setNewPkg({ ...newPkg, price: Number(e.target.value) })} className={inputCls} />
                <button onClick={handleAddPkg} className="btn-3d gradient-primary text-primary-foreground py-2 text-sm flex items-center justify-center gap-1"><Plus className="w-4 h-4" /> {t('যোগ', 'Add')}</button>
              </div>
            </div>
            {packages.map(pkg => (
              <div key={pkg.id} className="card-3d p-4 flex items-center justify-between">
                <div><h4 className="font-semibold text-foreground">{language === 'bn' ? pkg.nameBn : pkg.nameEn}</h4><p className="text-sm text-muted-foreground">৳{pkg.price}</p></div>
                <button onClick={() => deletePackage(pkg.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        )}

        {/* Shop Items */}
        {tab === 'shop' && (
          <div className="space-y-4">
            <div className="card-3d p-4">
              <h3 className="font-bold text-foreground mb-3">{t('নতুন আইটেম', 'New Item')}</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <input placeholder="Name (EN)" value={newShop.nameEn} onChange={e => setNewShop({ ...newShop, nameEn: e.target.value })} className={inputCls} />
                <input placeholder="নাম (বাংলা)" value={newShop.nameBn} onChange={e => setNewShop({ ...newShop, nameBn: e.target.value })} className={inputCls} />
                <input placeholder="Description (EN)" value={newShop.descriptionEn} onChange={e => setNewShop({ ...newShop, descriptionEn: e.target.value })} className={inputCls} />
                <input placeholder="বিবরণ (বাংলা)" value={newShop.descriptionBn} onChange={e => setNewShop({ ...newShop, descriptionBn: e.target.value })} className={inputCls} />
                <input type="number" placeholder="Price" value={newShop.price || ''} onChange={e => setNewShop({ ...newShop, price: Number(e.target.value) })} className={inputCls} />
                <select value={newShop.category} onChange={e => setNewShop({ ...newShop, category: e.target.value })} className={inputCls}>
                  <option value="service">Service</option><option value="design">Design</option><option value="development">Development</option><option value="digital">Digital</option><option value="other">Other</option>
                </select>
                {/* Image Upload */}
                <div className="sm:col-span-2">
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:border-primary transition-colors"
                    onClick={() => shopImgRef.current?.click()}
                  >
                    {newShop.image ? (
                      <img src={newShop.image} alt="Preview" className="w-16 h-16 rounded-lg object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                        <Image className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{t('ছবি আপলোড করুন', 'Upload Image')}</p>
                      <p className="text-xs text-muted-foreground">{t('সর্বোচ্চ ৫MB', 'Max 5MB')}</p>
                    </div>
                    {uploadingShopImg && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />}
                    <Upload className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <input ref={shopImgRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleShopImageUpload(e.target.files[0])} />
                </div>
                <button onClick={handleAddShop} className="btn-3d gradient-primary text-primary-foreground py-2 text-sm flex items-center justify-center gap-1 sm:col-span-2"><Plus className="w-4 h-4" /> {t('যোগ', 'Add')}</button>
              </div>
            </div>
            {shopItems.map(item => (
              <div key={item.id} className="card-3d p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {item.image ? (
                    <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center"><ShoppingBag className="w-5 h-5 text-muted-foreground/40" /></div>
                  )}
                  <div><h4 className="font-semibold text-foreground">{language === 'bn' ? item.nameBn : item.nameEn}</h4><p className="text-sm text-muted-foreground">৳{item.price} • {item.category}</p></div>
                </div>
                <button onClick={() => deleteShopItem(item.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        )}

        {/* Social Services */}
        {tab === 'social' && (
          <div className="space-y-4">
            <div className="card-3d p-4">
              <h3 className="font-bold text-foreground mb-3">{t('নতুন সোশ্যাল সার্ভিস', 'New Social Service')}</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <input placeholder="Name (EN)" value={newSvc.nameEn} onChange={e => setNewSvc({ ...newSvc, nameEn: e.target.value })} className={inputCls} />
                <input placeholder="নাম (বাংলা)" value={newSvc.nameBn} onChange={e => setNewSvc({ ...newSvc, nameBn: e.target.value })} className={inputCls} />
                <select value={newSvc.platform} onChange={e => setNewSvc({ ...newSvc, platform: e.target.value })} className={inputCls}>
                  <option value="facebook">Facebook</option><option value="youtube">YouTube</option><option value="instagram">Instagram</option><option value="tiktok">TikTok</option><option value="telegram">Telegram</option>
                </select>
                <input placeholder="Service Type (likes/followers)" value={newSvc.serviceType} onChange={e => setNewSvc({ ...newSvc, serviceType: e.target.value })} className={inputCls} />
                <input placeholder="Description (EN)" value={newSvc.descriptionEn} onChange={e => setNewSvc({ ...newSvc, descriptionEn: e.target.value })} className={inputCls} />
                <input placeholder="বিবরণ (বাংলা)" value={newSvc.descriptionBn} onChange={e => setNewSvc({ ...newSvc, descriptionBn: e.target.value })} className={inputCls} />
                <input type="number" placeholder="Price per unit" value={newSvc.price || ''} onChange={e => setNewSvc({ ...newSvc, price: Number(e.target.value) })} className={inputCls} />
                <input placeholder="Unit (likes/followers/hours)" value={newSvc.unit} onChange={e => setNewSvc({ ...newSvc, unit: e.target.value })} className={inputCls} />
                <input type="number" placeholder="Min Quantity" value={newSvc.minQuantity || ''} onChange={e => setNewSvc({ ...newSvc, minQuantity: Number(e.target.value) })} className={inputCls} />
                <input type="number" placeholder="Max Quantity" value={newSvc.maxQuantity || ''} onChange={e => setNewSvc({ ...newSvc, maxQuantity: Number(e.target.value) })} className={inputCls} />
                <button onClick={handleAddSvc} className="btn-3d gradient-primary text-primary-foreground py-2 text-sm flex items-center justify-center gap-1 sm:col-span-2"><Plus className="w-4 h-4" /> {t('যোগ', 'Add')}</button>
              </div>
            </div>
            {socialServices.map(svc => (
              <div key={svc.id} className="card-3d p-4 flex items-center justify-between">
                <div><h4 className="font-semibold text-foreground">{language === 'bn' ? svc.nameBn : svc.nameEn}</h4><p className="text-sm text-muted-foreground">{svc.platform} • ৳{svc.price}/{svc.unit}</p></div>
                <button onClick={() => deleteSocialService(svc.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        )}

        {/* Notices */}
        {tab === 'notices' && (
          <div className="space-y-4">
            <div className="card-3d p-4">
              <h3 className="font-bold text-foreground mb-3">{t('নতুন নোটিশ', 'New Notice')}</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <input placeholder="Title (EN)" value={newNotice.titleEn} onChange={e => setNewNotice({ ...newNotice, titleEn: e.target.value })} className={inputCls} />
                <input placeholder="শিরোনাম (বাংলা)" value={newNotice.titleBn} onChange={e => setNewNotice({ ...newNotice, titleBn: e.target.value })} className={inputCls} />
                <textarea placeholder="Content (EN)" value={newNotice.contentEn} onChange={e => setNewNotice({ ...newNotice, contentEn: e.target.value })} className={inputCls} rows={2} />
                <textarea placeholder="বিষয়বস্তু (বাংলা)" value={newNotice.contentBn} onChange={e => setNewNotice({ ...newNotice, contentBn: e.target.value })} className={inputCls} rows={2} />
              </div>
              <button onClick={handleAddNotice} className="btn-3d gradient-primary text-primary-foreground py-2 px-6 text-sm mt-3 flex items-center gap-1"><Plus className="w-4 h-4" /> {t('যোগ', 'Add')}</button>
            </div>
            {notices.map(n => (
              <div key={n.id} className="card-3d p-4 flex items-center justify-between">
                <div><h4 className="font-semibold text-foreground">{language === 'bn' ? n.titleBn : n.titleEn}</h4><p className="text-sm text-muted-foreground truncate max-w-md">{language === 'bn' ? n.contentBn : n.contentEn}</p></div>
                <button onClick={() => deleteNotice(n.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        )}

        {/* Transactions */}
        {tab === 'transactions' && (
          <div className="space-y-3">
            {transactions.length === 0 && <p className="text-center text-muted-foreground py-10">{t('কোনো ট্রানজেকশন নেই', 'No transactions')}</p>}
            {transactions.map(tx => (
              <div key={tx.id} className={`card-3d p-4 ${tx.status === 'pending' ? 'border-l-4 border-l-warning' : tx.status === 'approved' ? 'border-l-4 border-l-secondary' : 'border-l-4 border-l-destructive'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-foreground">{tx.packageName}</h4>
                    <p className="text-sm text-muted-foreground">{tx.userName} • ৳{tx.amount}</p>
                    <p className="text-xs text-muted-foreground">{tx.method} • TxID: {tx.transactionId} • {tx.mobile}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${tx.status === 'pending' ? 'bg-warning/20 text-warning' : tx.status === 'approved' ? 'bg-secondary/20 text-secondary' : 'bg-destructive/20 text-destructive'}`}>
                      {tx.status === 'pending' ? t('অপেক্ষমান', 'Pending') : tx.status === 'approved' ? t('অনুমোদিত', 'Approved') : t('প্রত্যাখ্যাত', 'Rejected')}
                    </span>
                  </div>
                  {tx.status === 'pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => updateTransactionStatus(tx.id, 'approved')} className="p-2 text-secondary hover:bg-secondary/10 rounded-lg"><Check className="w-4 h-4" /></button>
                      <button onClick={() => updateTransactionStatus(tx.id, 'rejected')} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg"><X className="w-4 h-4" /></button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div className="space-y-3">
            {allProfiles.length === 0 && <p className="text-center text-muted-foreground py-10">{t('কোনো ইউজার নেই', 'No users')}</p>}
            {allProfiles.map(u => (
              <div key={u.id} className="card-3d p-4">
                <h4 className="font-semibold text-foreground">{u.fullName || u.username}</h4>
                <p className="text-sm text-muted-foreground">@{u.username} • {u.email}</p>
                {u.mobile && <p className="text-xs text-muted-foreground">{u.mobile}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminPage;
