import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Brain, BadgeCheck, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/foras/Logo";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { SCHOLARSHIPS } from "@/lib/mockData";

const Landing = () => {
  const { t, dir, lang, toggleLang } = useLanguage();
  const isRtl = dir === "rtl";
  const nav = useNavigate();
  const { user } = useAuth();

  const goApp = () => nav(user ? "/app" : "/auth");
  const featured = SCHOLARSHIPS.slice(0, 4);

  const features = [
    { icon: Brain, title: t("landingFeature1Title"), body: t("landingFeature1Body") },
    { icon: ShieldCheck, title: t("landingFeature2Title"), body: t("landingFeature2Body") },
    { icon: Sparkles, title: t("landingFeature3Title"), body: t("landingFeature3Body") },
  ];

  return (
    <div dir={dir} className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Ambient gold glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-primary/15 blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-5 sm:px-10 py-5">
        <BrandMark />
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLang}
            className="text-xs font-bold text-primary bg-primary/10 border border-primary/30 px-3 py-1.5 rounded-full hover:bg-primary/20 transition"
          >
            {lang === "ar" ? "EN" : "العربية"}
          </button>
          <Button variant="ghostGold" size="sm" onClick={goApp}>
            {t("landingCtaSecondary")}
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 px-5 sm:px-10 pt-10 pb-20 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass border-primary/30 text-xs tracking-[0.25em] text-primary uppercase mb-6">
            {t("landingTagline")}
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold leading-tight">
            <span className="text-gold-gradient">{t("landingHeadline")}</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("landingSubheadline")}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="luxe" size="xl" onClick={goApp} className="min-w-[260px]">
              {t("landingCtaPrimary")}
              <ArrowRight className={`w-5 h-5 ${isRtl ? "rotate-180" : ""}`} />
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-5 sm:px-10 py-16 max-w-6xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-center text-gold-gradient mb-10">
          {t("landingFeaturesTitle")}
        </h2>
        <div className="grid sm:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 border-primary/25 shadow-luxe"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Latest scholarships preview */}
      <section className="relative z-10 px-5 sm:px-10 py-16 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-gold-gradient">
            {t("landingScholarshipsTitle")}
          </h2>
          <p className="text-muted-foreground mt-2">{t("landingScholarshipsSubtitle")}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {featured.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-5 border-primary/25 cursor-pointer transition-all hover:border-primary/50"
              onClick={goApp}
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">{s.flag}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {s.verified && <BadgeCheck className="w-4 h-4 text-[hsl(var(--verified))]" />}
                    <span className="text-[10px] uppercase tracking-wider text-primary/80">{s.org}</span>
                  </div>
                  <h3 className="font-bold text-foreground line-clamp-1">{s.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.description}</p>
                  <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3 text-primary" />{s.country}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3 text-primary" />{s.deadline}</span>
                    <span className="text-primary font-semibold">{s.amount}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button variant="luxe" size="lg" onClick={goApp}>
            {t("landingViewAll")}
            <ArrowRight className={`w-5 h-5 ${isRtl ? "rotate-180" : ""}`} />
          </Button>
        </div>
      </section>

      <footer className="relative z-10 px-5 py-8 text-center text-xs text-muted-foreground border-t border-primary/15">
        {t("landingFooter")}
      </footer>
    </div>
  );
};

export default Landing;
