import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, Plus, X, GraduationCap, MapPin, Mail, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const ProfileTab = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ full_name: "", bio: "", education: "", location: "", skills: [] as string[] });
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()
      .then(({ data }) => {
        if (data) setProfile({
          full_name: data.full_name ?? "", bio: data.bio ?? "",
          education: data.education ?? "", location: data.location ?? "",
          skills: data.skills ?? [],
        });
        setLoading(false);
      });
  }, [user]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update(profile).eq("id", user.id);
    setSaving(false);
    if (error) toast.error("تعذر الحفظ");
    else toast.success("تم حفظ ملفك الشخصي");
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !profile.skills.includes(s) && profile.skills.length < 20) {
      setProfile({ ...profile, skills: [...profile.skills, s] });
      setSkillInput("");
    }
  };

  if (loading) return <div className="text-center text-muted-foreground py-20">جاري التحميل...</div>;

  return (
    <div className="space-y-5 pb-24">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-card-gradient border-gold rounded-3xl p-6 text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-gold-gradient flex items-center justify-center text-4xl font-display text-primary-foreground shadow-gold mb-3">
          {(profile.full_name || user?.email || "?")[0].toUpperCase()}
        </div>
        <h2 className="font-display text-2xl text-gold-gradient">{profile.full_name || "حدّث ملفك الشخصي"}</h2>
        <p className="text-sm text-muted-foreground" dir="ltr">{user?.email}</p>
      </motion.div>

      <Section title="المعلومات الشخصية">
        <Field icon={UserIcon} label="الاسم الكامل">
          <Input value={profile.full_name} onChange={e => setProfile({ ...profile, full_name: e.target.value })}
            className="bg-input border-gold/30 text-right" placeholder="اكتب اسمك" />
        </Field>
        <Field icon={MapPin} label="الموقع">
          <Input value={profile.location} onChange={e => setProfile({ ...profile, location: e.target.value })}
            className="bg-input border-gold/30 text-right" placeholder="المدينة، الدولة" />
        </Field>
        <Field icon={Mail} label="نبذة">
          <Textarea value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })}
            className="bg-input border-gold/30 text-right min-h-24" placeholder="عرّف عن نفسك..." />
        </Field>
      </Section>

      <Section title="التعليم">
        <Field icon={GraduationCap} label="المؤهل التعليمي">
          <Textarea value={profile.education} onChange={e => setProfile({ ...profile, education: e.target.value })}
            className="bg-input border-gold/30 text-right min-h-20"
            placeholder="مثال: بكالوريوس هندسة حاسوب، جامعة الملك سعود، 2024" />
        </Field>
      </Section>

      <Section title="المهارات">
        <div className="flex gap-2">
          <Input value={skillInput} onChange={e => setSkillInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSkill())}
            className="bg-input border-gold/30 text-right" placeholder="أضف مهارة..." />
          <Button type="button" variant="gold" size="icon" onClick={addSkill}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map(s => (
            <span key={s} className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/30 text-primary text-sm px-3 py-1.5 rounded-full">
              {s}
              <button onClick={() => setProfile({ ...profile, skills: profile.skills.filter(x => x !== s) })}>
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {profile.skills.length === 0 && <p className="text-sm text-muted-foreground">لم تُضِف مهارات بعد</p>}
        </div>
      </Section>

      <Button variant="luxe" size="lg" className="w-full" onClick={save} disabled={saving}>
        <Save className="w-4 h-4 ml-2" />
        {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
      </Button>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-card-gradient border border-border rounded-2xl p-5 space-y-4">
    <h3 className="font-display text-lg text-gold-gradient">{title}</h3>
    {children}
  </div>
);

const Field = ({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <Label className="flex items-center gap-1.5 text-sm text-foreground">
      <Icon className="w-3.5 h-3.5 text-primary" />{label}
    </Label>
    {children}
  </div>
);
