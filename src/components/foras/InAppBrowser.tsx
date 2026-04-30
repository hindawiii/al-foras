import { useEffect, useState } from "react";
import { ExternalLink, X, RefreshCw, ShieldAlert, Globe } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface Props {
  url: string | null;
  title?: string;
  onClose: () => void;
}

/**
 * In-app browser: tries to embed the official URL via <iframe>.
 * Many sites disable framing (X-Frame-Options/CSP), so we provide a
 * "Open externally" fallback button that opens in the system browser.
 */
export const InAppBrowser = ({ url, title, onClose }: Props) => {
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => { if (url) { setLoading(true); setReloadKey(k => k + 1); } }, [url]);

  if (!url) return null;

  return (
    <Sheet open={!!url} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="bottom"
        className="bg-card border-gold/30 rounded-t-3xl p-0 h-[92vh] max-h-[92vh] overflow-hidden flex flex-col"
      >
        {/* Toolbar */}
        <div className="flex items-center gap-2 p-2 border-b border-border bg-background/80 backdrop-blur-sm flex-shrink-0" dir="rtl">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-card border border-border hover:border-primary/40 flex items-center justify-center"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4 text-foreground" />
          </button>
          <div className="flex-1 min-w-0 px-2">
            <p className="text-[11px] text-muted-foreground truncate text-right">{title ?? "الموقع الرسمي"}</p>
            <p className="text-[10px] text-primary truncate" dir="ltr">{url}</p>
          </div>
          <button
            onClick={() => setReloadKey(k => k + 1)}
            className="w-9 h-9 rounded-full bg-card border border-border hover:border-primary/40 flex items-center justify-center"
            aria-label="تحديث"
          >
            <RefreshCw className="w-4 h-4 text-foreground" />
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold"
            aria-label="فتح في المتصفح"
          >
            <ExternalLink className="w-4 h-4 text-primary-foreground" />
          </a>
        </div>

        {/* Iframe */}
        <div className="relative flex-1 bg-background">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <RefreshCw className="w-6 h-6 text-primary animate-spin" />
            </div>
          )}
          <iframe
            key={reloadKey}
            src={url}
            title={title ?? "official-site"}
            className="w-full h-full border-0 bg-white"
            onLoad={() => setLoading(false)}
            referrerPolicy="no-referrer"
            sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          />
        </div>

        {/* Hint footer (some sites refuse framing) */}
        <div className="flex items-center gap-2 px-3 py-2 bg-background/80 border-t border-border text-[11px] text-muted-foreground" dir="rtl">
          <ShieldAlert className="w-3.5 h-3.5 text-primary flex-shrink-0" />
          <span className="flex-1 leading-snug">
            بعض المواقع الرسمية تمنع العرض داخل التطبيق. استخدم زر <Globe className="inline w-3 h-3" /> للفتح في المتصفح.
          </span>
          <Button asChild variant="luxe" size="sm" className="h-7 px-3 text-[11px]">
            <a href={url} target="_blank" rel="noopener noreferrer">فتح خارجياً</a>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
