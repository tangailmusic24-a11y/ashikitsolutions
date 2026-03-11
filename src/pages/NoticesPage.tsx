import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import Layout from '@/components/Layout';

const NoticesPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { notices } = useData();

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">📢 {t('নোটিশ বোর্ড', 'Notice Board')}</h1>
        <div className="space-y-4">
          {notices.map(notice => (
            <div key={notice.id} className={`card-3d p-5 ${notice.important ? 'border-l-4 border-l-accent' : ''}`}>
              <h3 className="font-bold text-foreground text-lg">
                {language === 'bn' ? notice.titleBn : notice.titleEn}
              </h3>
              <p className="text-muted-foreground mt-2">
                {language === 'bn' ? notice.contentBn : notice.contentEn}
              </p>
              <span className="text-xs text-muted-foreground mt-3 block">
                {new Date(notice.date).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          ))}
          {notices.length === 0 && (
            <p className="text-center text-muted-foreground py-10">{t('কোনো নোটিশ নেই', 'No notices yet')}</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default NoticesPage;
