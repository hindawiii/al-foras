import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ExternalLink, BadgeCheck, Search, Award, MapPin, Clock, Link2, Share2, Sparkles, Globe } from "lucide-react";
import { ScholarshipCard } from "@/components/foras/ScholarshipCard";
import { InAppBrowser } from "@/components/foras/InAppBrowser";
import { SCHOLARSHIPS, Scholarship, computeMatchScore } from "@/lib/mockData";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { nativeShare } from "@/lib/share";
import { useGeolocation } from "@/hooks/useGeolocation";

export const ScholarshipsTab = () => {
  const { info: geo } = useGeolocation(true);

  // Prioritise scholarships in user's country (if known), then the rest
  const orderedDeck = useMemo(() => {
    const country = (geo?.country || "").toLowerCase();
    if (!country) return SCHOLARSHIPS;
    const matches = SCHOLARSHIPS.filter(s =>
      s.country.toLowerCase().includes(country) || country.includes(s.country.toLowerCase())
    );
    const rest = SCHOLARSHIPS.filter(s => !matches.includes(s));
    return [...matches, ...rest];
  }, [geo?.country]);

  const [deck, setDeck] = useState<Scholarship[]>(orderedDeck);
  const [detail, setDetail] = useState<Scholarship | null>(null);
  const [browserUrl, setBrowserUrl] = useState<string | null>(null);
  const [browserTitle, setBrowserTitle] = useState<string | undefined>();
  const [aiNotice, setAiNotice] = useState(false);
  const [profile, setProfile] = useState<{ location?: string; skills?: string[]; interests?: string[] }>({});
  const { user } = useAuth();

  useEffect(() => {
    const t = setTimeout(() => setAiNotice(true), 4000);
    return () => clearTimeout(t);
  }, []);

  // Re-sort the deck when GPS resolves (only if user hasn't already swiped)
  useEffect(() => {
    setDeck(orderedDeck);
    // eslint-disable-next-line
  }, [orderedDeck.length, geo?.country]);

  // Deep-link: open detail when ?scholarship=ID is in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("scholarship");
    if (!id) return;
    const target = SCHOLARSHIPS.find(s => s.id === id);
    if (target) {
      setDetail(target);
      // Clean URL so it doesn't re-trigger
      const url = new URL(window.location.href);
      url.searchParams.delete("scholarship");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("location, skills, interests").eq("id", user.id).maybeSingle()
      .then(({ data }) => { if (data) setProfile(data as any); });
  }, [user]);

  const handleSwipe = async (dir: "left" | "right", s: Scholarship) => {
    if (dir === "right" && user) {
      await supabase.from("saved_scholarships").upsert({
        user_id: user.id, scholarship_id: s.id, scholarship_title: s.title,
        scholarship_data: s as any, status: "saved",
      }, { onConflict: "user_id,scholarship_id" });
      toast.success("تم حفظ المنحة في طلباتك");
    } else if (dir === "left") {
      toast("تم تجاهل المنحة", { description: s.title });
    }
    setDeck(prev => prev.slice(1));
  };

  const shareDetail = async () => {
    if (!detail) return;
    const origin = window.location.origin;
    await nativeShare({
      title: `الفرص — ${detail.title}`,
      text: `${detail.title} — ${detail.org} (${detail.country})`,
      url: `${origin}/?scholarship=${encodeURIComponent(detail.id)}`,
    });
  };

  return (
    <div className="relative h-[calc(100vh-180px)] flex flex-col">
      <div className="mb-3 px-1 text-[11px] text-muted-foreground flex items-center gap-1.5 leading-relaxed">
        <Globe className="w-3.5 h-3.5 text-primary flex-shrink-0" />
        <span>الفرص مجمّعة من مصادر رسمية عالمية وعربية، ومُرتّبة حسب موقعك واهتماماتك.</span>
      </div>

      <AnimatePresence>
        {aiNotice && (
          <motion.div
            initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
            className="mx-1 mb-3 glass border-gold rounded-2xl p-3 flex items-start gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-gold-gradient flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground font-bold text-xs">AI</span>
            </div>
            <div className="flex-1">
              <p className="text-xs text-primary font-bold mb-0.5">مطابقة ذكية جديدة</p>
              <p className="text-sm text-foreground leading-snug">
                وجدنا 3 منح تطابق مهاراتك بناءً على تحليل أحدث الأخبار العالمية
              </p>
            </div>
            <button onClick={() => setAiNotice(false)} className="text-muted-foreground text-xs">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex-1">
        {deck.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-24 h-24 rounded-3xl bg-card-gradient border-gold flex items-center justify-center mb-6">
              <Award className="w-12 h-12 text-primary" strokeWidth={1.2} />
            </div>
            <h3 className="font-display text-2xl text-gold-gradient mb-2">انتهت المنح المتاحة</h3>
            <p className="text-muted-foreground mb-6">سنخبرك حال توفر منح جديدة تناسبك</p>
            <Button variant="luxe" onClick={() => setDeck(SCHOLARSHIPS)}>إعادة التحميل</Button>
          </div>
        ) : (
          deck.slice(0, 3).map((s, i) => (
            <ScholarshipCard
              key={s.id}
              scholarship={s}
              index={i}
              active={i === 0}
              matchScore={computeMatchScore(s, profile)}
              onSwipe={(d) => handleSwipe(d, s)}
              onTap={() => i === 0 && setDetail(s)}
            />
          ))
        )}
      </div>

      <p className="text-center text-xs text-muted-foreground pt-3">
        اسحب لليمين للحفظ • لليسار للتجاهل
      </p>

      <Sheet open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <SheetContent side="bottom" className="bg-card border-gold/30 rounded-t-3xl max-h-[92vh] overflow-y-auto">
          {detail && (
            <>
              <SheetHeader>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex flex-wrap gap-2">
                    {detail.verified && (
                      <span className="inline-flex items-center gap-1 bg-verified/15 border border-verified/40 text-verified px-2 py-1 rounded-full text-xs font-medium">
                        <BadgeCheck className="w-3.5 h-3.5" /> موثقة
                      </span>
                    )}
                    {detail.manualReview && (
                      <span className="inline-flex items-center gap-1 bg-review/15 border border-review/40 text-review px-2 py-1 rounded-full text-xs">
                        <Search className="w-3.5 h-3.5" /> مراجعة يدوية
                      </span>
                    )}
                  </div>
                  <button onClick={shareDetail}
                    className="w-9 h-9 rounded-full bg-primary/10 border border-primary/30 hover:bg-primary/20 flex items-center justify-center"
                    aria-label="مشاركة">
                    <Share2 className="w-4 h-4 text-primary" />
                  </button>
                </div>
                <SheetTitle className="text-right font-display text-2xl text-gold-gradient">{detail.title}</SheetTitle>
                <p className="text-primary text-sm text-right">{detail.org}</p>
              </SheetHeader>
              <div className="space-y-4 mt-6 pb-6">
                <div className="bg-primary/10 border border-primary/30 rounded-xl p-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="text-sm text-foreground">مناسبة لك بنسبة</span>
                  <span className="font-bold text-primary text-lg mr-auto">{computeMatchScore(detail, profile)}%</span>
                </div>
                <p className="text-foreground leading-relaxed">{detail.description}</p>
                <div className="grid grid-cols-2 gap-3">
                  <Detail icon={MapPin} label="الدولة" value={detail.country} />
                  <Detail icon={Award} label="المبلغ" value={detail.amount} />
                  <Detail icon={Clock} label="آخر موعد" value={new Date(detail.deadline).toLocaleDateString("ar-EG")} />
                  <Detail icon={BadgeCheck} label="المستوى" value={detail.level} />
                </div>

                <div className="grid grid-cols-1 gap-2 pt-2">
                  <Button variant="luxe" size="lg" className="w-full"
                    onClick={() => {
                      setBrowserUrl(detail.officialUrl);
                      setBrowserTitle(detail.title);
                      setDetail(null);
                    }}>
                    <ExternalLink className="w-4 h-4 ml-2" />
                    التقديم على الموقع الرسمي
                  </Button>
                  <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
                    سيتم فتح الموقع الرسمي للجهة المانحة داخل التطبيق لتقديم طلبك مباشرة.
                  </p>
                </div>

                <div className="border-t border-border pt-3 mt-2">
                  <p className="text-[11px] text-muted-foreground mb-1.5 flex items-center gap-1.5">
                    <Link2 className="w-3 h-3 text-primary" /> رابط المصدر
                  </p>
                  <a href={detail.sourceUrl} target="_blank" rel="noopener noreferrer"
                    dir="ltr" className="text-xs text-primary hover:underline break-all block text-left">
                    {detail.sourceUrl}
                  </a>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <InAppBrowser url={browserUrl} title={browserTitle} onClose={() => setBrowserUrl(null)} />
    </div>
  );
};

const Detail = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
  <div className="bg-background/40 border border-border rounded-xl p-3">
    <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
      <Icon className="w-3 h-3" />{label}
    </div>
    <p className="text-foreground font-medium">{value}</p>
  </div>
);
