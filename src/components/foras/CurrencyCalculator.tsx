import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";
import { Calculator, X, ArrowLeftRight } from "lucide-react";
import { CURRENCIES } from "@/lib/mockData";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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

  const wakeUp = () => {
    setIdle(false);
    if (idleTimer.current) window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setIdle(true), 2500);
  };

  useEffect(() => {
    idleTimer.current = window.setTimeout(() => setIdle(true), 3000);
    return () => { if (idleTimer.current) window.clearTimeout(idleTimer.current); };
  }, []);

  const fromRate = CURRENCIES.find(c => c.code === from)?.rate ?? 1;
  const toRate = CURRENCIES.find(c => c.code === to)?.rate ?? 1;
  const result = ((parseFloat(amount) || 0) / fromRate * toRate).toLocaleString("en-US", { maximumFractionDigits: 4 });

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
        <SheetContent side="bottom" className="bg-card border-gold/30 rounded-t-3xl max-h-[85vh]">
          <SheetHeader>
            <SheetTitle className="text-gold-gradient font-display text-2xl text-right">
              حاسبة العملات والذهب الحية
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-5 pt-6">
            <div className="bg-card-gradient border-gold rounded-2xl p-5 space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">من</label>
                <div className="flex gap-2">
                  <Input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                    className="h-12 text-xl font-bold text-right bg-input border-gold/30" dir="ltr" />
                  <Select value={from} onValueChange={setFrom}>
                    <SelectTrigger className="w-32 h-12 bg-input border-gold/30 font-bold"><SelectValue /></SelectTrigger>
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
                <Button variant="ghostGold" size="icon" onClick={() => { const t = from; setFrom(to); setTo(t); }}>
                  <ArrowLeftRight className="w-4 h-4" />
                </Button>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-2 block">إلى</label>
                <div className="flex gap-2">
                  <div className="flex-1 h-12 px-3 rounded-md bg-input border border-primary/40 flex items-center justify-end">
                    <span className="text-2xl font-bold text-gold-gradient" dir="ltr">{result}</span>
                  </div>
                  <Select value={to} onValueChange={setTo}>
                    <SelectTrigger className="w-32 h-12 bg-input border-gold/30 font-bold"><SelectValue /></SelectTrigger>
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

            <div className="text-xs text-muted-foreground text-center">
              الأسعار للعرض التوضيحي. سيتم ربطها لاحقاً بمصدر بيانات حي.
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
