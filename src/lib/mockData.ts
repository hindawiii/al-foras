export interface Scholarship {
  id: string;
  title: string;
  org: string;
  country: string;
  deadline: string;
  amount: string;
  field: string;
  level: string;
  verified: boolean;
  manualReview?: boolean;
  description: string;
  tags: string[];
}

export const SCHOLARSHIPS: Scholarship[] = [
  {
    id: "s1", title: "منحة تشيفنينغ البريطانية الكاملة", org: "الحكومة البريطانية", country: "المملكة المتحدة",
    deadline: "2026-11-01", amount: "تمويل كامل", field: "متعدد التخصصات", level: "ماجستير",
    verified: true, description: "منحة دراسية كاملة لقادة المستقبل تشمل الرسوم والإقامة والسفر.",
    tags: ["قيادة", "ماجستير", "أوروبا"]
  },
  {
    id: "s2", title: "منحة فولبرايت للدراسات العليا", org: "السفارة الأمريكية", country: "الولايات المتحدة",
    deadline: "2026-09-15", amount: "$45,000", field: "العلوم والهندسة", level: "ماجستير ودكتوراه",
    verified: true, description: "برنامج تبادل أكاديمي مرموق يدعم الدراسات العليا والبحث العلمي في أمريكا.",
    tags: ["بحث", "أمريكا", "دكتوراه"]
  },
  {
    id: "s3", title: "منحة DAAD الألمانية", org: "الهيئة الألمانية للتبادل", country: "ألمانيا",
    deadline: "2026-10-20", amount: "€934/شهر", field: "هندسة وتكنولوجيا", level: "ماجستير",
    verified: true, description: "منح شهرية مع تأمين صحي ودعم لتعلم اللغة الألمانية.",
    tags: ["ألمانيا", "هندسة"]
  },
  {
    id: "s4", title: "منحة الملك عبدالله للتميز العلمي", org: "جامعة كاوست", country: "المملكة العربية السعودية",
    deadline: "2026-12-01", amount: "تمويل كامل + راتب", field: "علوم وتكنولوجيا", level: "ماجستير ودكتوراه",
    verified: true, description: "تمويل كامل مع راتب شهري وسكن للدراسات العليا في كاوست.",
    tags: ["السعودية", "كاوست"]
  },
  {
    id: "s5", title: "برنامج إيراسموس موندوس", org: "الاتحاد الأوروبي", country: "أوروبا",
    deadline: "2026-01-10", amount: "€1,400/شهر", field: "متعدد التخصصات", level: "ماجستير مشترك",
    verified: false, manualReview: true,
    description: "برنامج ماجستير مشترك بين عدة جامعات أوروبية مع منحة شاملة.",
    tags: ["أوروبا", "تبادل"]
  },
  {
    id: "s6", title: "منحة جامعة طوكيو الدولية", org: "MEXT اليابان", country: "اليابان",
    deadline: "2026-06-30", amount: "¥147,000/شهر", field: "هندسة وعلوم", level: "بكالوريوس وماجستير",
    verified: true, description: "منحة حكومية يابانية كاملة تشمل الرسوم وتذاكر السفر والراتب.",
    tags: ["اليابان", "آسيا"]
  },
  {
    id: "s7", title: "منحة قطر للتنمية البشرية", org: "مؤسسة قطر", country: "قطر",
    deadline: "2026-08-15", amount: "تمويل كامل", field: "السياسات والإدارة", level: "ماجستير",
    verified: false, manualReview: true,
    description: "برنامج رائد لتنمية الكوادر القيادية في المنطقة العربية.",
    tags: ["قطر", "قيادة"]
  },
  {
    id: "s8", title: "منحة ETH زيورخ للهندسة", org: "ETH Zürich", country: "سويسرا",
    deadline: "2026-12-15", amount: "CHF 11,000/سنة", field: "هندسة وحاسوب", level: "ماجستير",
    verified: true, description: "منحة تميز للطلاب الدوليين المتفوقين في تخصصات الهندسة.",
    tags: ["سويسرا", "تميز"]
  },
];

export interface NewsItem {
  id: string; title: string; category: "global" | "local" | "sports" | "economy" | "weather";
  summary: string; time: string; source: string; image?: string; aiLink?: string;
}

export const NEWS: NewsItem[] = [
  { id: "n1", category: "economy", title: "ارتفاع الذهب لأعلى مستوياته خلال شهر", summary: "سجل سعر الذهب ارتفاعاً ملحوظاً مع تراجع الدولار الأمريكي.", time: "قبل ساعة", source: "رويترز",
    aiLink: "هذا الارتفاع قد يؤثر على المنح الممولة بالدولار — راجع منح فولبرايت." },
  { id: "n2", category: "global", title: "الاتحاد الأوروبي يوسع برامج المنح للطلاب الدوليين", summary: "إعلان عن زيادة مخصصات إيراسموس بنسبة 15% للعام القادم.", time: "قبل 3 ساعات", source: "EU News",
    aiLink: "فرصة جديدة! تحقق من برنامج إيراسموس موندوس في صفحة المنح." },
  { id: "n3", category: "local", title: "افتتاح مركز ابتكار جديد في الرياض", summary: "يستهدف المركز دعم رواد الأعمال والباحثين الشباب.", time: "قبل 5 ساعات", source: "العربية" },
  { id: "n4", category: "sports", title: "كأس العالم 2026: التحضيرات تدخل مرحلتها النهائية", summary: "ثلاث دول مستضيفة تستعد لاستقبال أكبر بطولة كروية.", time: "قبل 6 ساعات", source: "BBC" },
  { id: "n5", category: "weather", title: "موجة حر متوقعة على دول الخليج", summary: "هيئة الأرصاد تحذر من ارتفاع درجات الحرارة الأسبوع القادم.", time: "قبل ساعتين", source: "الأرصاد" },
  { id: "n6", category: "economy", title: "البنك المركزي الأوروبي يبقي أسعار الفائدة دون تغيير", summary: "قرار متوقع من قبل المحللين وسط استقرار التضخم.", time: "قبل 8 ساعات", source: "Bloomberg" },
];

export const CURRENCIES = [
  { code: "USD", name: "دولار أمريكي", rate: 1 },
  { code: "EUR", name: "يورو", rate: 0.92 },
  { code: "SAR", name: "ريال سعودي", rate: 3.75 },
  { code: "AED", name: "درهم إماراتي", rate: 3.67 },
  { code: "QTR", name: "ريال قطري", rate: 3.64 },
  { code: "SDG", name: "جنيه سوداني", rate: 600 },
  { code: "EGP", name: "جنيه مصري", rate: 49 },
  { code: "DZD", name: "دينار جزائري", rate: 134 },
  { code: "MAD", name: "درهم مغربي", rate: 9.95 },
  { code: "GOLD", name: "غرام ذهب 24", rate: 0.0144 },
];
