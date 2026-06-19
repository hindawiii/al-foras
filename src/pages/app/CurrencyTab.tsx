import { motion } from "framer-motion";
import { RefreshCw, TrendingUp, TrendingDown, Coins, Gem, Bitcoin } from "lucide-react";
import { useLiveRates, enrichCurrencies } from "@/hooks/useLiveRates";
import { useCryptoGold } from "@/hooks/useCryptoGold";
import { FinanceToolsHeader } from "@/components/foras/FinanceToolsHeader";
import { useLanguage } from "@/contexts/LanguageContext";

export const CurrencyTab = () => {
  const { t, lang, dir } = useLanguage();
  const isRtl = dir === "rtl";
  const { rates, updatedAt, loading, error } = useLiveRates();
  const { crypto, gold, goldPricePerGram, updatedAt: cgUpdatedAt, loading: cgLoading } = useCryptoGold();
  const list = enrichCurrencies(rates);
  const lastUpdated = [updatedAt, cgUpdatedAt].filter(Boolean).sort((a, b) => (b!.getTime() - a!.getTime()))[0] ?? null;

  return (
    <div className="space-y-4 pb-32" dir={dir}>
      <FinanceToolsHeader />

      {/* Hero header — Currency & Gold Hub */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-card-gradient p-5 shadow-luxe">
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-primary/15 rounded-full blur-3xl" />
        <div className="relative flex items-start justify-between gap-3">
          <div className={`flex-1 ${isRtl ? "text-right" : "text-left"}`}>
            <h1 className={`font-display text-2xl text-gold-gradient flex items-center gap-2 ${isRtl ? "justify-end" : "justify-start"}`}>
              <Coins className="w-6 h-6 text-primary" />
              {t("currencyHubTitle")}
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              {t("currencyHubSubtitle")}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1.5">
              {t("updatedAtLabel")}:{" "}
              {lastUpdated
                ? lastUpdated.toLocaleTimeString(lang === "ar" ? "ar-EG" : "en-US")
                : "..."}
            </p>
          </div>
          <RefreshCw className={`w-4 h-4 text-primary mt-1 ${loading || cgLoading ? "animate-spin" : ""}`} />
        </div>

        {/* Inline gold mini-card */}
        {gold && (
          <div className="relative mt-4 flex items-center justify-between rounded-2xl bg-background/40 border border-primary/20 px-4 py-3">
            <div className="flex items-center gap-2">
              <Gem className="w-4 h-4 text-primary" />
              <div className={isRtl ? "text-right" : "text-left"}>
                <p className="text-[11px] text-muted-foreground">{t("goldPrice24K")}</p>
                <p className="text-[10px] text-muted-foreground" dir="ltr">
                  {goldPricePerGram ? `${goldPricePerGram.toFixed(2)} USD / g` : "..."}
                </p>
              </div>
            </div>
            <div className="text-left" dir="ltr">
              <p className="font-display text-lg text-gold-gradient">
                {gold.price.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                <span className="text-[10px] text-muted-foreground ml-1">USD/oz</span>
              </p>
              <p className={`text-[10px] flex items-center gap-1 justify-end ${gold.change24h >= 0 ? "text-success" : "text-destructive"}`}>
                {gold.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {gold.change24h.toFixed(2)}%
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="text-xs text-review bg-review/10 border border-review/30 rounded-xl p-2 text-center">
          {error}
        </div>
      )}

      {/* Fiat grid */}
      <h2 className={`font-display text-base text-foreground/90 flex items-center gap-2 pt-1 ${isRtl ? "justify-end" : "justify-start"}`}>
        <Coins className="w-4 h-4 text-primary" />
        {t("fiatCurrencies")}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {list.map((c, i) => {
          const trend = (c.liveRate - c.rate) / c.rate;
          const Up = trend >= 0;
          return (
            <motion.div key={c.code}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card-gradient border border-border hover:border-primary/40 rounded-2xl p-3 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl leading-none">{c.flag}</span>
                <span className={`text-[10px] flex items-center gap-0.5 ${Up ? "text-success" : "text-destructive"}`}>
                  {Up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {(trend * 100).toFixed(2)}%
                </span>
              </div>
              <p className="font-bold text-primary text-sm">{c.code}</p>
              <p className="text-[10px] text-muted-foreground truncate">{lang === "ar" ? c.name : (c.nameEn || c.name)}</p>
              <div className="mt-2 pt-2 border-t border-border/40">
                <p className="text-[10px] text-muted-foreground">{t("priceVsUSD")}</p>
                <p className="font-display text-base text-foreground" dir="ltr">
                  {c.liveRate.toLocaleString("en-US", { maximumFractionDigits: 4 })}
                  <span className="text-[10px] text-muted-foreground mr-1">{c.symbol}</span>
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Crypto grid */}
      <h2 className={`font-display text-base text-foreground/90 flex items-center gap-2 pt-3 ${isRtl ? "justify-end" : "justify-start"}`}>
        <Bitcoin className="w-4 h-4 text-primary" />
        {t("digitalCurrencies")}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {crypto.map((a, i) => {
          const Up = a.change24h >= 0;
          return (
            <motion.div key={a.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card-gradient border border-border hover:border-primary/40 rounded-2xl p-3 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl leading-none text-primary font-bold">{a.icon}</span>
                <span className={`text-[10px] flex items-center gap-0.5 ${Up ? "text-success" : "text-destructive"}`}>
                  {Up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {a.change24h.toFixed(2)}%
                </span>
              </div>
              <p className="font-bold text-primary text-sm">{a.symbol}</p>
              <p className="text-[10px] text-muted-foreground truncate">{lang === "ar" ? a.nameAr : a.name}</p>
              <div className="mt-2 pt-2 border-t border-border/40">
                <p className="text-[10px] text-muted-foreground">{t("livePrice")}</p>
                <p className="font-display text-base text-foreground" dir="ltr">
                  {a.price > 1
                    ? a.price.toLocaleString("en-US", { maximumFractionDigits: 2 })
                    : a.price.toFixed(4)}
                  <span className="text-[10px] text-muted-foreground mr-1">USD</span>
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="text-[11px] text-muted-foreground text-center">
        {t("dataSourcesNote")}
      </p>
    </div>
  );
};