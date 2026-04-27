import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { BadgeCheck, Clock, MapPin, Award, X, Heart, Search } from "lucide-react";
import { Scholarship } from "@/lib/mockData";

interface Props {
  scholarship: Scholarship;
  onSwipe: (dir: "left" | "right") => void;
  onTap: () => void;
  active: boolean;
  index: number;
}

export const ScholarshipCard = ({ scholarship, onSwipe, onTap, active, index }: Props) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -50, 0, 50, 200], [0, 1, 1, 1, 0]);
  const saveOpacity = useTransform(x, [0, 100], [0, 1]);
  const ignoreOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 100) onSwipe("right");
    else if (info.offset.x < -100) onSwipe("left");
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
      <div className="relative h-full bg-card-gradient border-gold border rounded-3xl shadow-luxe overflow-hidden cursor-grab active:cursor-grabbing">
        {/* Decorative top bar */}
        <div className="h-2 bg-gold-gradient" />
        <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
          <div className="flex flex-wrap gap-2">
            {scholarship.verified && (
              <div className="flex items-center gap-1 bg-verified/15 border border-verified/40 text-verified px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                <BadgeCheck className="w-3.5 h-3.5" />
                موثقة
              </div>
            )}
            {scholarship.manualReview && (
              <div className="flex items-center gap-1 bg-review/15 border border-review/40 text-review px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                <Search className="w-3.5 h-3.5" />
                مراجعة يدوية
              </div>
            )}
          </div>
        </div>

        <motion.div style={{ opacity: saveOpacity }}
          className="absolute top-20 right-8 border-4 border-success rounded-2xl px-4 py-2 rotate-12 z-20">
          <span className="text-success font-bold text-2xl">حفظ</span>
        </motion.div>
        <motion.div style={{ opacity: ignoreOpacity }}
          className="absolute top-20 left-8 border-4 border-destructive rounded-2xl px-4 py-2 -rotate-12 z-20">
          <span className="text-destructive font-bold text-2xl">تجاهل</span>
        </motion.div>

        <div className="p-7 pt-20 flex flex-col h-full">
          <div className="flex-1">
            <p className="text-primary text-sm font-medium mb-2">{scholarship.org}</p>
            <h3 className="font-display text-2xl text-foreground leading-tight mb-4">
              {scholarship.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-6">
              {scholarship.description}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <InfoRow icon={MapPin} label="الدولة" value={scholarship.country} />
              <InfoRow icon={Award} label="المبلغ" value={scholarship.amount} />
              <InfoRow icon={Clock} label="آخر موعد" value={new Date(scholarship.deadline).toLocaleDateString("ar-EG")} />
              <InfoRow icon={BadgeCheck} label="المستوى" value={scholarship.level} />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {scholarship.tags.map(t => (
                <span key={t} className="text-xs bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded-full">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-4">
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
  <div className="bg-background/40 border border-border/50 rounded-xl p-2.5">
    <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] mb-0.5">
      <Icon className="w-3 h-3" />
      {label}
    </div>
    <p className="text-foreground text-sm font-medium truncate">{value}</p>
  </div>
);
