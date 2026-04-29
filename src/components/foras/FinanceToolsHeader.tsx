import { useState } from "react";
import { ArrowLeftRight, Coins, Gem } from "lucide-react";
import { CURRENCIES } from "@/lib/mockData";
import { useLiveRates } from "@/hooks/useLiveRates";
import { useCryptoGold, GOLD_KARATS } from "@/hooks/useCryptoGold";
import { useSettings } from "@/contexts/SettingsContext";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const KARATS_DISPLAY = ["24K", "21K", "18K"];

export const FinanceToolsHeader = () => {
  const { rates } = useLiveRates();
  const { goldPricePerGram } = useCryptoGold();
  const { localCurrency, setLocalCurrency } = useSettings();

  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState(localCurrency || "SAR");
  const [amount, setAmount] = useState("100");
  const [grams, setGrams] = useState("10");

  const fromRate = rates[from] ?? 1;
  const toRate = rates[to] ?? 1;
  const result = ((parseFloat(amount) || 0) / fromRate * toRate)
    .toLocaleString("en-US", { maximumFractionDigits: 4 });

  // Gold in local currency
  const localRate = rates[localCurrency] ?? 1;
  const localCur = CURRENCIES.find(c => c.code === localCurrency);
  const gramUSD24 = goldPricePerGram ?? 0;
  const w = parseFloat(grams) || 0;

  return (
    <div className="sticky top-[72px] z-20 -mx-1 px-1 pb-2 bg-background/85 backdrop-blur-xl border-b border-primary/10">
      <div className="rounded-2xl border border-primary/30 bg-card-gradient p-3 shadow-luxe" dir="rtl">
        <Tabs defaultValue="currency">
          <TabsList className="grid grid-cols-2 w-full bg-input border border-primary/20 h-9">
            <TabsTrigger value="currency" className="data-[state=active]:bg-gold-gradient data-[state=active]:text-primary-foreground gap-1.5 text-xs h-7">
              <Coins className="w-3.5 h-3.5" /> محول العملات
            </TabsTrigger>
            <TabsTrigger value="gold" className="data-[state=active]:bg-gold-gradient data-[state=active]:text-primary-foreground gap-1.5 text-xs h-7">
              <Gem className="w-3.5 h-3.5" /> حاسبة الذهب
            </TabsTrigger>
          </TabsList>

          {/* Currency converter */}
          <TabsContent value="currency" className="pt-3 space-y-2">
            <div className="flex gap-1.5 items-center">
              <Input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                className="h-9 text-sm font-bold text-right bg-input border-primary/20" dir="ltr" />
              <Select value={from} onValueChange={setFrom}>
                <SelectTrigger className="w-24 h-9 bg-input border-primary/20 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover border-primary/30">
                  {CURRENCIES.filter(c => c.code !== "GOLD").map(c => (
                    <SelectItem key={c.code} value={c.code}>{c.flag} {c.code}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="ghostGold" size="icon" className="h-9 w-9 flex-shrink-0"
                onClick={() => { const t = from; setFrom(to); setTo(t); }}>
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </Button>
              <Select value={to} onValueChange={setTo}>
                <SelectTrigger className="w-24 h-9 bg-input border-primary/20 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover border-primary/30">
                  {CURRENCIES.filter(c => c.code !== "GOLD").map(c => (
                    <SelectItem key={c.code} value={c.code}>{c.flag} {c.code}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="bg-background/40 border border-primary/20 rounded-lg px-3 py-2 flex items-baseline justify-between gap-2">
              <span className="text-[10px] text-muted-foreground">النتيجة</span>
              <span className="text-base font-bold text-gold-gradient" dir="ltr">{result} <span className="text-[10px] text-muted-foreground">{to}</span></span>
            </div>
          </TabsContent>

          {/* Gold calculator */}
          <TabsContent value="gold" className="pt-3 space-y-2">
            <div className="flex gap-1.5 items-center">
              <Input type="number" value={grams} onChange={e => setGrams(e.target.value)}
                placeholder="الوزن (غ)"
                className="h-9 text-sm font-bold text-right bg-input border-primary/20" dir="ltr" />
              <Select value={localCurrency} onValueChange={setLocalCurrency}>
                <SelectTrigger className="w-28 h-9 bg-input border-primary/20 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover border-primary/30">
                  {CURRENCIES.filter(c => c.code !== "GOLD").map(c => (
                    <SelectItem key={c.code} value={c.code}>{c.flag} {c.code}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {KARATS_DISPLAY.map(k => {
                const factor = GOLD_KARATS.find(g => g.label === k)?.factor ?? 1;
                const valLocal = w * gramUSD24 * factor * localRate;
                return (
                  <div key={k} className="bg-background/40 border border-primary/20 rounded-lg px-2 py-1.5 text-center">
                    <p className="text-[10px] text-primary font-bold">{k}</p>
                    <p className="text-[11px] font-bold text-foreground" dir="ltr">
                      {valLocal > 0 ? valLocal.toLocaleString("en-US", { maximumFractionDigits: 0 }) : "—"}
                    </p>
                    <p className="text-[9px] text-muted-foreground">{localCur?.symbol ?? localCurrency}</p>
                  </div>
                );
              })}
            </div>
            <p className="text-[9px] text-muted-foreground text-center">
              السعر المحلي للذهب — مرتبط بسعر صرف {localCur?.name ?? localCurrency} الحي
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};