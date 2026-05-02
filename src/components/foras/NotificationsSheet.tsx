import { Bell, Sparkles, Award, Newspaper } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props { open: boolean; onOpenChange: (v: boolean) => void; }

const NOTIFICATIONS = [
  { id: "1", icon: Sparkles, color: "text-primary", titleKey: "notifMatchTitle", bodyKey: "notifMatchBody", timeKey: "timeMinutesAgo" },
  { id: "2", icon: Award, color: "text-verified", titleKey: "notifDeadlineTitle", bodyKey: "notifDeadlineBody", timeKey: "timeHourAgo" },
  { id: "3", icon: Newspaper, color: "text-review", titleKey: "notifNewsTitle", bodyKey: "notifNewsBody", timeKey: "time3HoursAgo" },
];

export const NotificationsSheet = ({ open, onOpenChange }: Props) => {
  const { t, dir } = useLanguage();
  const isRtl = dir === "rtl";
  const alignClass = isRtl ? "text-right" : "text-left";
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={isRtl ? "left" : "right"} className="bg-card border-gold/30 w-[88%] sm:max-w-md">
        <SheetHeader>
          <SheetTitle className={`text-gold-gradient font-display text-2xl ${alignClass} flex items-center gap-2 ${isRtl ? "justify-end" : "justify-start"}`}>
            <Bell className="w-5 h-5 text-primary" />
            {t("notifications")}
          </SheetTitle>
        </SheetHeader>
        <div className="space-y-3 mt-6">
          {NOTIFICATIONS.map(n => {
            const Icon = n.icon;
            return (
              <div key={n.id} className="bg-card-gradient border border-border rounded-2xl p-4 flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <Icon className={`w-5 h-5 ${n.color}`} />
                </div>
                <div className={`flex-1 ${alignClass}`}>
                  <p className="font-medium text-foreground text-sm mb-0.5">{t(n.titleKey)}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{t(n.bodyKey)}</p>
                  <p className="text-[10px] text-primary mt-1.5">{t(n.timeKey)}</p>
                </div>
              </div>
            );
          })}
          <p className="text-center text-xs text-muted-foreground pt-4">
            {t("notifFooter")}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};
