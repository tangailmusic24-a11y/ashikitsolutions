import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const SIGNED_URL_EXPIRY = 60 * 60; // 1 hour

/**
 * Resolves a storage path to a short-lived signed URL.
 * If the value is already a full URL (legacy), returns it as-is.
 * Regenerates the signed URL when the path changes.
 */
export function useSignedUrl(bucket: string, path: string | undefined | null): string {
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (!path) {
      setUrl('');
      return;
    }

    // If it's already a full URL (legacy data), use it directly
    if (path.startsWith('http://') || path.startsWith('https://')) {
      setUrl(path);
      return;
    }

    // Generate a short-lived signed URL
    const generateUrl = async () => {
      const { data } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, SIGNED_URL_EXPIRY);
      if (data?.signedUrl) {
        setUrl(data.signedUrl);
      }
    };

    generateUrl();
  }, [bucket, path]);

  return url;
}
