import { Bell, Sparkles, Award, Newspaper } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface Props { open: boolean; onOpenChange: (v: boolean) => void; }

const NOTIFICATIONS = [
  { id: "1", icon: Sparkles, color: "text-primary", title: "مطابقة ذكية جديدة",
    body: "وجدنا 3 منح تطابق مهاراتك بناءً على أحدث الأخبار العالمية.", time: "قبل دقائق" },
  { id: "2", icon: Award, color: "text-verified", title: "اقترب الموعد النهائي",
    body: "منحة تشيفنينغ تنتهي خلال 14 يوماً. لا تفوّت الفرصة.", time: "قبل ساعة" },
  { id: "3", icon: Newspaper, color: "text-review", title: "خبر يربطك بفرصة",
    body: "الاتحاد الأوروبي وسّع برامج إيراسموس — تحقق من الفرص الجديدة.", time: "قبل 3 ساعات" },
];

export const NotificationsSheet = ({ open, onOpenChange }: Props) => (
  <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetContent side="left" className="bg-card border-gold/30 w-[88%] sm:max-w-md">
      <SheetHeader>
        <SheetTitle className="text-gold-gradient font-display text-2xl text-right flex items-center gap-2 justify-end">
          <Bell className="w-5 h-5 text-primary" />
          الإشعارات
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
              <div className="flex-1 text-right">
                <p className="font-medium text-foreground text-sm mb-0.5">{n.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{n.body}</p>
                <p className="text-[10px] text-primary mt-1.5">{n.time}</p>
              </div>
            </div>
          );
        })}
        <p className="text-center text-xs text-muted-foreground pt-4">
          الإشعارات تربط الأخبار العالمية بالفرص المناسبة لملفك الشخصي.
        </p>
      </div>
    </SheetContent>
  </Sheet>
);
