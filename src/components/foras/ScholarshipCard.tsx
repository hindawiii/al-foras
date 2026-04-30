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

const buildShareUrl = (id: string) => {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/?scholarship=${encodeURIComponent(id)}`;
};

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
      url: buildShareUrl(scholarship.id),
    });
  };

  return (
    <motion.div
      drag={active ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleEnd}
      onClick={() => active && onTap()}
      style={{ x, rotate, opacity, zIndex: 10 - index }}
      initial={{ scale: 1 - index * 0.04, y: index * -8 }}
      animate={{ scale: 1 - index * 0.04, y: index * -8 }}
      whileTap={{ cursor: active ? "grabbing" : "default" }}
      className="absolute inset-0 select-none"
    >
      <div className="relative h-full bg-card-gradient border-gold border rounded-3xl shadow-luxe overflow-hidden cursor-grab active:cursor-grabbing flex flex-col">
        <div className="h-2 bg-gold-gradient flex-shrink-0" />

        <motion.div style={{ opacity: saveOpacity }}
          className="absolute top-20 right-8 border-4 border-success rounded-2xl px-4 py-2 rotate-12 z-20">
          <span className="text-success font-bold text-2xl">حفظ</span>
        </motion.div>
        <motion.div style={{ opacity: ignoreOpacity }}
          className="absolute top-20 left-8 border-4 border-destructive rounded-2xl px-4 py-2 -rotate-12 z-20">
          <span className="text-destructive font-bold text-2xl">تجاهل</span>
        </motion.div>

        <div className="p-6 pt-5 flex flex-col flex-1" dir="rtl">
          {/* Top: badges + share */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex flex-wrap gap-1.5">
              {scholarship.verified && (
                <span className="flex items-center gap-1 bg-verified/15 border border-verified/40 text-verified px-2 py-0.5 rounded-full text-[11px] font-medium">
                  <BadgeCheck className="w-3 h-3" /> موثقة
                </span>
              )}
              {scholarship.manualReview && (
                <span className="flex items-center gap-1 bg-review/15 border border-review/40 text-review px-2 py-0.5 rounded-full text-[11px] font-medium">
                  <Search className="w-3 h-3" /> مراجعة يدوية
                </span>
              )}
              <span className="flex items-center gap-1 bg-primary/10 border border-primary/30 text-primary px-2 py-0.5 rounded-full text-[11px] font-bold">
                <Sparkles className="w-3 h-3" /> {matchScore}%
              </span>
            </div>
            <button onClick={handleShare}
              className="w-9 h-9 rounded-full bg-background/60 backdrop-blur-sm border border-primary/30 hover:bg-primary/20 flex items-center justify-center flex-shrink-0"
              aria-label="مشاركة">
              <Share2 className="w-4 h-4 text-primary" />
            </button>
          </div>

          {/* Title block */}
          <div className="text-right mb-4">
            <p className="text-primary text-xs font-medium mb-1">{scholarship.org}</p>
            <h3 className="font-display text-2xl text-foreground leading-tight line-clamp-3">
              {scholarship.title}
            </h3>
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3 text-right">
            {scholarship.description}
          </p>

          {/* Detail rows */}
          <div className="space-y-2 mb-4">
            <Row icon={MapPin} label="الدولة" value={scholarship.country} />
            <Row icon={Award} label="المبلغ" value={scholarship.amount} />
            <Row icon={Clock} label="آخر موعد" value={new Date(scholarship.deadline).toLocaleDateString("ar-EG")} />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {scholarship.tags.map(t => (
              <span key={t} className="text-[11px] bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded-full">
                {t}
              </span>
            ))}
          </div>

          <a href={scholarship.sourceUrl} target="_blank" rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-primary transition-colors mb-2 truncate">
            <Link2 className="w-3 h-3 flex-shrink-0" />
            <span className="truncate" dir="ltr">{scholarship.sourceUrl}</span>
          </a>

          <div className="flex-1" />

          {/* Action buttons */}
          <div className="flex justify-center gap-4 mt-2 flex-shrink-0">
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

const Row = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
  <div className="flex items-center justify-between gap-2 bg-background/40 border border-border rounded-xl px-3 py-2">
    <span className="text-foreground text-sm font-medium truncate">{value}</span>
    <div className="flex items-center gap-1.5 text-muted-foreground text-xs flex-shrink-0">
      <span>{label}</span>
      <Icon className="w-3.5 h-3.5 text-primary" />
    </div>
  </div>
);
