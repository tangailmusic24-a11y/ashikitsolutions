import React, { useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { User, Mail, Phone, MapPin, CreditCard, Camera, Upload, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSignedUrl } from '@/hooks/useSignedUrl';

const ProfilePage: React.FC = () => {
  const { t } = useLanguage();
  const { user, updateProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  const profilePicRef = useRef<HTMLInputElement>(null);
  const coverPicRef = useRef<HTMLInputElement>(null);
  const nidFrontRef = useRef<HTMLInputElement>(null);
  const nidBackRef = useRef<HTMLInputElement>(null);

  if (!user) return <Navigate to="/login" />;

  const handleChange = async (field: string, value: string) => {
    setSaving(true);
    await updateProfile({ [field]: value });
    setSaving(false);
  };

  const uploadImage = async (file: File, folder: string, field: string) => {
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('ফাইল সাইজ ৫MB এর বেশি হতে পারবে না', 'File size must be under 5MB'));
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error(t('শুধুমাত্র ছবি আপলোড করা যাবে', 'Only image files are allowed'));
      return;
    }

    setUploading(field);
    const ext = file.name.split('.').pop();
    const filePath = `${user.id}/${folder}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from('user-uploads').upload(filePath, file, { upsert: true });
    if (error) {
      toast.error(t('আপলোড ব্যর্থ হয়েছে', 'Upload failed'));
      setUploading(null);
      return;
    }

    // Store the storage path only (not a signed URL) for security
    await updateProfile({ [field]: filePath } as any);
    toast.success(t('আপলোড সফল হয়েছে', 'Upload successful'));
    setUploading(null);
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
        {/* Cover & Profile Picture */}
        <div className="card-3d overflow-hidden mb-6">
          {/* Cover Picture */}
          <div className="h-36 relative group cursor-pointer" onClick={() => coverPicRef.current?.click()}>
            {user.coverPicture ? (
              <img src={user.coverPicture} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full gradient-hero" />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="text-white text-center">
                <Camera className="w-6 h-6 mx-auto mb-1" />
                <span className="text-xs">{t('কভার পরিবর্তন করুন', 'Change Cover')}</span>
              </div>
            </div>
            {uploading === 'coverPicture' && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
              </div>
            )}
            <input ref={coverPicRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0], 'cover', 'coverPicture')} />
          </div>

          {/* Profile Picture */}
          <div className="relative px-6">
            <div className="absolute -top-12 left-6">
              <div className="relative group cursor-pointer" onClick={() => profilePicRef.current?.click()}>
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-card" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary border-4 border-card flex items-center justify-center text-primary-foreground text-3xl font-bold">
                    {(user.fullName || user.username).charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                {uploading === 'profilePicture' && (
                  <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                  </div>
                )}
                <input ref={profilePicRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0], 'profile', 'profilePicture')} />
              </div>
            </div>
          </div>

          <div className="pt-16 pb-4 px-6">
            <h2 className="text-lg font-bold text-foreground">{user.fullName || user.username}</h2>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          </div>
        </div>

        {/* Profile Fields */}
        <div className="card-3d p-6 mb-6">
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

        {/* NID Card Upload */}
        <div className="card-3d p-6">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            {t('এনআইডি কার্ড', 'NID Card')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* NID Front */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">{t('সামনের পাশ', 'Front Side')}</p>
              <div
                className="relative border-2 border-dashed border-border rounded-xl h-40 flex items-center justify-center cursor-pointer group hover:border-primary transition-colors overflow-hidden"
                onClick={() => nidFrontRef.current?.click()}
              >
                {user.nidFront ? (
                  <>
                    <img src={user.nidFront} alt="NID Front" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Upload className="w-8 h-8 mx-auto mb-2" />
                    <span className="text-xs">{t('আপলোড করুন', 'Upload')}</span>
                  </div>
                )}
                {uploading === 'nidFront' && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                  </div>
                )}
                <input ref={nidFrontRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0], 'nid', 'nidFront')} />
              </div>
            </div>

            {/* NID Back */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">{t('পেছনের পাশ', 'Back Side')}</p>
              <div
                className="relative border-2 border-dashed border-border rounded-xl h-40 flex items-center justify-center cursor-pointer group hover:border-primary transition-colors overflow-hidden"
                onClick={() => nidBackRef.current?.click()}
              >
                {user.nidBack ? (
                  <>
                    <img src={user.nidBack} alt="NID Back" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Upload className="w-8 h-8 mx-auto mb-2" />
                    <span className="text-xs">{t('আপলোড করুন', 'Upload')}</span>
                  </div>
                )}
                {uploading === 'nidBack' && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                  </div>
                )}
                <input ref={nidBackRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0], 'nid', 'nidBack')} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
