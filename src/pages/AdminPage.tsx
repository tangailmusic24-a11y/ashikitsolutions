import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useData, Package, Notice } from '@/contexts/DataContext';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Package as PkgIcon, Bell, Users, CreditCard, Plus, Trash2, Edit, Check, X } from 'lucide-react';

const AdminPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, isAdmin } = useAuth();
  const { packages, notices, transactions, addPackage, updatePackage, deletePackage, addNotice, updateNotice, deleteNotice, updateTransactionStatus } = useData();
  const [tab, setTab] = useState<'packages' | 'notices' | 'transactions' | 'users'>('packages');

  if (!user || !isAdmin) return <Navigate to="/login" />;

  const tabs = [
    { key: 'packages' as const, icon: PkgIcon, labelBn: 'প্যাকেজ', labelEn: 'Packages' },
    { key: 'notices' as const, icon: Bell, labelBn: 'নোটিশ', labelEn: 'Notices' },
    { key: 'transactions' as const, icon: CreditCard, labelBn: 'পেমেন্ট', labelEn: 'Payments' },
    { key: 'users' as const, icon: Users, labelBn: 'ইউজার', labelEn: 'Users' },
  ];

  // Simple forms inline
  const [newPkg, setNewPkg] = useState({ nameBn: '', nameEn: '', descriptionBn: '', descriptionEn: '', price: 0 });
  const [newNotice, setNewNotice] = useState({ titleBn: '', titleEn: '', contentBn: '', contentEn: '' });

  const handleAddPkg = () => {
    if (!newPkg.nameEn) return;
    addPackage({ ...newPkg, features: [], featuresBn: [] });
    setNewPkg({ nameBn: '', nameEn: '', descriptionBn: '', descriptionEn: '', price: 0 });
  };

  const handleAddNotice = () => {
    if (!newNotice.titleEn) return;
    addNotice({ ...newNotice, date: new Date().toISOString(), important: false });
    setNewNotice({ titleBn: '', titleEn: '', contentBn: '', contentEn: '' });
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">🛡️ {t('এডমিন প্যানেল', 'Admin Panel')}</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tb => (
            <button
              key={tb.key}
              onClick={() => setTab(tb.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                tab === tb.key ? 'gradient-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              <tb.icon className="w-4 h-4" />
              {t(tb.labelBn, tb.labelEn)}
            </button>
          ))}
        </div>

        {/* Packages Tab */}
        {tab === 'packages' && (
          <div className="space-y-4">
            <div className="card-3d p-4">
              <h3 className="font-bold text-foreground mb-3">{t('নতুন প্যাকেজ যোগ করুন', 'Add New Package')}</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <input placeholder="Name (EN)" value={newPkg.nameEn} onChange={e => setNewPkg({ ...newPkg, nameEn: e.target.value })} className="px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" />
                <input placeholder="নাম (বাংলা)" value={newPkg.nameBn} onChange={e => setNewPkg({ ...newPkg, nameBn: e.target.value })} className="px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" />
                <input placeholder="Description (EN)" value={newPkg.descriptionEn} onChange={e => setNewPkg({ ...newPkg, descriptionEn: e.target.value })} className="px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" />
                <input placeholder="বিবরণ (বাংলা)" value={newPkg.descriptionBn} onChange={e => setNewPkg({ ...newPkg, descriptionBn: e.target.value })} className="px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" />
                <input type="number" placeholder={t('মূল্য', 'Price')} value={newPkg.price || ''} onChange={e => setNewPkg({ ...newPkg, price: Number(e.target.value) })} className="px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" />
                <button onClick={handleAddPkg} className="btn-3d gradient-primary text-primary-foreground py-2 text-sm flex items-center justify-center gap-1">
                  <Plus className="w-4 h-4" /> {t('যোগ করুন', 'Add')}
                </button>
              </div>
            </div>
            {packages.map(pkg => (
              <div key={pkg.id} className="card-3d p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-foreground">{language === 'bn' ? pkg.nameBn : pkg.nameEn}</h4>
                  <p className="text-sm text-muted-foreground">৳{pkg.price}</p>
                </div>
                <button onClick={() => deletePackage(pkg.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Notices Tab */}
        {tab === 'notices' && (
          <div className="space-y-4">
            <div className="card-3d p-4">
              <h3 className="font-bold text-foreground mb-3">{t('নতুন নোটিশ', 'New Notice')}</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <input placeholder="Title (EN)" value={newNotice.titleEn} onChange={e => setNewNotice({ ...newNotice, titleEn: e.target.value })} className="px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" />
                <input placeholder="শিরোনাম (বাংলা)" value={newNotice.titleBn} onChange={e => setNewNotice({ ...newNotice, titleBn: e.target.value })} className="px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" />
                <textarea placeholder="Content (EN)" value={newNotice.contentEn} onChange={e => setNewNotice({ ...newNotice, contentEn: e.target.value })} className="px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" rows={2} />
                <textarea placeholder="বিষয়বস্তু (বাংলা)" value={newNotice.contentBn} onChange={e => setNewNotice({ ...newNotice, contentBn: e.target.value })} className="px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" rows={2} />
              </div>
              <button onClick={handleAddNotice} className="btn-3d gradient-primary text-primary-foreground py-2 px-6 text-sm mt-3 flex items-center gap-1">
                <Plus className="w-4 h-4" /> {t('যোগ করুন', 'Add')}
              </button>
            </div>
            {notices.map(n => (
              <div key={n.id} className="card-3d p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-foreground">{language === 'bn' ? n.titleBn : n.titleEn}</h4>
                  <p className="text-sm text-muted-foreground truncate max-w-md">{language === 'bn' ? n.contentBn : n.contentEn}</p>
                </div>
                <button onClick={() => deleteNotice(n.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Transactions Tab */}
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
                    <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                      tx.status === 'pending' ? 'bg-warning/20 text-warning' :
                      tx.status === 'approved' ? 'bg-secondary/20 text-secondary' : 'bg-destructive/20 text-destructive'
                    }`}>
                      {tx.status === 'pending' ? t('অপেক্ষমান', 'Pending') : tx.status === 'approved' ? t('অনুমোদিত', 'Approved') : t('প্রত্যাখ্যাত', 'Rejected')}
                    </span>
                  </div>
                  {tx.status === 'pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => updateTransactionStatus(tx.id, 'approved')} className="p-2 text-secondary hover:bg-secondary/10 rounded-lg">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => updateTransactionStatus(tx.id, 'rejected')} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <div className="space-y-3">
            {(() => {
              try {
                const users = JSON.parse(localStorage.getItem('ashik-users') || '[]');
                return users.filter((u: any) => !u.user.isAdmin).map((u: any) => (
                  <div key={u.user.id} className="card-3d p-4">
                    <h4 className="font-semibold text-foreground">{u.user.fullName}</h4>
                    <p className="text-sm text-muted-foreground">@{u.user.username} • {u.user.email}</p>
                    {u.user.mobile && <p className="text-xs text-muted-foreground">{u.user.mobile}</p>}
                  </div>
                ));
              } catch { return <p className="text-muted-foreground">{t('কোনো ইউজার নেই', 'No users')}</p>; }
            })()}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminPage;
