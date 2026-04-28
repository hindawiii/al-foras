import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { BadgeCheck, Clock, MapPin, Award, X, Heart, Search, Link2, Share2, Sparkles } from "lucide-react";
import { Scholarship } from "@/lib/mockData";
import { nativeShare } from "@/lib/share";

interface Props {
  scholarship: Scholarship;
  onSwipe: (dir: "left" | "right") => void;
  onTap: () => void;
  active: boolean;
  index: number;
  matchScore: number;
}

export const ScholarshipCard = ({ scholarship, onSwipe, onTap, active, index, matchScore }: Props) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -50, 0, 50, 200], [0, 1, 1, 1, 0]);
  const saveOpacity = useTransform(x, [0, 100], [0, 1]);
  const ignoreOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 100) onSwipe("right");
    else if (info.offset.x < -100) onSwipe("left");
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await nativeShare({
      title: `الفرص — ${scholarship.title}`,
      text: `${scholarship.title} — ${scholarship.org} (${scholarship.country})`,
      url: scholarship.officialUrl,
    });
  };

  return (
    <motion.div
      drag={active ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleEnd}
      onClick={onTap}
      style={{ x, rotate, opacity, zIndex: 10 - index }}
      initial={{ scale: 1 - index * 0.04, y: index * -8 }}
      animate={{ scale: 1 - index * 0.04, y: index * -8 }}
      whileTap={{ cursor: active ? "grabbing" : "default" }}
      className="absolute inset-0 select-none"
    >
      <div className="relative h-full bg-card-gradient border-gold border rounded-3xl shadow-luxe overflow-hidden cursor-grab active:cursor-grabbing flex flex-col">
        <div className="h-2 bg-gold-gradient flex-shrink-0" />
        <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10 gap-2">
          <div className="flex flex-wrap gap-2">
            {scholarship.verified && (
              <div className="flex items-center gap-1 bg-verified/15 border border-verified/40 text-verified px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                <BadgeCheck className="w-3.5 h-3.5" /> موثقة
              </div>
            )}
            {scholarship.manualReview && (
              <div className="flex items-center gap-1 bg-review/15 border border-review/40 text-review px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                <Search className="w-3.5 h-3.5" /> مراجعة يدوية
              </div>
            )}
          </div>
          <button onClick={handleShare}
            className="w-9 h-9 rounded-full bg-background/60 backdrop-blur-sm border border-primary/30 hover:bg-primary/20 flex items-center justify-center"
            aria-label="مشاركة">
            <Share2 className="w-4 h-4 text-primary" />
          </button>
        </div>

        <motion.div style={{ opacity: saveOpacity }}
          className="absolute top-20 right-8 border-4 border-success rounded-2xl px-4 py-2 rotate-12 z-20">
          <span className="text-success font-bold text-2xl">حفظ</span>
        </motion.div>
        <motion.div style={{ opacity: ignoreOpacity }}
          className="absolute top-20 left-8 border-4 border-destructive rounded-2xl px-4 py-2 -rotate-12 z-20">
          <span className="text-destructive font-bold text-2xl">تجاهل</span>
        </motion.div>

        <div className="p-6 pt-20 flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <p className="text-primary text-sm font-medium mb-2">{scholarship.org}</p>
            <h3 className="font-display text-xl text-foreground leading-tight mb-3">
              {scholarship.title}
            </h3>

            <div className="mb-4 bg-primary/10 border border-primary/30 rounded-xl p-2.5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-xs text-foreground">مناسبة لك بنسبة</span>
              <span className="font-bold text-primary text-base mr-auto">{matchScore}%</span>
            </div>

            <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 mb-4">
              {scholarship.description}
            </p>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <InfoRow icon={MapPin} label="الدولة" value={scholarship.country} />
              <InfoRow icon={Award} label="المبلغ" value={scholarship.amount} />
              <InfoRow icon={Clock} label="آخر موعد" value={new Date(scholarship.deadline).toLocaleDateString("ar-EG")} />
              <InfoRow icon={BadgeCheck} label="المستوى" value={scholarship.level} />
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {scholarship.tags.map(t => (
                <span key={t} className="text-[10px] bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded-full">
                  {t}
                </span>
              ))}
            </div>

            <a href={scholarship.sourceUrl} target="_blank" rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-primary transition-colors mt-2 truncate">
              <Link2 className="w-3 h-3 flex-shrink-0" />
              <span className="truncate" dir="ltr">رابط المصدر: {scholarship.sourceUrl}</span>
            </a>
          </div>

          <div className="flex justify-center gap-4 mt-3 flex-shrink-0">
            <button onClick={(e) => { e.stopPropagation(); onSwipe("left"); }}
              className="w-14 h-14 rounded-full bg-card border-2 border-destructive/40 hover:bg-destructive/10 hover:border-destructive flex items-center justify-center transition-all shadow-luxe">
              <X className="w-6 h-6 text-destructive" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onSwipe("right"); }}
              className="w-14 h-14 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold hover:scale-110 transition-transform">
              <Heart className="w-6 h-6 text-primary-foreground fill-current" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
  <div className="bg-background/40 border border-border/50 rounded-xl p-2">
    <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] mb-0.5">
      <Icon className="w-3 h-3" />{label}
    </div>
    <p className="text-foreground text-xs font-medium truncate">{value}</p>
  </div>
);
