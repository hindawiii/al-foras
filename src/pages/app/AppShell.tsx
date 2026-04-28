import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Newspaper, Bookmark, User, Settings as SettingsIcon, Bell } from "lucide-react";
import { BrandMark } from "@/components/foras/Logo";
import { CurrencyCalculator } from "@/components/foras/CurrencyCalculator";
import { SettingsSheet } from "@/components/foras/SettingsSheet";
import { NotificationsSheet } from "@/components/foras/NotificationsSheet";
import { ScholarshipsTab } from "./ScholarshipsTab";
import { NewsTab } from "./NewsTab";
import { ApplicationsTab } from "./ApplicationsTab";
import { ProfileTab } from "./ProfileTab";

const tabs = [
  { id: "scholarships" as const, label: "المنح والفرص", icon: Award, comp: ScholarshipsTab },
  { id: "news" as const, label: "الأخبار والاقتصاد", icon: Newspaper, comp: NewsTab },
  { id: "applications" as const, label: "طلباتي", icon: Bookmark, comp: ApplicationsTab },
  { id: "profile" as const, label: "الملف الشخصي", icon: User, comp: ProfileTab },
];

export const AppShell = () => {
  const [tab, setTab] = useState<typeof tabs[number]["id"]>("scholarships");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const Active = tabs.find(t => t.id === tab)!.comp;

  return (
    <div className="min-h-screen bg-background relative">
      {/* Top bar */}
      <header className="sticky top-0 z-30 glass border-b border-primary/10">
        <div className="max-w-2xl mx-auto px-5 py-4 flex justify-between items-center">
          <BrandMark />
          <div className="flex items-center gap-2">
            <button onClick={() => setNotifOpen(true)}
              className="relative w-11 h-11 rounded-xl bg-card border border-primary/20 hover:border-primary hover:bg-primary/10 transition-all flex items-center justify-center"
              aria-label="الإشعارات">
              <Bell className="w-5 h-5 text-primary" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive ring-2 ring-card" />
            </button>
            <button onClick={() => setSettingsOpen(true)}
              className="w-11 h-11 rounded-xl bg-card border border-primary/20 hover:border-primary hover:bg-primary/10 transition-all flex items-center justify-center"
              aria-label="الإعدادات">
              <SettingsIcon className="w-5 h-5 text-primary" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-5">
        <AnimatePresence mode="wait">
          <motion.div key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}>
            <Active />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 glass border-t border-primary/15">
        <div className="max-w-2xl mx-auto grid grid-cols-4">
          {tabs.map(t => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="relative flex flex-col items-center gap-1 py-3 transition-colors">
                {active && (
                  <motion.div layoutId="activeTab"
                    className="absolute top-0 inset-x-4 h-0.5 bg-gold-gradient rounded-full" />
                )}
                <Icon className={`w-5 h-5 transition-colors ${active ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-[10px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <CurrencyCalculator />
      <SettingsSheet open={settingsOpen} onOpenChange={setSettingsOpen} />
      <NotificationsSheet open={notifOpen} onOpenChange={setNotifOpen} />
    </div>
  );
};
