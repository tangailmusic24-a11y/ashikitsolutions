import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import {
  Package as PkgIcon, Bell, Users, CreditCard, Plus, Trash2, Check, X,
  ShoppingBag, Zap, Upload, Image, Edit2, EyeOff, Eye, Save, ChevronDown, ChevronUp, Settings
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AdminPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, isAdmin, allProfiles, refreshProfiles } = useAuth();
  const {
    packages, notices, transactions, shopItems, socialServices, siteSettings,
    addPackage, updatePackage, deletePackage,
    addNotice, updateNotice, deleteNotice,
    updateTransactionStatus, addShopItem, updateShopItem, deleteShopItem,
    addSocialService, updateSocialService, deleteSocialService,
    updateSiteSetting,
  } = useData();

  const [tab, setTab] = useState('packages');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedAdd, setExpandedAdd] = useState(false);

  // New item states
  const [newPkg, setNewPkg] = useState({ nameBn: '', nameEn: '', descriptionBn: '', descriptionEn: '', price: 0 });
  const [newNotice, setNewNotice] = useState({ titleBn: '', titleEn: '', contentBn: '', contentEn: '' });
  const [newShop, setNewShop] = useState({ nameBn: '', nameEn: '', descriptionBn: '', descriptionEn: '', price: 0, category: 'service', image: '', inStock: true });
  const [newSvc, setNewSvc] = useState({ platform: 'facebook', serviceType: 'likes', nameBn: '', nameEn: '', descriptionBn: '', descriptionEn: '', price: 0, minQuantity: 100, maxQuantity: 10000, unit: 'likes' });

  // Edit states
  const [editPkg, setEditPkg] = useState<any>({});
  const [editNotice, setEditNotice] = useState<any>({});
  const [editShop, setEditShop] = useState<any>({});
  const [editSvc, setEditSvc] = useState<any>({});

  // Settings edit state
  const [settingsEdits, setSettingsEdits] = useState<Record<string, { valueBn: string; valueEn: string }>>({});

  const [uploadingShopImg, setUploadingShopImg] = useState(false);
  const shopImgRef = useRef<HTMLInputElement>(null);
  const editShopImgRef = useRef<HTMLInputElement>(null);

  // Initialize settings edits when siteSettings change
  useEffect(() => {
    const edits: Record<string, { valueBn: string; valueEn: string }> = {};
    siteSettings.forEach(s => { edits[s.key] = { valueBn: s.valueBn, valueEn: s.valueEn }; });
    setSettingsEdits(edits);
  }, [siteSettings]);

  if (!user || !isAdmin) return <Navigate to="/login" />;

  const tabs = [
    { key: 'packages', icon: PkgIcon, labelBn: 'প্যাকেজ', labelEn: 'Packages' },
    { key: 'shop', icon: ShoppingBag, labelBn: 'শপ', labelEn: 'Shop' },
    { key: 'social', icon: Zap, labelBn: 'সোশ্যাল', labelEn: 'Social' },
    { key: 'notices', icon: Bell, labelBn: 'নোটিশ', labelEn: 'Notices' },
    { key: 'transactions', icon: CreditCard, labelBn: 'পেমেন্ট', labelEn: 'Payments' },
    { key: 'users', icon: Users, labelBn: 'ইউজার', labelEn: 'Users' },
    { key: 'settings', icon: Settings, labelBn: 'সেটিংস', labelEn: 'Settings' },
  ];

  const inputCls = "w-full px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm focus:ring-2 focus:ring-primary outline-none";
  const btnPrimary = "btn-3d gradient-primary text-primary-foreground py-2 text-sm flex items-center justify-center gap-1";
  const btnDanger = "p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors";
  const btnEdit = "p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors";

  // Handlers
  const handleAddPkg = async () => {
    if (!newPkg.nameEn) return;
    await addPackage({ ...newPkg, features: [], featuresBn: [] });
    setNewPkg({ nameBn: '', nameEn: '', descriptionBn: '', descriptionEn: '', price: 0 });
    setExpandedAdd(false);
    toast.success(t('প্যাকেজ যোগ হয়েছে', 'Package added'));
  };

  const handleAddNotice = async () => {
    if (!newNotice.titleEn) return;
    await addNotice({ ...newNotice, date: new Date().toISOString(), important: false });
    setNewNotice({ titleBn: '', titleEn: '', contentBn: '', contentEn: '' });
    setExpandedAdd(false);
    toast.success(t('নোটিশ যোগ হয়েছে', 'Notice added'));
  };

  const handleAddShop = async () => {
    if (!newShop.nameEn) return;
    await addShopItem(newShop);
    setNewShop({ nameBn: '', nameEn: '', descriptionBn: '', descriptionEn: '', price: 0, category: 'service', image: '', inStock: true });
    setExpandedAdd(false);
    toast.success(t('আইটেম যোগ হয়েছে', 'Item added'));
  };

  const handleAddSvc = async () => {
    if (!newSvc.nameEn) return;
    await addSocialService(newSvc);
    setNewSvc({ platform: 'facebook', serviceType: 'likes', nameBn: '', nameEn: '', descriptionBn: '', descriptionEn: '', price: 0, minQuantity: 100, maxQuantity: 10000, unit: 'likes' });
    setExpandedAdd(false);
    toast.success(t('সার্ভিস যোগ হয়েছে', 'Service added'));
  };

  const handleShopImageUpload = async (file: File, isEdit = false) => {
    if (!file || file.size > 5 * 1024 * 1024) { toast.error('File must be under 5MB'); return; }
    if (!file.type.startsWith('image/')) { toast.error('Only images allowed'); return; }
    setUploadingShopImg(true);
    const ext = file.name.split('.').pop();
    const filePath = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('shop-images').upload(filePath, file, { upsert: true });
    if (error) { toast.error('Upload failed'); setUploadingShopImg(false); return; }
    const { data: urlData } = supabase.storage.from('shop-images').getPublicUrl(filePath);
    if (isEdit) {
      setEditShop((prev: any) => ({ ...prev, image: urlData.publicUrl }));
    } else {
      setNewShop(prev => ({ ...prev, image: urlData.publicUrl }));
    }
    setUploadingShopImg(false);
    toast.success(t('ছবি আপলোড হয়েছে', 'Image uploaded'));
  };

  const startEdit = (type: string, item: any) => {
    setEditingId(item.id);
    if (type === 'pkg') setEditPkg({ ...item });
    if (type === 'notice') setEditNotice({ ...item });
    if (type === 'shop') setEditShop({ ...item });
    if (type === 'svc') setEditSvc({ ...item });
  };

  const saveEdit = async (type: string) => {
    if (type === 'pkg') { await updatePackage(editingId!, editPkg); toast.success(t('আপডেট হয়েছে', 'Updated')); }
    if (type === 'notice') { await updateNotice(editingId!, editNotice); toast.success(t('আপডেট হয়েছে', 'Updated')); }
    if (type === 'shop') { await updateShopItem(editingId!, editShop); toast.success(t('আপডেট হয়েছে', 'Updated')); }
    if (type === 'svc') { await updateSocialService(editingId!, editSvc); toast.success(t('আপডেট হয়েছে', 'Updated')); }
    setEditingId(null);
  };

  const confirmDelete = (name: string, fn: () => void) => {
    if (window.confirm(t(`"${name}" মুছে ফেলতে চান?`, `Delete "${name}"?`))) {
      fn();
      toast.success(t('মুছে ফেলা হয়েছে', 'Deleted'));
    }
  };

  const toggleStock = async (id: string, current: boolean) => {
    await updateShopItem(id, { inStock: !current });
    toast.success(!current ? t('লিস্টেড', 'Listed') : t('আনলিস্টেড', 'Unlisted'));
  };

  const toggleImportant = async (id: string, current: boolean) => {
    await updateNotice(id, { important: !current });
  };

  const handleSaveSetting = async (key: string) => {
    const edit = settingsEdits[key];
    if (!edit) return;
    await updateSiteSetting(key, edit.valueBn, edit.valueEn);
    toast.success(t('সেটিং আপডেট হয়েছে', 'Setting updated'));
  };

  const settingLabels: Record<string, { bn: string; en: string }> = {
    breaking_news: { bn: '🔴 ব্রেকিং নিউজ', en: '🔴 Breaking News' },
    contact_telegram: { bn: 'টেলিগ্রাম', en: 'Telegram' },
    contact_website: { bn: 'ওয়েবসাইট', en: 'Website' },
    contact_facebook: { bn: 'ফেসবুক', en: 'Facebook' },
    contact_instagram: { bn: 'ইনস্টাগ্রাম', en: 'Instagram' },
    contact_email: { bn: 'ইমেইল', en: 'Email' },
    contact_phone: { bn: 'মোবাইল', en: 'Mobile' },
    contact_hours_bn: { bn: 'যোগাযোগের সময়', en: 'Contact Hours' },
    hero_subtitle_bn: { bn: 'হিরো সাবটাইটেল', en: 'Hero Subtitle' },
    hero_title_line1_bn: { bn: 'হিরো টাইটেল লাইন ১', en: 'Hero Title Line 1' },
    hero_title_line2_bn: { bn: 'হিরো টাইটেল লাইন ২', en: 'Hero Title Line 2' },
    hero_description_bn: { bn: 'হিরো বিবরণ', en: 'Hero Description' },
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-4">🛡️ {t('এডমিন প্যানেল', 'Admin Panel')}</h1>

        {/* Tabs */}
        <div className="flex gap-1.5 mb-5 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0">
          {tabs.map(tb => (
            <button key={tb.key} onClick={() => { setTab(tb.key); setEditingId(null); setExpandedAdd(false); if (tb.key === 'users') refreshProfiles(); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all shrink-0 ${tab === tb.key ? 'gradient-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/80'}`}>
              <tb.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {t(tb.labelBn, tb.labelEn)}
            </button>
          ))}
        </div>

        {/* ============ PACKAGES ============ */}
        {tab === 'packages' && (
          <div className="space-y-3">
            <button onClick={() => setExpandedAdd(!expandedAdd)} className="w-full card-3d p-3 flex items-center justify-between text-sm font-medium text-foreground">
              <span className="flex items-center gap-2"><Plus className="w-4 h-4 text-primary" /> {t('নতুন প্যাকেজ যোগ', 'Add New Package')}</span>
              {expandedAdd ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {expandedAdd && (
              <div className="card-3d p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input placeholder="Name (EN)" value={newPkg.nameEn} onChange={e => setNewPkg({ ...newPkg, nameEn: e.target.value })} className={inputCls} />
                  <input placeholder="নাম (বাংলা)" value={newPkg.nameBn} onChange={e => setNewPkg({ ...newPkg, nameBn: e.target.value })} className={inputCls} />
                  <input placeholder="Description (EN)" value={newPkg.descriptionEn} onChange={e => setNewPkg({ ...newPkg, descriptionEn: e.target.value })} className={inputCls} />
                  <input placeholder="বিবরণ (বাংলা)" value={newPkg.descriptionBn} onChange={e => setNewPkg({ ...newPkg, descriptionBn: e.target.value })} className={inputCls} />
                  <input type="number" placeholder="Price (৳)" value={newPkg.price || ''} onChange={e => setNewPkg({ ...newPkg, price: Number(e.target.value) })} className={inputCls} />
                  <button onClick={handleAddPkg} className={btnPrimary}><Plus className="w-4 h-4" /> {t('যোগ করুন', 'Add')}</button>
                </div>
              </div>
            )}

            {packages.map(pkg => (
              <div key={pkg.id} className="card-3d p-3 sm:p-4">
                {editingId === pkg.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input value={editPkg.nameEn} onChange={e => setEditPkg({ ...editPkg, nameEn: e.target.value })} className={inputCls} placeholder="Name (EN)" />
                      <input value={editPkg.nameBn} onChange={e => setEditPkg({ ...editPkg, nameBn: e.target.value })} className={inputCls} placeholder="নাম (বাংলা)" />
                      <input value={editPkg.descriptionEn} onChange={e => setEditPkg({ ...editPkg, descriptionEn: e.target.value })} className={inputCls} placeholder="Description (EN)" />
                      <input value={editPkg.descriptionBn} onChange={e => setEditPkg({ ...editPkg, descriptionBn: e.target.value })} className={inputCls} placeholder="বিবরণ (বাংলা)" />
                      <input type="number" value={editPkg.price} onChange={e => setEditPkg({ ...editPkg, price: Number(e.target.value) })} className={inputCls} />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit('pkg')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs"><Save className="w-3.5 h-3.5" /> {t('সেভ', 'Save')}</button>
                      <button onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded-lg bg-muted text-foreground text-xs">{t('বাতিল', 'Cancel')}</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-foreground text-sm truncate">{language === 'bn' ? pkg.nameBn : pkg.nameEn}</h4>
                      <p className="text-xs text-muted-foreground">৳{pkg.price}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => startEdit('pkg', pkg)} className={btnEdit} title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => confirmDelete(pkg.nameEn, () => deletePackage(pkg.id))} className={btnDanger} title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ============ SHOP ITEMS ============ */}
        {tab === 'shop' && (
          <div className="space-y-3">
            <button onClick={() => setExpandedAdd(!expandedAdd)} className="w-full card-3d p-3 flex items-center justify-between text-sm font-medium text-foreground">
              <span className="flex items-center gap-2"><Plus className="w-4 h-4 text-primary" /> {t('নতুন আইটেম যোগ', 'Add New Item')}</span>
              {expandedAdd ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {expandedAdd && (
              <div className="card-3d p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input placeholder="Name (EN)" value={newShop.nameEn} onChange={e => setNewShop({ ...newShop, nameEn: e.target.value })} className={inputCls} />
                  <input placeholder="নাম (বাংলা)" value={newShop.nameBn} onChange={e => setNewShop({ ...newShop, nameBn: e.target.value })} className={inputCls} />
                  <input placeholder="Description (EN)" value={newShop.descriptionEn} onChange={e => setNewShop({ ...newShop, descriptionEn: e.target.value })} className={inputCls} />
                  <input placeholder="বিবরণ (বাংলা)" value={newShop.descriptionBn} onChange={e => setNewShop({ ...newShop, descriptionBn: e.target.value })} className={inputCls} />
                  <input type="number" placeholder="Price (৳)" value={newShop.price || ''} onChange={e => setNewShop({ ...newShop, price: Number(e.target.value) })} className={inputCls} />
                  <select value={newShop.category} onChange={e => setNewShop({ ...newShop, category: e.target.value })} className={inputCls}>
                    <option value="service">Service</option><option value="design">Design</option><option value="development">Development</option><option value="digital">Digital</option><option value="other">Other</option>
                  </select>
                  <div className="col-span-1 sm:col-span-2">
                    <div className="border-2 border-dashed border-border rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:border-primary transition-colors" onClick={() => shopImgRef.current?.click()}>
                      {newShop.image ? (
                        <img src={newShop.image} alt="Preview" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0"><Image className="w-5 h-5 text-muted-foreground" /></div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-foreground truncate">{t('ছবি আপলোড করুন', 'Upload Image')}</p>
                        <p className="text-[10px] text-muted-foreground">{t('সর্বোচ্চ ৫MB', 'Max 5MB')}</p>
                      </div>
                      {uploadingShopImg && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary shrink-0" />}
                    </div>
                    <input ref={shopImgRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleShopImageUpload(e.target.files[0])} />
                  </div>
                  <button onClick={handleAddShop} className={`${btnPrimary} col-span-1 sm:col-span-2`}><Plus className="w-4 h-4" /> {t('যোগ করুন', 'Add')}</button>
                </div>
              </div>
            )}

            {shopItems.map(item => (
              <div key={item.id} className="card-3d p-3 sm:p-4">
                {editingId === item.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input value={editShop.nameEn} onChange={e => setEditShop({ ...editShop, nameEn: e.target.value })} className={inputCls} placeholder="Name (EN)" />
                      <input value={editShop.nameBn} onChange={e => setEditShop({ ...editShop, nameBn: e.target.value })} className={inputCls} placeholder="নাম (বাংলা)" />
                      <input value={editShop.descriptionEn} onChange={e => setEditShop({ ...editShop, descriptionEn: e.target.value })} className={inputCls} placeholder="Description (EN)" />
                      <input value={editShop.descriptionBn} onChange={e => setEditShop({ ...editShop, descriptionBn: e.target.value })} className={inputCls} placeholder="বিবরণ (বাংলা)" />
                      <input type="number" value={editShop.price} onChange={e => setEditShop({ ...editShop, price: Number(e.target.value) })} className={inputCls} />
                      <select value={editShop.category} onChange={e => setEditShop({ ...editShop, category: e.target.value })} className={inputCls}>
                        <option value="service">Service</option><option value="design">Design</option><option value="development">Development</option><option value="digital">Digital</option><option value="other">Other</option>
                      </select>
                      <div className="col-span-1 sm:col-span-2">
                        <div className="border-2 border-dashed border-border rounded-lg p-2 flex items-center gap-2 cursor-pointer hover:border-primary" onClick={() => editShopImgRef.current?.click()}>
                          {editShop.image ? <img src={editShop.image} alt="" className="w-10 h-10 rounded object-cover shrink-0" /> : <Image className="w-5 h-5 text-muted-foreground shrink-0" />}
                          <span className="text-xs text-muted-foreground truncate">{t('ছবি পরিবর্তন', 'Change image')}</span>
                        </div>
                        <input ref={editShopImgRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleShopImageUpload(e.target.files[0], true)} />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit('shop')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs"><Save className="w-3.5 h-3.5" /> {t('সেভ', 'Save')}</button>
                      <button onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded-lg bg-muted text-foreground text-xs">{t('বাতিল', 'Cancel')}</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {item.image ? (
                        <img src={item.image} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0"><ShoppingBag className="w-4 h-4 text-muted-foreground/40" /></div>
                      )}
                      <div className="min-w-0">
                        <h4 className="font-semibold text-foreground text-sm truncate">{language === 'bn' ? item.nameBn : item.nameEn}</h4>
                        <p className="text-xs text-muted-foreground truncate">৳{item.price} • {item.category} {!item.inStock && <span className="text-destructive">({t('আনলিস্টেড', 'Unlisted')})</span>}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => toggleStock(item.id, item.inStock)} className={`p-2 rounded-lg transition-colors ${item.inStock ? 'text-primary hover:bg-primary/10' : 'text-muted-foreground hover:bg-muted'}`} title={item.inStock ? 'Unlist' : 'List'}>
                        {item.inStock ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => startEdit('shop', item)} className={btnEdit} title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => confirmDelete(item.nameEn, () => deleteShopItem(item.id))} className={btnDanger} title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ============ SOCIAL SERVICES ============ */}
        {tab === 'social' && (
          <div className="space-y-3">
            <button onClick={() => setExpandedAdd(!expandedAdd)} className="w-full card-3d p-3 flex items-center justify-between text-sm font-medium text-foreground">
              <span className="flex items-center gap-2"><Plus className="w-4 h-4 text-primary" /> {t('নতুন সোশ্যাল সার্ভিস', 'Add Social Service')}</span>
              {expandedAdd ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {expandedAdd && (
              <div className="card-3d p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input placeholder="Name (EN)" value={newSvc.nameEn} onChange={e => setNewSvc({ ...newSvc, nameEn: e.target.value })} className={inputCls} />
                  <input placeholder="নাম (বাংলা)" value={newSvc.nameBn} onChange={e => setNewSvc({ ...newSvc, nameBn: e.target.value })} className={inputCls} />
                  <select value={newSvc.platform} onChange={e => setNewSvc({ ...newSvc, platform: e.target.value })} className={inputCls}>
                    <option value="facebook">Facebook</option><option value="youtube">YouTube</option><option value="instagram">Instagram</option><option value="tiktok">TikTok</option><option value="telegram">Telegram</option>
                  </select>
                  <input placeholder="Service Type" value={newSvc.serviceType} onChange={e => setNewSvc({ ...newSvc, serviceType: e.target.value })} className={inputCls} />
                  <input placeholder="Description (EN)" value={newSvc.descriptionEn} onChange={e => setNewSvc({ ...newSvc, descriptionEn: e.target.value })} className={inputCls} />
                  <input placeholder="বিবরণ (বাংলা)" value={newSvc.descriptionBn} onChange={e => setNewSvc({ ...newSvc, descriptionBn: e.target.value })} className={inputCls} />
                  <input type="number" placeholder="Price per unit" value={newSvc.price || ''} onChange={e => setNewSvc({ ...newSvc, price: Number(e.target.value) })} className={inputCls} />
                  <input placeholder="Unit" value={newSvc.unit} onChange={e => setNewSvc({ ...newSvc, unit: e.target.value })} className={inputCls} />
                  <input type="number" placeholder="Min Qty" value={newSvc.minQuantity || ''} onChange={e => setNewSvc({ ...newSvc, minQuantity: Number(e.target.value) })} className={inputCls} />
                  <input type="number" placeholder="Max Qty" value={newSvc.maxQuantity || ''} onChange={e => setNewSvc({ ...newSvc, maxQuantity: Number(e.target.value) })} className={inputCls} />
                  <button onClick={handleAddSvc} className={`${btnPrimary} col-span-1 sm:col-span-2`}><Plus className="w-4 h-4" /> {t('যোগ করুন', 'Add')}</button>
                </div>
              </div>
            )}

            {socialServices.map(svc => (
              <div key={svc.id} className="card-3d p-3 sm:p-4">
                {editingId === svc.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input value={editSvc.nameEn} onChange={e => setEditSvc({ ...editSvc, nameEn: e.target.value })} className={inputCls} />
                      <input value={editSvc.nameBn} onChange={e => setEditSvc({ ...editSvc, nameBn: e.target.value })} className={inputCls} />
                      <select value={editSvc.platform} onChange={e => setEditSvc({ ...editSvc, platform: e.target.value })} className={inputCls}>
                        <option value="facebook">Facebook</option><option value="youtube">YouTube</option><option value="instagram">Instagram</option><option value="tiktok">TikTok</option><option value="telegram">Telegram</option>
                      </select>
                      <input value={editSvc.serviceType} onChange={e => setEditSvc({ ...editSvc, serviceType: e.target.value })} className={inputCls} />
                      <input type="number" value={editSvc.price} onChange={e => setEditSvc({ ...editSvc, price: Number(e.target.value) })} className={inputCls} />
                      <input value={editSvc.unit} onChange={e => setEditSvc({ ...editSvc, unit: e.target.value })} className={inputCls} />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit('svc')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs"><Save className="w-3.5 h-3.5" /> {t('সেভ', 'Save')}</button>
                      <button onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded-lg bg-muted text-foreground text-xs">{t('বাতিল', 'Cancel')}</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-foreground text-sm truncate">{language === 'bn' ? svc.nameBn : svc.nameEn}</h4>
                      <p className="text-xs text-muted-foreground truncate">{svc.platform} • ৳{svc.price}/{svc.unit}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => startEdit('svc', svc)} className={btnEdit}><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => confirmDelete(svc.nameEn, () => deleteSocialService(svc.id))} className={btnDanger}><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ============ NOTICES ============ */}
        {tab === 'notices' && (
          <div className="space-y-3">
            <button onClick={() => setExpandedAdd(!expandedAdd)} className="w-full card-3d p-3 flex items-center justify-between text-sm font-medium text-foreground">
              <span className="flex items-center gap-2"><Plus className="w-4 h-4 text-primary" /> {t('নতুন নোটিশ যোগ', 'Add New Notice')}</span>
              {expandedAdd ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {expandedAdd && (
              <div className="card-3d p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input placeholder="Title (EN)" value={newNotice.titleEn} onChange={e => setNewNotice({ ...newNotice, titleEn: e.target.value })} className={inputCls} />
                  <input placeholder="শিরোনাম (বাংলা)" value={newNotice.titleBn} onChange={e => setNewNotice({ ...newNotice, titleBn: e.target.value })} className={inputCls} />
                  <textarea placeholder="Content (EN)" value={newNotice.contentEn} onChange={e => setNewNotice({ ...newNotice, contentEn: e.target.value })} className={inputCls} rows={2} />
                  <textarea placeholder="বিষয়বস্তু (বাংলা)" value={newNotice.contentBn} onChange={e => setNewNotice({ ...newNotice, contentBn: e.target.value })} className={inputCls} rows={2} />
                </div>
                <button onClick={handleAddNotice} className={`${btnPrimary} w-full mt-3`}><Plus className="w-4 h-4" /> {t('যোগ করুন', 'Add')}</button>
              </div>
            )}

            {notices.map(n => (
              <div key={n.id} className={`card-3d p-3 sm:p-4 ${n.important ? 'border-l-4 border-l-accent' : ''}`}>
                {editingId === n.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input value={editNotice.titleEn} onChange={e => setEditNotice({ ...editNotice, titleEn: e.target.value })} className={inputCls} />
                      <input value={editNotice.titleBn} onChange={e => setEditNotice({ ...editNotice, titleBn: e.target.value })} className={inputCls} />
                      <textarea value={editNotice.contentEn} onChange={e => setEditNotice({ ...editNotice, contentEn: e.target.value })} className={inputCls} rows={2} />
                      <textarea value={editNotice.contentBn} onChange={e => setEditNotice({ ...editNotice, contentBn: e.target.value })} className={inputCls} rows={2} />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit('notice')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs"><Save className="w-3.5 h-3.5" /> {t('সেভ', 'Save')}</button>
                      <button onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded-lg bg-muted text-foreground text-xs">{t('বাতিল', 'Cancel')}</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-foreground text-sm truncate">{language === 'bn' ? n.titleBn : n.titleEn}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 break-words">{language === 'bn' ? n.contentBn : n.contentEn}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => toggleImportant(n.id, n.important || false)} className={`p-2 rounded-lg transition-colors ${n.important ? 'text-accent hover:bg-accent/10' : 'text-muted-foreground hover:bg-muted'}`} title="Toggle Important">
                        <Bell className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => startEdit('notice', n)} className={btnEdit}><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => confirmDelete(n.titleEn, () => deleteNotice(n.id))} className={btnDanger}><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ============ TRANSACTIONS ============ */}
        {tab === 'transactions' && (
          <div className="space-y-3">
            {transactions.length === 0 && <p className="text-center text-muted-foreground py-10">{t('কোনো ট্রানজেকশন নেই', 'No transactions')}</p>}
            {transactions.map(tx => (
              <div key={tx.id} className={`card-3d p-3 sm:p-4 ${tx.status === 'pending' ? 'border-l-4 border-l-warning' : tx.status === 'approved' ? 'border-l-4 border-l-secondary' : 'border-l-4 border-l-destructive'}`}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div className="min-w-0">
                    <h4 className="font-semibold text-foreground text-sm truncate">{tx.packageName}</h4>
                    <p className="text-xs text-muted-foreground truncate">{tx.userName} • ৳{tx.amount}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{tx.method} • TxID: {tx.transactionId}</p>
                    <p className="text-[10px] text-muted-foreground">{tx.mobile}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full mt-1 inline-block ${tx.status === 'pending' ? 'bg-warning/20 text-warning' : tx.status === 'approved' ? 'bg-secondary/20 text-secondary' : 'bg-destructive/20 text-destructive'}`}>
                      {tx.status === 'pending' ? t('অপেক্ষমান', 'Pending') : tx.status === 'approved' ? t('অনুমোদিত', 'Approved') : t('প্রত্যাখ্যাত', 'Rejected')}
                    </span>
                  </div>
                  {tx.status === 'pending' && (
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => updateTransactionStatus(tx.id, 'approved')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary/10 text-secondary text-xs hover:bg-secondary/20"><Check className="w-3.5 h-3.5" /> {t('অনুমোদন', 'Approve')}</button>
                      <button onClick={() => updateTransactionStatus(tx.id, 'rejected')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs hover:bg-destructive/20"><X className="w-3.5 h-3.5" /> {t('বাতিল', 'Reject')}</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ============ USERS ============ */}
        {tab === 'users' && (
          <div className="space-y-3">
            {allProfiles.length === 0 && <p className="text-center text-muted-foreground py-10">{t('কোনো ইউজার নেই', 'No users')}</p>}
            {allProfiles.map(u => (
              <div key={u.id} className="card-3d p-3 sm:p-4">
                <h4 className="font-semibold text-foreground text-sm truncate">{u.fullName || u.username}</h4>
                <p className="text-xs text-muted-foreground truncate">@{u.username} • {u.email}</p>
                {u.mobile && <p className="text-[10px] text-muted-foreground">{u.mobile}</p>}
              </div>
            ))}
          </div>
        )}

        {/* ============ SETTINGS ============ */}
        {tab === 'settings' && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-2">{t('হোম পেজ, যোগাযোগ ও ব্রেকিং নিউজ সেটিংস পরিবর্তন করুন', 'Edit homepage, contact & breaking news settings')}</p>
            {Object.entries(settingsEdits).map(([key, val]) => {
              const label = settingLabels[key] || { bn: key, en: key };
              return (
                <div key={key} className="card-3d p-3 sm:p-4 space-y-2">
                  <h4 className="font-semibold text-foreground text-sm">{language === 'bn' ? label.bn : label.en}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-muted-foreground mb-1 block">বাংলা</label>
                      {key.includes('description') || key === 'breaking_news' ? (
                        <textarea value={val.valueBn} onChange={e => setSettingsEdits(prev => ({ ...prev, [key]: { ...prev[key], valueBn: e.target.value } }))} className={inputCls} rows={2} />
                      ) : (
                        <input value={val.valueBn} onChange={e => setSettingsEdits(prev => ({ ...prev, [key]: { ...prev[key], valueBn: e.target.value } }))} className={inputCls} />
                      )}
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground mb-1 block">English</label>
                      {key.includes('description') || key === 'breaking_news' ? (
                        <textarea value={val.valueEn} onChange={e => setSettingsEdits(prev => ({ ...prev, [key]: { ...prev[key], valueEn: e.target.value } }))} className={inputCls} rows={2} />
                      ) : (
                        <input value={val.valueEn} onChange={e => setSettingsEdits(prev => ({ ...prev, [key]: { ...prev[key], valueEn: e.target.value } }))} className={inputCls} />
                      )}
                    </div>
                  </div>
                  <button onClick={() => handleSaveSetting(key)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs">
                    <Save className="w-3.5 h-3.5" /> {t('সেভ', 'Save')}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminPage;
