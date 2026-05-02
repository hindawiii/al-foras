import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Save, Plus, X, GraduationCap, MapPin, Mail, User as UserIcon, Edit3, Sparkles, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { INTEREST_OPTIONS } from "@/lib/mockData";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSettings } from "@/contexts/SettingsContext";

interface ProfileState {
  full_name: string; bio: string; education: string; location: string;
  skills: string[]; interests: string[];
}

const empty: ProfileState = { full_name: "", bio: "", education: "", location: "", skills: [], interests: [] };

export const ProfileTab = () => {
  const { user } = useAuth();
  const { t, dir } = useLanguage();
  const { hideProfile } = useSettings();
  const isRtl = dir === "rtl";
  const alignClass = isRtl ? "text-right" : "text-left";
  const [profile, setProfile] = useState<ProfileState>(empty);
  const [draft, setDraft] = useState<ProfileState>(empty);
  const [editing, setEditing] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()
      .then(({ data }) => {
        if (data) {
          const p: ProfileState = {
            full_name: data.full_name ?? "", bio: data.bio ?? "",
            education: data.education ?? "", location: data.location ?? "",
            skills: data.skills ?? [], interests: (data as any).interests ?? [],
          };
          setProfile(p); setDraft(p);
        }
        setLoading(false);
      });
  }, [user]);

  const completion = useMemo(() => {
    const fields = [
      profile.full_name, profile.bio, profile.education, profile.location,
      profile.skills.length > 0 ? "x" : "", profile.interests.length > 0 ? "x" : "",
    ];
    const filled = fields.filter(f => f && String(f).trim()).length;
    return Math.round((filled / fields.length) * 100);
  }, [profile]);

  const startEdit = () => { setDraft(profile); setEditing(true); };
  const cancelEdit = () => { setDraft(profile); setEditing(false); };

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update(draft).eq("id", user.id);
    setSaving(false);
    if (error) { toast.error(t("saveFailed")); return; }
    setProfile(draft);
    setEditing(false);
    toast.success(t("saved2"));
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !draft.skills.includes(s) && draft.skills.length < 20) {
      setDraft({ ...draft, skills: [...draft.skills, s] });
      setSkillInput("");
    }
  };

  const toggleInterest = (i: string) => {
    setDraft(d => ({
      ...d,
      interests: d.interests.includes(i) ? d.interests.filter(x => x !== i) : [...d.interests, i],
    }));
  };

  if (loading) return <div className="text-center text-muted-foreground py-20">{t("loading")}</div>;

  // ===== ID Card View =====
  if (!editing) {
    return (
      <div className="space-y-4 pb-24">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="relative bg-card-gradient border-gold border-2 rounded-3xl p-6 shadow-luxe overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary-glow/10 rounded-full blur-3xl" />

          <div className="relative flex items-center justify-between mb-4">
            <span className="text-[10px] tracking-widest text-primary font-bold">{t("idCard")}</span>
            <button onClick={startEdit}
              className="flex items-center gap-1.5 text-xs bg-primary/10 border border-primary/30 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-full">
              <Edit3 className="w-3 h-3" /> {t("edit")}
            </button>
          </div>

          <div className="relative flex gap-4 items-center mb-5">
            <div className="w-20 h-20 rounded-2xl bg-gold-gradient flex items-center justify-center text-3xl font-display text-primary-foreground shadow-gold flex-shrink-0">
              {(profile.full_name || user?.email || "?")[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-xl text-gold-gradient truncate">
                {hideProfile ? "•••••" : (profile.full_name || t("yourFullName"))}
              </h2>
              <p className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-0.5" dir="ltr">
                <Mail className="w-3 h-3" /> {hideProfile ? "•••••@•••••" : user?.email}
              </p>
              {profile.location && !hideProfile && (
                <p className="text-xs text-foreground flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-primary" /> {profile.location}
                </p>
              )}
            </div>
          </div>

          <div className="relative bg-background/40 border border-border rounded-xl p-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">{t("profileCompletion")}</span>
              <span className="text-sm font-bold text-primary">{completion}%</span>
            </div>
            <div className="h-2 bg-background rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${completion}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gold-gradient" />
            </div>
            {completion < 100 && (
              <p className="text-[10px] text-muted-foreground mt-2">
                {t("completeProfileHint")}
              </p>
            )}
          </div>

          {profile.bio && !hideProfile && (
            <div className="relative bg-background/40 border border-border rounded-xl p-3 mb-3">
              <p className="text-[10px] text-primary mb-1 font-bold">{t("bio")}</p>
              <p className="text-sm text-foreground leading-relaxed">{profile.bio}</p>
            </div>
          )}

          {profile.education && !hideProfile && (
            <div className="relative bg-background/40 border border-border rounded-xl p-3 mb-3">
              <p className="text-[10px] text-primary mb-1 font-bold flex items-center gap-1">
                <GraduationCap className="w-3 h-3" /> {t("education")}
              </p>
              <p className="text-sm text-foreground leading-relaxed">{profile.education}</p>
            </div>
          )}

          {profile.interests.length > 0 && !hideProfile && (
            <div className="relative bg-background/40 border border-border rounded-xl p-3 mb-3">
              <p className="text-[10px] text-primary mb-2 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> {t("interests")}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {profile.interests.map(i => (
                  <span key={i} className="text-xs bg-gold-gradient text-primary-foreground font-medium px-2.5 py-1 rounded-full">
                    {i}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profile.skills.length > 0 && !hideProfile && (
            <div className="relative bg-background/40 border border-border rounded-xl p-3">
              <p className="text-[10px] text-primary mb-2 font-bold">{t("skills")}</p>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.map(s => (
                  <span key={s} className="text-xs bg-primary/10 border border-primary/30 text-primary px-2.5 py-1 rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  // ===== Edit Mode =====
  return (
    <div className="space-y-5 pb-24">
      <div className="bg-card-gradient border-gold rounded-3xl p-5 flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl text-gold-gradient">{t("editProfile")}</h2>
          <p className="text-xs text-muted-foreground mt-1">{t("editProfileDesc")}</p>
        </div>
        <Button variant="ghostGold" size="sm" onClick={cancelEdit}>{t("cancel")}</Button>
      </div>

      <Section title={t("personalInfo")} alignClass={alignClass}>
        <Field icon={UserIcon} label={t("fullName")}>
          <Input value={draft.full_name} onChange={e => setDraft({ ...draft, full_name: e.target.value })}
            className={`bg-input border-gold/30 ${alignClass}`} placeholder={t("yourNameHolder")} />
        </Field>
        <Field icon={MapPin} label={t("location")}>
          <Input value={draft.location} onChange={e => setDraft({ ...draft, location: e.target.value })}
            className={`bg-input border-gold/30 ${alignClass}`} placeholder={t("locationHolder")} />
        </Field>
        <Field icon={Mail} label={t("bio")}>
          <Textarea value={draft.bio} onChange={e => setDraft({ ...draft, bio: e.target.value })}
            className={`bg-input border-gold/30 ${alignClass} min-h-24`} placeholder={t("bioHolder")} />
        </Field>
      </Section>

      <Section title={t("education")} alignClass={alignClass}>
        <Field icon={GraduationCap} label={t("eduLabel")}>
          <Textarea value={draft.education} onChange={e => setDraft({ ...draft, education: e.target.value })}
            className={`bg-input border-gold/30 ${alignClass} min-h-20`}
            placeholder={t("eduHolder")} />
        </Field>
      </Section>

      <Section title={t("interests")} alignClass={alignClass}>
        <p className="text-xs text-muted-foreground -mt-2">{t("interestsHint")}</p>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map(i => {
            const active = draft.interests.includes(i);
            return (
              <button key={i} type="button" onClick={() => toggleInterest(i)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1 ${
                  active
                    ? "bg-gold-gradient text-primary-foreground border-primary shadow-gold"
                    : "bg-background/40 border-border text-foreground hover:border-primary/50"
                }`}>
                {active && <Check className="w-3 h-3" />}
                {i}
              </button>
            );
          })}
        </div>
      </Section>

      <Section title={t("skills")} alignClass={alignClass}>
        <div className="flex gap-2">
          <Input value={skillInput} onChange={e => setSkillInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSkill())}
            className={`bg-input border-gold/30 ${alignClass}`} placeholder={t("addSkill")} />
          <Button type="button" variant="gold" size="icon" onClick={addSkill}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {draft.skills.map(s => (
            <span key={s} className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/30 text-primary text-sm px-3 py-1.5 rounded-full">
              {s}
              <button onClick={() => setDraft({ ...draft, skills: draft.skills.filter(x => x !== s) })}>
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {draft.skills.length === 0 && <p className="text-sm text-muted-foreground">{t("noSkills")}</p>}
        </div>
      </Section>

      <Button variant="luxe" size="lg" className="w-full" onClick={save} disabled={saving}>
        <Save className={`w-4 h-4 ${isRtl ? "ml-2" : "mr-2"}`} />
        {saving ? t("saving") : t("save")}
      </Button>
    </div>
  );
};

const Section = ({ title, children, alignClass }: { title: string; children: React.ReactNode; alignClass: string }) => (
  <div className="bg-card-gradient border border-border rounded-2xl p-5 space-y-4">
    <h3 className={`font-display text-lg text-gold-gradient ${alignClass}`}>{title}</h3>
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
