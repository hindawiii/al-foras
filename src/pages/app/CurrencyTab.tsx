import { motion } from "framer-motion";
import { RefreshCw, TrendingUp, TrendingDown, Coins } from "lucide-react";
import { useLiveRates, enrichCurrencies } from "@/hooks/useLiveRates";

export const CurrencyTab = () => {
  const { rates, updatedAt, loading, error } = useLiveRates();
  const list = enrichCurrencies(rates);

  return (
    <div className="space-y-4 pb-32">
      <div className="glass rounded-2xl p-4 flex items-center justify-between">
        <div className="text-right">
          <h2 className="font-display text-lg text-gold-gradient flex items-center gap-2 justify-end">
            <Coins className="w-5 h-5 text-primary" />
            مركز العملات الحي
          </h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {updatedAt
              ? `آخر تحديث: ${updatedAt.toLocaleTimeString("ar-EG")}`
              : "جارٍ تحميل الأسعار..."}
          </p>
        </div>
        <RefreshCw className={`w-4 h-4 text-primary ${loading ? "animate-spin" : ""}`} />
      </div>

      {error && (
        <div className="text-xs text-review bg-review/10 border border-review/30 rounded-xl p-2 text-center">
          {error}
        </div>
      )}

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
              <p className="text-[10px] text-muted-foreground truncate">{c.name}</p>
              <div className="mt-2 pt-2 border-t border-border/40">
                <p className="text-[10px] text-muted-foreground">السعر مقابل USD</p>
                <p className="font-display text-base text-foreground" dir="ltr">
                  {c.liveRate.toLocaleString("en-US", { maximumFractionDigits: 4 })}
                  <span className="text-[10px] text-muted-foreground mr-1">{c.symbol}</span>
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="text-[11px] text-muted-foreground text-center">
        البيانات من open.er-api.com — تُحدَّث تلقائياً كل دقيقة.
      </p>
    </div>
  );
};