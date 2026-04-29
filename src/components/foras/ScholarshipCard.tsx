import { useState } from "react";
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { BadgeCheck, Clock, X, Heart, Search, Link2, Share2, Sparkles, GraduationCap, Banknote, ChevronDown } from "lucide-react";
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
  const [expanded, setExpanded] = useState(false);

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

  const handleCardClick = () => {
    if (!active) return;
    setExpanded(v => !v);
  };
  const orgInitial = scholarship.org?.trim()?.[0] ?? "★";

  return (
    <motion.div
      drag={active ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleEnd}
      onClick={handleCardClick}
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

        <motion.div
          animate={{ scale: expanded ? 1.01 : 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
          className="p-5 pt-5 flex flex-col flex-1 overflow-hidden"
          dir="rtl"
        >
          {/* TOP: Logo + Title + share */}
          <div className="flex items-start gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gold-gradient flex items-center justify-center flex-shrink-0 shadow-gold">
              <span className="text-primary-foreground font-display text-xl font-bold">{orgInitial}</span>
            </div>
            <div className="flex-1 min-w-0 text-right">
              <p className="text-primary text-xs font-medium mb-0.5 truncate">{scholarship.org}</p>
              <h3 className="font-display text-lg text-foreground leading-tight line-clamp-2">
                {scholarship.title}
              </h3>
            </div>
            <button onClick={handleShare}
              className="w-9 h-9 rounded-full bg-background/60 backdrop-blur-sm border border-primary/30 hover:bg-primary/20 flex items-center justify-center flex-shrink-0"
              aria-label="مشاركة">
              <Share2 className="w-4 h-4 text-primary" />
            </button>
          </div>

          {/* Verification badges */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {scholarship.verified && (
              <span className="flex items-center gap-1 bg-verified/15 border border-verified/40 text-verified px-2 py-0.5 rounded-full text-[10px] font-medium">
                <BadgeCheck className="w-3 h-3" /> موثقة
              </span>
            )}
            {scholarship.manualReview && (
              <span className="flex items-center gap-1 bg-review/15 border border-review/40 text-review px-2 py-0.5 rounded-full text-[10px] font-medium">
                <Search className="w-3 h-3" /> مراجعة يدوية
              </span>
            )}
            <span className="flex items-center gap-1 bg-primary/10 border border-primary/30 text-primary px-2 py-0.5 rounded-full text-[10px] font-bold mr-auto">
              <Sparkles className="w-3 h-3" /> مطابقة {matchScore}%
            </span>
          </div>

          {/* MIDDLE: 3 quick-info chips */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <Chip icon={Banknote} label="التمويل" value={scholarship.amount} />
            <Chip icon={GraduationCap} label="التخصص" value={scholarship.tags?.[0] ?? scholarship.level} />
            <Chip icon={Clock} label="آخر موعد" value={new Date(scholarship.deadline).toLocaleDateString("ar-EG")} />
          </div>

          {/* Expanded body */}
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                key="expand"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden text-right"
              >
                <p className="text-muted-foreground text-xs leading-relaxed mb-3">
                  {scholarship.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {scholarship.tags.map(t => (
                    <span key={t} className="text-[10px] bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onTap(); }}
                  className="text-[11px] text-primary font-bold hover:underline"
                >
                  عرض كل التفاصيل والتقديم ←
                </button>
                <a href={scholarship.sourceUrl} target="_blank" rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-primary transition-colors mt-2 truncate">
                  <Link2 className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate" dir="ltr">المصدر: {scholarship.sourceUrl}</span>
                </a>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tap hint */}
          {!expanded && (
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded(true); }}
              className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors my-1"
            >
              اضغط للمزيد <ChevronDown className="w-3 h-3" />
            </button>
          )}

          <div className="flex-1" />

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
        </motion.div>
      </div>
    </motion.div>
  );
};

const Chip = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
  <div className="bg-background/50 border border-primary/20 rounded-xl p-2 text-right">
    <div className="flex items-center gap-1 text-muted-foreground text-[9px] mb-0.5 justify-end">
      <span className="truncate">{label}</span>
      <Icon className="w-3 h-3 text-primary flex-shrink-0" />
    </div>
    <p className="text-foreground text-[11px] font-bold truncate" title={value}>{value}</p>
  </div>
);