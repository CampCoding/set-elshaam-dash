// src/constants/userOptions.js

// ============ الدول (أسماء) ============
export const COUNTRIES = [
  { value: "egypt", label: "مصر" },
  { value: "saudi_arabia", label: "السعودية" },
  { value: "uae", label: "الإمارات" },
  { value: "kuwait", label: "الكويت" },
  { value: "qatar", label: "قطر" },
  { value: "oman", label: "عُمان" },
  { value: "bahrain", label: "البحرين" },
  { value: "jordan", label: "الأردن" },
  { value: "syria", label: "سوريا" },
  { value: "lebanon", label: "لبنان" },
  { value: "palestine", label: "فلسطين" },
  { value: "iraq", label: "العراق" },
  { value: "yemen", label: "اليمن" },
  { value: "libya", label: "ليبيا" },
  { value: "tunisia", label: "تونس" },
  { value: "algeria", label: "الجزائر" },
  { value: "morocco", label: "المغرب" },
  { value: "sudan", label: "السودان" },
  { value: "somalia", label: "الصومال" },
  { value: "mauritania", label: "موريتانيا" },
  { value: "finland", label: "فنلندا" },
  { value: "sweden", label: "السويد" },
  { value: "norway", label: "النرويج" },
  { value: "germany", label: "ألمانيا" },
  { value: "france", label: "فرنسا" },
  { value: "uk", label: "بريطانيا" },
  { value: "usa", label: "أمريكا" },
  { value: "canada", label: "كندا" },
  { value: "turkey", label: "تركيا" },
];

// ============ الجنسيات (صفات) ============
export const NATIONALITIES = [
  { value: "egyptian", label: "مصري" },
  { value: "saudi", label: "سعودي" },
  { value: "emirati", label: "إماراتي" },
  { value: "kuwaiti", label: "كويتي" },
  { value: "qatari", label: "قطري" },
  { value: "omani", label: "عُماني" },
  { value: "bahraini", label: "بحريني" },
  { value: "jordanian", label: "أردني" },
  { value: "syrian", label: "سوري" },
  { value: "lebanese", label: "لبناني" },
  { value: "palestinian", label: "فلسطيني" },
  { value: "iraqi", label: "عراقي" },
  { value: "yemeni", label: "يمني" },
  { value: "libyan", label: "ليبي" },
  { value: "tunisian", label: "تونسي" },
  { value: "algerian", label: "جزائري" },
  { value: "moroccan", label: "مغربي" },
  { value: "sudanese", label: "سوداني" },
  { value: "somali", label: "صومالي" },
  { value: "mauritanian", label: "موريتاني" },
  { value: "finnish", label: "فنلندي" },
  { value: "swedish", label: "سويدي" },
  { value: "norwegian", label: "نرويجي" },
  { value: "german", label: "ألماني" },
  { value: "french", label: "فرنسي" },
  { value: "british", label: "بريطاني" },
  { value: "american", label: "أمريكي" },
  { value: "canadian", label: "كندي" },
  { value: "turkish", label: "تركي" },
];

// ============ الديانات ============
export const RELIGIONS = [
  { value: "muslim", label: "مسلم" },
  { value: "christian", label: "مسيحي" },
  { value: "jewish", label: "يهودي" },
  { value: "other", label: "أخرى" },
];

// ============ الجنس ============
export const GENDERS = [
  { value: "male", label: "ذكر" },
  { value: "female", label: "أنثى" },
];

// ============ الحالة الاجتماعية ============
export const MARITAL_STATUS = [
  { value: "single", label: "أعزب/عزباء" },
  { value: "married", label: "متزوج/ة" },
  { value: "divorced", label: "مطلق/ة" },
  { value: "widowed", label: "أرمل/ة" },
  { value: "separated", label: "منفصل/ة" },
];

// ============ نوع الإقامة ============
export const RESIDENCY_TYPES = [
  { value: "temporary", label: "إقامة مؤقتة" },
  { value: "permanent", label: "إقامة دائمة" },
  { value: "citizen", label: "مواطن (جنسية)" },
  { value: "none", label: "بدون إقامة" },
];

// ============ المستوى التعليمي ============
export const EDUCATION_LEVELS = [
  { value: "primary", label: "ابتدائي" },
  { value: "middle", label: "إعدادي" },
  { value: "high_school", label: "ثانوي" },
  { value: "diploma", label: "دبلوم" },
  { value: "bachelor", label: "بكالوريوس" },
  { value: "master", label: "ماجستير" },
  { value: "doctorate", label: "دكتوراه" },
  { value: "other", label: "أخرى" },
];

// ============ مصدر الدخل ============
export const INCOME_SOURCES = [
  { value: "government", label: "من الحكومة" },
  { value: "private_work", label: "عمل خاص" },
  { value: "business", label: "تجارة" },
  { value: "freelance", label: "عمل حر" },
  { value: "unemployed", label: "بدون دخل" },
];

// ============ درجة الالتزام الديني ============
export const RELIGION_COMMITMENT = [
  { value: "committed", label: "ملتزم" },
  { value: "moderate", label: "متوسط الالتزام" },
  { value: "sometimes", label: "أحياناً" },
  { value: "not_committed", label: "غير ملتزم" },
];

// ============ نعم/لا ============
export const YES_NO_OPTIONS = [
  { value: 1, label: "نعم" },
  { value: 0, label: "لا" },
];

// ============ الفئات العمرية ============
export const AGE_RANGES = [
  { value: "18-22", label: "18-22" },
  { value: "23-27", label: "23-27" },
  { value: "28-32", label: "28-32" },
  { value: "33-37", label: "33-37" },
  { value: "38-42", label: "38-42" },
  { value: "43-47", label: "43-47" },
  { value: "48-52", label: "48-52" },
  { value: "53-60", label: "53-60" },
  { value: "60+", label: "60+" },
];

// ============ ألوان البشرة ============
export const SKIN_COLORS = [
  { value: "white", label: "أبيض" },
  { value: "wheat", label: "قمحي" },
  { value: "brown", label: "أسمر" },
  { value: "dark", label: "داكن" },
];

// ============ ألوان العيون ============
export const EYE_COLORS = [
  { value: "black", label: "أسود" },
  { value: "brown", label: "بني" },
  { value: "hazel", label: "عسلي" },
  { value: "green", label: "أخضر" },
  { value: "blue", label: "أزرق" },
  { value: "gray", label: "رمادي" },
];

// ============ أنواع الشعر ============
export const HAIR_TYPES = [
  { value: "straight", label: "ناعم" },
  { value: "wavy", label: "مموج" },
  { value: "curly", label: "مجعد" },
  { value: "bald", label: "أصلع" },
];

// ============ Helper Functions ============
export const getLabelByValue = (options, value) => {
  const option = options.find((opt) => opt.value === value);
  return option?.label || value || "غير محدد";
};

export const getValueByLabel = (options, label) => {
  const option = options.find((opt) => opt.label === label);
  return option?.value || label;
};
