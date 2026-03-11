import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { User, Mail, Phone, MapPin, CreditCard, Camera } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { t } = useLanguage();
  const { user, updateProfile } = useAuth();

  if (!user) return <Navigate to="/login" />;

  const handleChange = (field: string, value: string) => {
    updateProfile({ [field]: value });
  };

  const fields = [
    { key: 'fullName', icon: User, labelBn: 'পুরো নাম', labelEn: 'Full Name', editable: true },
    { key: 'username', icon: User, labelBn: 'ইউজারনেম', labelEn: 'Username', editable: false },
    { key: 'email', icon: Mail, labelBn: 'ইমেইল', labelEn: 'Email', editable: false },
    { key: 'mobile', icon: Phone, labelBn: 'মোবাইল', labelEn: 'Mobile', editable: true },
    { key: 'address', icon: MapPin, labelBn: 'ঠিকানা', labelEn: 'Address', editable: true },
    { key: 'nidNumber', icon: CreditCard, labelBn: 'এনআইডি নম্বর', labelEn: 'NID Number', editable: true },
  ];

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Cover & Profile */}
        <div className="card-3d overflow-hidden mb-6">
          <div className="h-32 gradient-hero relative">
            <div className="absolute -bottom-10 left-6">
              <div className="w-20 h-20 rounded-full bg-primary border-4 border-card flex items-center justify-center text-primary-foreground text-2xl font-bold">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
          <div className="pt-14 pb-4 px-6">
            <h2 className="text-lg font-bold text-foreground">{user.fullName}</h2>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          </div>
        </div>

        {/* Fields */}
        <div className="card-3d p-6">
          <h3 className="font-bold text-foreground mb-4">{t('প্রোফাইল তথ্য', 'Profile Information')}</h3>
          <div className="space-y-4">
            {fields.map(f => (
              <div key={f.key}>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1">
                  <f.icon className="w-4 h-4 text-primary" />
                  {t(f.labelBn, f.labelEn)}
                  {!f.editable && <span className="text-xs text-muted-foreground">({t('পরিবর্তনযোগ্য নয়', 'Not editable')})</span>}
                </label>
                <input
                  type="text"
                  value={(user as any)[f.key] || ''}
                  onChange={e => f.editable && handleChange(f.key, e.target.value)}
                  readOnly={!f.editable}
                  className={`w-full px-4 py-2.5 rounded-lg border border-border text-sm text-foreground ${
                    f.editable ? 'bg-muted focus:ring-2 focus:ring-primary outline-none' : 'bg-muted/50 cursor-not-allowed'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
