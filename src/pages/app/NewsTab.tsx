import { useState } from "react";
import { motion } from "framer-motion";
import { Newspaper, Globe2, Trophy, TrendingUp, CloudSun, Sparkles, FileText } from "lucide-react";
import { NEWS, NewsItem } from "@/lib/mockData";
import { useSettings } from "@/contexts/SettingsContext";
import { Switch } from "@/components/ui/switch";

const cats = [
  { id: "all" as const, label: "الكل", icon: Newspaper },
  { id: "global" as const, label: "عالمي", icon: Globe2 },
  { id: "local" as const, label: "محلي", icon: Newspaper },
  { id: "sports" as const, label: "رياضة", icon: Trophy },
  { id: "economy" as const, label: "اقتصاد", icon: TrendingUp },
  { id: "weather" as const, label: "طقس", icon: CloudSun },
];

export const NewsTab = () => {
  const [cat, setCat] = useState<typeof cats[number]["id"]>("all");
  const { textOnly, toggleTextOnly } = useSettings();
  const items = cat === "all" ? NEWS : NEWS.filter(n => n.category === cat);

  return (
    <div className="space-y-4 pb-24">
      <div className="flex items-center justify-between glass rounded-2xl p-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <span className="text-sm">وضع توفير البيانات (نص فقط)</span>
        </div>
        <Switch checked={textOnly} onCheckedChange={toggleTextOnly} />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {cats.map(c => {
          const Icon = c.icon;
          const active = cat === c.id;
          return (
            <button key={c.id} onClick={() => setCat(c.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                active ? "bg-gold-gradient text-primary-foreground shadow-gold" : "bg-card border border-border text-muted-foreground hover:border-primary/40"
              }`}>
              <Icon className="w-3.5 h-3.5" />
              {c.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {items.map((item, i) => <NewsCard key={item.id} item={item} index={i} textOnly={textOnly} />)}
      </div>
    </div>
  );
};

const NewsCard = ({ item, index, textOnly }: { item: NewsItem; index: number; textOnly: boolean }) => (
  <motion.article
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="group bg-card-gradient border border-border hover:border-primary/40 rounded-2xl overflow-hidden transition-all flex flex-col"
  >
    {!textOnly && item.image && (
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img src={item.image} alt={item.title} loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
        <span className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm text-[10px] text-primary font-bold px-2 py-0.5 rounded-full border border-primary/30">
          {item.source}
        </span>
      </div>
    )}
    <div className="p-3 flex flex-col flex-1 text-right">
      <div className="flex items-center justify-end gap-2 text-[10px] text-muted-foreground mb-1.5">
        {(textOnly || !item.image) && <span className="text-primary font-medium">{item.source}</span>}
        <span>{item.time}</span>
      </div>
      <h3 className="font-display text-sm text-foreground mb-1.5 leading-snug line-clamp-2">{item.title}</h3>
      {!textOnly && (
        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">{item.summary}</p>
      )}
      {item.aiLink && (
        <div className="mt-2 flex items-start gap-1.5 bg-primary/10 border border-primary/30 rounded-lg p-2">
          <Sparkles className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-primary font-medium leading-relaxed line-clamp-2">{item.aiLink}</p>
        </div>
      )}
    </div>
  </motion.article>
);
