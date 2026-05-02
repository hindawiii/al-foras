import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, CheckCircle2, Trash2, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface Saved {
  id: string; scholarship_id: string; scholarship_title: string;
  status: string; created_at: string; scholarship_data: any;
}

export const ApplicationsTab = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Saved[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, lang, dir } = useLanguage();
  const isRtl = dir === "rtl";

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from("saved_scholarships")
      .select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setItems((data as Saved[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const setStatus = async (id: string, status: string) => {
    await supabase.from("saved_scholarships").update({ status }).eq("id", id);
    toast.success(status === "applied" ? t("markedApplied") : t("updated"));
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("saved_scholarships").delete().eq("id", id);
    toast.success(t("removed"));
    load();
  };

  if (loading) return <div className="text-center text-muted-foreground py-20">{t("loading")}</div>;

  if (items.length === 0) {
    return (
      <div className="text-center py-20 px-6">
        <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-card-gradient border-gold flex items-center justify-center">
          <Bookmark className="w-10 h-10 text-primary" strokeWidth={1.3} />
        </div>
        <h3 className="font-display text-xl text-gold-gradient mb-2">{t("noApps")}</h3>
        <p className="text-muted-foreground text-sm">{t("noAppsDesc")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-24">
      {items.map((s, i) => (
        <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-card-gradient border border-border rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-display text-base text-foreground line-clamp-2">{s.scholarship_title}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  s.status === "applied" ? "bg-success/15 text-success border border-success/30" : "bg-primary/10 text-primary border border-primary/30"
                }`}>
                  {s.status === "applied" ? t("statusApplied") : t("statusSaved")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(s.created_at).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US")}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            {s.status !== "applied" && (
              <Button size="sm" variant="luxe" className="flex-1" onClick={() => setStatus(s.id, "applied")}>
                <CheckCircle2 className={`w-3.5 h-3.5 ${isRtl ? "ml-1" : "mr-1"}`} />
                {t("markApplied")}
              </Button>
            )}
            <Button size="sm" variant="ghostGold" onClick={() => remove(s.id)}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
