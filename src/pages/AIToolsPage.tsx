import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/Layout';
import { Sparkles, FileText, Languages, MessageSquare, Image, Lightbulb, Wand2, Search, Hash, PenTool, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AITool {
  id: string;
  nameBn: string;
  nameEn: string;
  descBn: string;
  descEn: string;
  icon: any;
  prompt: string;
  placeholder: { bn: string; en: string };
}

const aiTools: AITool[] = [
  {
    id: 'content-writer',
    nameBn: 'কনটেন্ট রাইটার',
    nameEn: 'Content Writer',
    descBn: 'ব্লগ, আর্টিকেল, পোস্ট লিখুন',
    descEn: 'Write blogs, articles, posts',
    icon: FileText,
    prompt: 'Write a well-structured content/article about the following topic. Make it engaging and SEO-friendly:',
    placeholder: { bn: 'বিষয় লিখুন...', en: 'Enter topic...' },
  },
  {
    id: 'translator',
    nameBn: 'ভাষা অনুবাদক',
    nameEn: 'Language Translator',
    descBn: 'যেকোনো ভাষায় অনুবাদ করুন',
    descEn: 'Translate to any language',
    icon: Languages,
    prompt: 'Translate the following text. If it is in Bengali, translate to English. If it is in English, translate to Bengali. Provide only the translation:',
    placeholder: { bn: 'অনুবাদ করতে টেক্সট লিখুন...', en: 'Enter text to translate...' },
  },
  {
    id: 'caption-gen',
    nameBn: 'ক্যাপশন জেনারেটর',
    nameEn: 'Caption Generator',
    descBn: 'সোশ্যাল মিডিয়া ক্যাপশন তৈরি',
    descEn: 'Generate social media captions',
    icon: MessageSquare,
    prompt: 'Generate 5 creative and engaging social media captions with relevant emojis and hashtags for the following topic:',
    placeholder: { bn: 'বিষয় বা ছবির বর্ণনা...', en: 'Describe your post topic...' },
  },
  {
    id: 'seo-meta',
    nameBn: 'SEO মেটা জেনারেটর',
    nameEn: 'SEO Meta Generator',
    descBn: 'টাইটেল, ডেসক্রিপশন, কীওয়ার্ড',
    descEn: 'Title, description, keywords',
    icon: Search,
    prompt: 'Generate SEO-optimized meta title, meta description, and 10 relevant keywords for the following website/page topic:',
    placeholder: { bn: 'ওয়েবসাইট/পেজের বিষয়...', en: 'Website/page topic...' },
  },
  {
    id: 'hashtag-ai',
    nameBn: 'AI হ্যাশট্যাগ',
    nameEn: 'AI Hashtags',
    descBn: 'ট্রেন্ডিং হ্যাশট্যাগ তৈরি',
    descEn: 'Generate trending hashtags',
    icon: Hash,
    prompt: 'Generate 30 highly relevant and trending hashtags for the following topic. Group them by reach (high, medium, niche):',
    placeholder: { bn: 'বিষয় লিখুন...', en: 'Enter topic...' },
  },
  {
    id: 'bio-gen',
    nameBn: 'বায়ো জেনারেটর',
    nameEn: 'Bio Generator',
    descBn: 'প্রোফাইল বায়ো লিখুন',
    descEn: 'Write profile bios',
    icon: PenTool,
    prompt: 'Generate 5 creative and professional social media bio options for the following person/brand. Include emojis:',
    placeholder: { bn: 'নাম এবং পেশা...', en: 'Name and profession...' },
  },
  {
    id: 'idea-gen',
    nameBn: 'আইডিয়া জেনারেটর',
    nameEn: 'Idea Generator',
    descBn: 'কনটেন্ট আইডিয়া পান',
    descEn: 'Get content ideas',
    icon: Lightbulb,
    prompt: 'Generate 10 unique and creative content ideas with brief descriptions for the following niche/topic:',
    placeholder: { bn: 'আপনার নিশ/বিষয়...', en: 'Your niche/topic...' },
  },
  {
    id: 'rewrite',
    nameBn: 'টেক্সট রিরাইটার',
    nameEn: 'Text Rewriter',
    descBn: 'টেক্সট পুনরায় লিখুন',
    descEn: 'Rewrite text uniquely',
    icon: Wand2,
    prompt: 'Rewrite the following text in a unique, engaging way while keeping the same meaning. Make it sound natural and human-written:',
    placeholder: { bn: 'রিরাইট করতে টেক্সট দিন...', en: 'Enter text to rewrite...' },
  },
];

const AIToolsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const activeToolObj = aiTools.find(t => t.id === activeTool);

  const handleGenerate = async () => {
    if (!input.trim() || !activeToolObj) return;
    setLoading(true);
    setResult('');
    try {
      const { data, error } = await supabase.functions.invoke('ai-tool', {
        body: { prompt: `${activeToolObj.prompt}\n\n${input}` },
      });
      if (error) throw error;
      setResult(data?.result || t('ফলাফল পাওয়া যায়নি', 'No result found'));
    } catch {
      toast.error(t('কিছু সমস্যা হয়েছে', 'Something went wrong'));
      setResult(t('AI সার্ভিস এখন উপলব্ধ নয়। পরে আবার চেষ্টা করুন।', 'AI service is not available right now. Please try again later.'));
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-primary" /> {t('AI টুলস', 'AI Tools')}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">{t('ফ্রি AI দিয়ে কনটেন্ট তৈরি করুন', 'Create content with free AI')}</p>
        </div>

        {activeToolObj ? (
          <div className="max-w-2xl mx-auto">
            <button onClick={() => { setActiveTool(null); setInput(''); setResult(''); }} className="text-sm text-primary hover:underline mb-4 inline-flex items-center gap-1">
              ← {t('সকল টুলস', 'All Tools')}
            </button>
            <div className="card-3d p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                  <activeToolObj.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-bold text-foreground truncate">{language === 'bn' ? activeToolObj.nameBn : activeToolObj.nameEn}</h2>
                  <p className="text-xs text-muted-foreground">{language === 'bn' ? activeToolObj.descBn : activeToolObj.descEn}</p>
                </div>
              </div>

              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={language === 'bn' ? activeToolObj.placeholder.bn : activeToolObj.placeholder.en}
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
                rows={4}
              />

              <button
                onClick={handleGenerate}
                disabled={loading || !input.trim()}
                className="btn-3d gradient-primary text-primary-foreground px-6 py-2.5 text-sm mt-3 w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> {t('তৈরি হচ্ছে...', 'Generating...')}</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> {t('তৈরি করুন', 'Generate')}</>
                )}
              </button>

              {result && (
                <div className="mt-4 p-4 rounded-lg bg-muted border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-foreground">{t('ফলাফল', 'Result')}</span>
                    <button onClick={() => navigator.clipboard.writeText(result).then(() => toast.success(t('কপি হয়েছে', 'Copied')))}
                      className="text-xs text-primary hover:underline">{t('কপি', 'Copy')}</button>
                  </div>
                  <div className="text-sm text-foreground whitespace-pre-wrap break-words leading-relaxed">{result}</div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {aiTools.map(tool => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className="card-3d p-4 sm:p-5 text-left hover:border-primary/50 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <tool.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-foreground text-xs sm:text-sm leading-tight">{language === 'bn' ? tool.nameBn : tool.nameEn}</h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 line-clamp-2">{language === 'bn' ? tool.descBn : tool.descEn}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AIToolsPage;
