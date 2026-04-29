import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";
import { Calculator, ArrowLeftRight, Coins, Gem } from "lucide-react";
import { CURRENCIES } from "@/lib/mockData";
import { useLiveRates } from "@/hooks/useLiveRates";
import { useCryptoGold, GOLD_KARATS } from "@/hooks/useCryptoGold";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const CurrencyCalculator = () => {
  const [open, setOpen] = useState(false);
  const [idle, setIdle] = useState(true);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("SAR");
  const [amount, setAmount] = useState("100");
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const dragStart = useRef({ x: 0, y: 0 });
  const moved = useRef(false);
  const idleTimer = useRef<number | null>(null);
  const { rates, updatedAt } = useLiveRates();
  const { goldPricePerGram, updatedAt: goldUpdatedAt } = useCryptoGold();
  const [grams, setGrams] = useState("10");
  const [karat, setKarat] = useState("21K");

  const wakeUp = () => {
    setIdle(false);
    if (idleTimer.current) window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setIdle(true), 2500);
  };

  useEffect(() => {
    idleTimer.current = window.setTimeout(() => setIdle(true), 3000);
    return () => { if (idleTimer.current) window.clearTimeout(idleTimer.current); };
  }, []);

  const fromRate = rates[from] ?? CURRENCIES.find(c => c.code === from)?.rate ?? 1;
  const toRate = rates[to] ?? CURRENCIES.find(c => c.code === to)?.rate ?? 1;
  const result = ((parseFloat(amount) || 0) / fromRate * toRate).toLocaleString("en-US", { maximumFractionDigits: 4 });

  const karatFactor = GOLD_KARATS.find(k => k.label === karat)?.factor ?? 1;
  const gramValue = (parseFloat(grams) || 0) * (goldPricePerGram ?? 0) * karatFactor;
  const goldResult = gramValue.toLocaleString("en-US", { maximumFractionDigits: 2 });

  return (
    <>
      <motion.div
        drag
        dragMomentum={false}
        dragConstraints={{ left: -window.innerWidth + 80, right: 0, top: -window.innerHeight + 200, bottom: 0 }}
        style={{ x, y }}
        onDragStart={() => { moved.current = false; dragStart.current = { x: x.get(), y: y.get() }; wakeUp(); }}
        onDrag={() => {
          if (Math.abs(x.get() - dragStart.current.x) > 5 || Math.abs(y.get() - dragStart.current.y) > 5) moved.current = true;
        }}
        onClick={() => { if (!moved.current) setOpen(true); }}
        onHoverStart={wakeUp}
        onTapStart={wakeUp}
        animate={{ opacity: idle ? 0.45 : 1, scale: idle ? 0.85 : 1 }}
        transition={{ duration: 0.3 }}
        initial={{ x: 0, y: 0 }}
        whileDrag={{ scale: 1.1 }}
        whileHover={{ scale: 1.05 }}
        className="fixed bottom-24 left-4 z-40 cursor-grab active:cursor-grabbing"
      >
        {idle ? (
          <div className="relative">
            <div className="relative bg-gold-gradient rounded-full w-12 h-12 shadow-gold flex items-center justify-center border border-primary-glow/40">
              <Calculator className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute inset-0 bg-gold-gradient rounded-2xl blur-xl opacity-60 animate-pulse" />
            <div className="relative bg-gold-gradient rounded-2xl p-2.5 shadow-gold flex items-center gap-2 border border-primary-glow/40">
              <div className="w-9 h-9 rounded-xl bg-background/30 flex items-center justify-center">
                <Calculator className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="pr-1 pl-2">
                <p className="text-[9px] text-primary-foreground/70 leading-none mb-0.5">حاسبة</p>
                <p className="text-[11px] font-bold text-primary-foreground leading-none whitespace-nowrap">العملات والذهب الحية</p>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="bg-card border-gold/30 rounded-t-3xl max-h-[85vh] overflow-y-auto p-4">
          <SheetHeader className="pb-1">
            <SheetTitle className="text-gold-gradient font-display text-lg text-right">
              حاسبة العملات والذهب الحية
            </SheetTitle>
          </SheetHeader>

          <Tabs defaultValue="currency" className="pt-3" dir="rtl">
            <TabsList className="grid grid-cols-2 w-full bg-input border border-gold/30 h-9">
              <TabsTrigger value="currency" className="data-[state=active]:bg-gold-gradient data-[state=active]:text-primary-foreground gap-1.5 text-xs h-7">
                <Coins className="w-3.5 h-3.5" /> العملات
              </TabsTrigger>
              <TabsTrigger value="gold" className="data-[state=active]:bg-gold-gradient data-[state=active]:text-primary-foreground gap-1.5 text-xs h-7">
                <Gem className="w-3.5 h-3.5" /> الذهب
              </TabsTrigger>
            </TabsList>

            <TabsContent value="currency" className="space-y-2 pt-3">
            <div className="bg-card-gradient border-gold rounded-xl p-3 space-y-2">
              <div>
                <label className="text-[10px] text-muted-foreground mb-1 block">من</label>
                <div className="flex gap-1.5">
                  <Input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                    className="h-9 text-base font-bold text-right bg-input border-gold/30" dir="ltr" />
                  <Select value={from} onValueChange={setFrom}>
                    <SelectTrigger className="w-24 h-9 bg-input border-gold/30 font-bold text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-popover border-gold/30">
                      {CURRENCIES.map(c => (
                        <SelectItem key={c.code} value={c.code}>
                          <span className="font-bold text-primary mr-1">{c.code}</span>
                          <span className="text-xs text-muted-foreground">{c.name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-center">
                <Button variant="ghostGold" size="icon" className="h-7 w-7"
                  onClick={() => { const t = from; setFrom(to); setTo(t); }}>
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                </Button>
              </div>

              <div>
                <label className="text-[10px] text-muted-foreground mb-1 block">إلى</label>
                <div className="flex gap-1.5">
                  <div className="flex-1 h-9 px-2 rounded-md bg-input border border-primary/40 flex items-center justify-end">
                    <span className="text-base font-bold text-gold-gradient" dir="ltr">{result}</span>
                  </div>
                  <Select value={to} onValueChange={setTo}>
                    <SelectTrigger className="w-24 h-9 bg-input border-gold/30 font-bold text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-popover border-gold/30">
                      {CURRENCIES.map(c => (
                        <SelectItem key={c.code} value={c.code}>
                          <span className="font-bold text-primary mr-1">{c.code}</span>
                          <span className="text-xs text-muted-foreground">{c.name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-muted-foreground text-center">
              {updatedAt
                ? `أسعار حية — آخر تحديث ${updatedAt.toLocaleTimeString("ar-EG")}`
                : "جارٍ جلب أحدث الأسعار..."}
            </div>
            </TabsContent>

            <TabsContent value="gold" className="space-y-2 pt-3">
              <div className="bg-card-gradient border-gold rounded-xl p-3 space-y-2">
                <div className="flex gap-1.5">
                  <div className="flex-1">
                    <label className="text-[10px] text-muted-foreground mb-1 block">الوزن (غ)</label>
                    <Input type="number" value={grams} onChange={e => setGrams(e.target.value)}
                      className="h-9 text-base font-bold text-right bg-input border-gold/30" dir="ltr" />
                  </div>
                  <div className="w-24">
                  <label className="text-[10px] text-muted-foreground mb-1 block">العيار</label>
                  <Select value={karat} onValueChange={setKarat}>
                    <SelectTrigger className="h-9 bg-input border-gold/30 font-bold text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-popover border-gold/30">
                      {GOLD_KARATS.map(k => (
                        <SelectItem key={k.label} value={k.label}>
                          <span className="font-bold text-primary">{k.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  </div>
                </div>
                <div className="pt-2 border-t border-border/40">
                  <p className="text-[10px] text-muted-foreground mb-0.5">القيمة التقديرية</p>
                  <p className="text-xl font-bold text-gold-gradient" dir="ltr">
                    {goldResult} <span className="text-xs text-muted-foreground">USD</span>
                  </p>
                  {goldPricePerGram && (
                    <p className="text-[10px] text-muted-foreground mt-1" dir="ltr">
                      Base: {goldPricePerGram.toFixed(2)} USD / g (24K)
                    </p>
                  )}
                </div>
              </div>
              <div className="text-[10px] text-muted-foreground text-center">
                {goldUpdatedAt
                  ? `سعر الذهب الحي — آخر تحديث ${goldUpdatedAt.toLocaleTimeString("ar-EG")}`
                  : "جارٍ جلب سعر الذهب..."}
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </>
  );
};
