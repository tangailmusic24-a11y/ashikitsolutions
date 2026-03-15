
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value_bn text NOT NULL DEFAULT '',
  value_en text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site settings viewable by everyone" ON public.site_settings FOR SELECT TO public USING (true);
CREATE POLICY "Admins can insert site settings" ON public.site_settings FOR INSERT TO public WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update site settings" ON public.site_settings FOR UPDATE TO public USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete site settings" ON public.site_settings FOR DELETE TO public USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed default settings
INSERT INTO public.site_settings (key, value_bn, value_en) VALUES
  ('breaking_news', '🔥 আমাদের নতুন সার্ভিস চালু হয়েছে! সকল সোশ্যাল মিডিয়া সমস্যার সমাধান পাবেন।', '🔥 Our new services are live! Get solutions for all social media issues.'),
  ('contact_telegram', '@mdashikahmed_official', '@mdashikahmed_official'),
  ('contact_website', 'ashik360info.blogspot.com', 'ashik360info.blogspot.com'),
  ('contact_facebook', 'mdashikahmed02', 'mdashikahmed02'),
  ('contact_instagram', 'mdashikahmed02', 'mdashikahmed02'),
  ('contact_email', 'ashik.oysterit@gmail.com', 'ashik.oysterit@gmail.com'),
  ('contact_phone', '+8801303216921', '+8801303216921'),
  ('contact_hours_bn', 'সকাল ১১টা থেকে রাত ৮টা পর্যন্ত শুধুমাত্র হোয়াটসঅ্যাপে', 'WhatsApp only, 11 AM to 8 PM'),
  ('hero_subtitle_bn', 'বিশ্বস্ততার এক ধাপ এগিয়ে', 'One step ahead in trust'),
  ('hero_title_line1_bn', 'সোশ্যাল মিডিয়ার সকল সমস্যার', 'Complete Solutions for All'),
  ('hero_title_line2_bn', 'সম্পূর্ণ সমাধান', 'Social Media Issues'),
  ('hero_description_bn', 'ফেসবুক, ইউটিউব, টিকটক, ইনস্টাগ্রাম, টেলিগ্রাম সহ সকল প্ল্যাটফর্মের মনিটাইজেশন সেটআপ ও সমস্যা সমাধান', 'Monetization setup & problem solving for Facebook, YouTube, TikTok, Instagram, Telegram and all platforms');
