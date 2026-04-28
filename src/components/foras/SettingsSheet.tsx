import { Moon, User, Shield, Info, Trash2, LogOut, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useSettings } from "@/contexts/SettingsContext";
import { useAuth } from "@/contexts/AuthContext";
import { nativeShare } from "@/lib/share";

interface Props { open: boolean; onOpenChange: (v: boolean) => void; }

export const SettingsSheet = ({ open, onOpenChange }: Props) => {
  const { darkMode, toggleDarkMode } = useSettings();
  const { signOut } = useAuth();
  const nav = useNavigate();

  const handleClearCache = () => {
    const keep = ["foras-dark", "foras-textonly", "foras-onboarded"];
    Object.keys(localStorage).forEach(k => { if (!keep.includes(k) && !k.startsWith("sb-")) localStorage.removeItem(k); });
    toast.success("تم مسح الملفات المؤقتة بنجاح");
  };

  const handleLogout = async () => {
    await signOut();
    toast.success("تم تسجيل الخروج");
    nav("/auth");
  };

  const handleShareApp = async () => {
    await nativeShare({
      title: "الفرص — Al-Foras",
      text: "اكتشف المنح الدراسية والفرص العالمية والعربية في تطبيق واحد.",
      url: window.location.origin,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="bg-card border-gold/30 w-[88%] sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-gold-gradient font-display text-2xl text-right">الإعدادات</SheetTitle>
        </SheetHeader>

        <div className="space-y-2 mt-8">
          <Row icon={Moon} label="الوضع الليلي" trailing={<Switch checked={darkMode} onCheckedChange={toggleDarkMode} />} />
          <Row icon={User} label="إعدادات الحساب" onClick={() => toast.info("قريباً")} />
          <Row icon={Shield} label="الخصوصية" onClick={() => toast.info("سياسة الخصوصية قريباً")} />
          <Row icon={Info} label="حول التطبيق" onClick={() => toast.info("الفرص v1.0 — منصة المنح والفرص العالمية")} />
          <Row icon={Trash2} label="مسح الملفات المؤقتة" onClick={handleClearCache} />

          <div className="pt-4 space-y-2">
            <Button variant="outline" size="lg"
              onClick={handleShareApp}
              className="w-full bg-card border-gold/40 hover:bg-primary/10 hover:border-primary">
              <Share2 className="w-4 h-4 ml-2" />
              مشاركة التطبيق
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="danger" size="lg" className="w-full">
                  <LogOut className="w-4 h-4 ml-2" />
                  تسجيل الخروج
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card border-gold/30">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-right text-gold-gradient font-display text-xl">
                    تأكيد تسجيل الخروج
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-right text-muted-foreground">
                    هل أنت متأكد أنك تريد الخروج من حسابك؟
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-row-reverse">
                  <AlertDialogAction onClick={handleLogout}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    نعم، اخرج
                  </AlertDialogAction>
                  <AlertDialogCancel className="bg-card border-gold/30">إلغاء</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const Row = ({ icon: Icon, label, trailing, onClick }: { icon: React.ElementType; label: string; trailing?: React.ReactNode; onClick?: () => void }) => (
  <button onClick={onClick}
    className="w-full flex items-center gap-3 p-4 rounded-xl bg-background/40 hover:bg-primary/10 border border-transparent hover:border-primary/30 transition-all text-right">
    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <span className="flex-1 text-foreground font-medium">{label}</span>
    {trailing}
  </button>
);
