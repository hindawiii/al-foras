import { motion } from "framer-motion";

export const Logo = ({ size = 64 }: { size?: number }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: "spring", duration: 0.8 }}
    className="relative inline-flex items-center justify-center"
    style={{ width: size, height: size }}
  >
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(43 80% 55%)" />
          <stop offset="50%" stopColor="hsl(43 74% 38%)" />
          <stop offset="100%" stopColor="hsl(38 65% 28%)" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="none" stroke="url(#goldGrad)" strokeWidth="2" />
      <circle cx="50" cy="50" r="38" fill="none" stroke="url(#goldGrad)" strokeWidth="0.5" opacity="0.5" />
      <path d="M30 70 L50 25 L70 70 M37 55 L63 55" stroke="url(#goldGrad)" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </motion.div>
);

export const BrandMark = () => (
  <div className="flex items-center gap-3">
    <Logo size={42} />
    <div className="flex flex-col leading-none">
      <span className="font-display text-2xl text-gold-gradient font-bold">الفُرَص</span>
      <span className="text-[10px] tracking-[0.3em] text-primary/70 mt-1">AL-FORAS</span>
    </div>
  </div>
);
