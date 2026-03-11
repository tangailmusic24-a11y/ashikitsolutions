import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/Layout';
import { Hash, Key, Link2, QrCode, Image, Type, Globe, Smartphone, FileAudio, Calendar, Layout as LayoutIcon, Gauge, Youtube, ScanLine } from 'lucide-react';

interface Tool {
  id: string;
  nameBn: string;
  nameEn: string;
  descBn: string;
  descEn: string;
  icon: any;
  component: React.FC;
}

// Simple tool implementations
const YouTubeTagGen: React.FC = () => {
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  
  const generate = () => {
    const words = input.split(/[,\s]+/).filter(Boolean);
    const generated = words.flatMap(w => [w, `#${w}`, `${w} tutorial`, `${w} 2024`, `best ${w}`]);
    setTags(generated);
  };

  return (
    <div className="space-y-4">
      <input value={input} onChange={e => setInput(e.target.value)} placeholder={t('কীওয়ার্ড লিখুন (কমা দিয়ে আলাদা করুন)', 'Enter keywords (comma separated)')} className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:ring-2 focus:ring-primary outline-none" />
      <button onClick={generate} className="btn-3d gradient-primary text-primary-foreground px-6 py-2 text-sm">{t('ট্যাগ তৈরি করুন', 'Generate Tags')}</button>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
};

const HashtagGen: React.FC = () => {
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const generate = () => {
    const words = input.split(/[,\s]+/).filter(Boolean);
    const generated = words.flatMap(w => [`#${w}`, `#${w}lovers`, `#${w}daily`, `#${w}life`, `#${w}gram`]);
    setTags(generated);
  };

  return (
    <div className="space-y-4">
      <input value={input} onChange={e => setInput(e.target.value)} placeholder={t('ক্যাটাগরি লিখুন', 'Enter category')} className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:ring-2 focus:ring-primary outline-none" />
      <button onClick={generate} className="btn-3d gradient-primary text-primary-foreground px-6 py-2 text-sm">{t('হ্যাশট্যাগ তৈরি', 'Generate Hashtags')}</button>
      {tags.length > 0 && <div className="flex flex-wrap gap-2">{tags.map((t, i) => <span key={i} className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs">{t}</span>)}</div>}
    </div>
  );
};

const PasswordGen: React.FC = () => {
  const { t } = useLanguage();
  const [length, setLength] = useState(16);
  const [password, setPassword] = useState('');

  const generate = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    setPassword(Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join(''));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-sm text-foreground">{t('দৈর্ঘ্য', 'Length')}: {length}</label>
        <input type="range" min={8} max={32} value={length} onChange={e => setLength(Number(e.target.value))} className="flex-1" />
      </div>
      <button onClick={generate} className="btn-3d gradient-primary text-primary-foreground px-6 py-2 text-sm">{t('পাসওয়ার্ড তৈরি', 'Generate')}</button>
      {password && (
        <div className="p-4 rounded-lg bg-muted border border-border">
          <code className="text-sm text-foreground break-all">{password}</code>
          <button onClick={() => navigator.clipboard.writeText(password)} className="ml-2 text-xs text-primary hover:underline">{t('কপি', 'Copy')}</button>
        </div>
      )}
    </div>
  );
};

const QRCodeGen: React.FC = () => {
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  const [qrUrl, setQrUrl] = useState('');

  const generate = () => {
    if (input) setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(input)}`);
  };

  return (
    <div className="space-y-4">
      <input value={input} onChange={e => setInput(e.target.value)} placeholder={t('টেক্সট বা লিংক দিন', 'Enter text or URL')} className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:ring-2 focus:ring-primary outline-none" />
      <button onClick={generate} className="btn-3d gradient-primary text-primary-foreground px-6 py-2 text-sm">{t('QR কোড তৈরি', 'Generate QR')}</button>
      {qrUrl && <img src={qrUrl} alt="QR Code" className="mx-auto rounded-lg" />}
    </div>
  );
};

const FancyFontGen: React.FC = () => {
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  
  const transforms = [
    (s: string) => s.split('').map(c => String.fromCodePoint((c.codePointAt(0) || 0) + (c >= 'A' && c <= 'Z' ? 0x1D5A0 - 65 : c >= 'a' && c <= 'z' ? 0x1D5BA - 97 : 0))).join(''),
    (s: string) => s.split('').map(c => String.fromCodePoint((c.codePointAt(0) || 0) + (c >= 'A' && c <= 'Z' ? 0x1D400 - 65 : c >= 'a' && c <= 'z' ? 0x1D41A - 97 : 0))).join(''),
    (s: string) => s.split('').map(c => String.fromCodePoint((c.codePointAt(0) || 0) + (c >= 'A' && c <= 'Z' ? 0x1D4D0 - 65 : c >= 'a' && c <= 'z' ? 0x1D4EA - 97 : 0))).join(''),
    (s: string) => s.split('').join(' '),
    (s: string) => `✦ ${s} ✦`,
    (s: string) => `꧁${s}꧂`,
  ];

  return (
    <div className="space-y-4">
      <input value={input} onChange={e => setInput(e.target.value)} placeholder={t('টেক্সট লিখুন', 'Enter text')} className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:ring-2 focus:ring-primary outline-none" />
      {input && (
        <div className="space-y-2">
          {transforms.map((fn, i) => {
            const result = fn(input);
            return (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted border border-border">
                <span className="text-foreground text-sm">{result}</span>
                <button onClick={() => navigator.clipboard.writeText(result)} className="text-xs text-primary hover:underline shrink-0 ml-2">{t('কপি', 'Copy')}</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const IPLookup: React.FC = () => {
  const { t } = useLanguage();
  const [info, setInfo] = useState<any>(null);

  const lookup = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      setInfo(await res.json());
    } catch { setInfo({ error: true }); }
  };

  return (
    <div className="space-y-4">
      <button onClick={lookup} className="btn-3d gradient-primary text-primary-foreground px-6 py-2 text-sm">{t('আমার IP দেখুন', 'Check My IP')}</button>
      {info && !info.error && (
        <div className="p-4 rounded-lg bg-muted border border-border space-y-1 text-sm text-foreground">
          <p><strong>IP:</strong> {info.ip}</p>
          <p><strong>{t('শহর', 'City')}:</strong> {info.city}</p>
          <p><strong>{t('দেশ', 'Country')}:</strong> {info.country_name}</p>
          <p><strong>ISP:</strong> {info.org}</p>
        </div>
      )}
    </div>
  );
};

const PlaceholderTool: React.FC<{ name: string }> = ({ name }) => {
  const { t } = useLanguage();
  return (
    <div className="text-center py-8 text-muted-foreground">
      <p>{t('এই টুলটি শীঘ্রই আসছে!', 'This tool is coming soon!')}</p>
      <p className="text-sm mt-1">{name}</p>
    </div>
  );
};

const ToolsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const tools: Tool[] = [
    { id: 'yt-tags', nameBn: 'ইউটিউব ট্যাগ জেনারেটর', nameEn: 'YouTube Tag Generator', descBn: 'SEO ট্যাগ তৈরি করুন', descEn: 'Generate SEO tags', icon: Youtube, component: YouTubeTagGen },
    { id: 'hashtag', nameBn: 'হ্যাশট্যাগ জেনারেটর', nameEn: 'Hashtag Generator', descBn: 'হ্যাশট্যাগ তৈরি', descEn: 'Generate hashtags', icon: Hash, component: HashtagGen },
    { id: 'password', nameBn: 'পাসওয়ার্ড জেনারেটর', nameEn: 'Password Generator', descBn: 'শক্তিশালী পাসওয়ার্ড', descEn: 'Strong passwords', icon: Key, component: PasswordGen },
    { id: 'qr-gen', nameBn: 'QR কোড জেনারেটর', nameEn: 'QR Code Generator', descBn: 'QR কোড তৈরি', descEn: 'Generate QR codes', icon: QrCode, component: QRCodeGen },
    { id: 'fancy-font', nameBn: 'ফ্যান্সি ফন্ট জেনারেটর', nameEn: 'Fancy Font Generator', descBn: 'স্টাইলিশ ফন্ট', descEn: 'Stylish fonts', icon: Type, component: FancyFontGen },
    { id: 'ip-lookup', nameBn: 'আইপি অ্যাড্রেস লুকআপ', nameEn: 'IP Address Lookup', descBn: 'আপনার IP দেখুন', descEn: 'Check your IP', icon: Globe, component: IPLookup },
    { id: 'qr-reader', nameBn: 'QR কোড রিডার', nameEn: 'QR Code Reader', descBn: 'QR কোড পড়ুন', descEn: 'Read QR codes', icon: ScanLine, component: () => <PlaceholderTool name="QR Reader" /> },
    { id: 'link-short', nameBn: 'লিংক শর্টনার', nameEn: 'Link Shortener', descBn: 'লিংক ছোট করুন', descEn: 'Shorten links', icon: Link2, component: () => <PlaceholderTool name="Link Shortener" /> },
    { id: 'img-compress', nameBn: 'ইমেজ কম্প্রেসার', nameEn: 'Image Compressor', descBn: 'ছবির সাইজ কমান', descEn: 'Compress images', icon: Image, component: () => <PlaceholderTool name="Image Compressor" /> },
    { id: 'device-mockup', nameBn: 'ডিভাইস মকআপ', nameEn: 'Device Mockup', descBn: 'স্ক্রিনশট মকআপ', descEn: 'Screenshot mockup', icon: Smartphone, component: () => <PlaceholderTool name="Device Mockup" /> },
    { id: 'video-audio', nameBn: 'ভিডিও টু অডিও', nameEn: 'Video to Audio', descBn: 'MP3 এ রূপান্তর', descEn: 'Convert to MP3', icon: FileAudio, component: () => <PlaceholderTool name="Video to Audio" /> },
    { id: 'post-scheduler', nameBn: 'পোস্ট শিডিউলার', nameEn: 'Post Scheduler', descBn: 'পোস্ট পরিকল্পনা', descEn: 'Plan your posts', icon: Calendar, component: () => <PlaceholderTool name="Post Scheduler" /> },
    { id: 'fb-cover', nameBn: 'ফেসবুক কভার মেকার', nameEn: 'FB Cover Maker', descBn: 'কভার ডিজাইন', descEn: 'Design covers', icon: LayoutIcon, component: () => <PlaceholderTool name="FB Cover Maker" /> },
    { id: 'speed-test', nameBn: 'ওয়েবসাইট স্পিড টেস্ট', nameEn: 'Website Speed Test', descBn: 'স্পিড পরীক্ষা', descEn: 'Test speed', icon: Gauge, component: () => <PlaceholderTool name="Speed Test" /> },
  ];

  const activeToolObj = tools.find(t => t.id === activeTool);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">🛠️ {t('ফ্রি আইটি টুলস', 'Free IT Tools')}</h1>
          <p className="text-muted-foreground mt-2">{t('বিনামূল্যে ব্যবহার করুন', 'Use for free')}</p>
        </div>

        {activeToolObj ? (
          <div className="max-w-2xl mx-auto">
            <button onClick={() => setActiveTool(null)} className="text-sm text-primary hover:underline mb-4 inline-flex items-center gap-1">
              ← {t('সকল টুলস', 'All Tools')}
            </button>
            <div className="card-3d p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                  <activeToolObj.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h2 className="text-lg font-bold text-foreground">{language === 'bn' ? activeToolObj.nameBn : activeToolObj.nameEn}</h2>
              </div>
              <activeToolObj.component />
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tools.map(tool => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className="card-3d p-5 text-left hover:border-primary/50 transition-all"
              >
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center mb-3">
                  <tool.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-foreground text-sm">{language === 'bn' ? tool.nameBn : tool.nameEn}</h3>
                <p className="text-xs text-muted-foreground mt-1">{language === 'bn' ? tool.descBn : tool.descEn}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ToolsPage;
