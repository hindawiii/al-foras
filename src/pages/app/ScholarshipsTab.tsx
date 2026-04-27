import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ExternalLink, BadgeCheck, Search, Award, MapPin, Clock } from "lucide-react";
import { ScholarshipCard } from "@/components/foras/ScholarshipCard";
import { SCHOLARSHIPS, Scholarship } from "@/lib/mockData";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const ScholarshipsTab = () => {
  const [deck, setDeck] = useState(SCHOLARSHIPS);
  const [detail, setDetail] = useState<Scholarship | null>(null);
  const [aiNotice, setAiNotice] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const t = setTimeout(() => setAiNotice(true), 4000);
    return () => clearTimeout(t);
  }, []);

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

  return (
    <div className="relative h-[calc(100vh-180px)] flex flex-col">
      <AnimatePresence>
        {aiNotice && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
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
        <SheetContent side="bottom" className="bg-card border-gold/30 rounded-t-3xl max-h-[90vh] overflow-y-auto">
          {detail && (
            <>
              <SheetHeader>
                <div className="flex flex-wrap gap-2 mb-3">
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
                <SheetTitle className="text-right font-display text-2xl text-gold-gradient">{detail.title}</SheetTitle>
                <p className="text-primary text-sm text-right">{detail.org}</p>
              </SheetHeader>
              <div className="space-y-4 mt-6">
                <p className="text-foreground leading-relaxed">{detail.description}</p>
                <div className="grid grid-cols-2 gap-3">
                  <Detail icon={MapPin} label="الدولة" value={detail.country} />
                  <Detail icon={Award} label="المبلغ" value={detail.amount} />
                  <Detail icon={Clock} label="آخر موعد" value={new Date(detail.deadline).toLocaleDateString("ar-EG")} />
                  <Detail icon={BadgeCheck} label="المستوى" value={detail.level} />
                </div>
                <Button variant="luxe" size="lg" className="w-full">
                  <ExternalLink className="w-4 h-4 ml-2" />
                  التقديم على المنحة
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
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
