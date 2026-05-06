


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
  { value: "djibouti", label: "جيبوتي" },
  { value: "mauritania", label: "موريتانيا" },
  { value: "comoros", label: "جزر القمر" },
  { value: "finland", label: "فنلندا" },
  { value: "sweden", label: "السويد" },
  { value: "norway", label: "النرويج" },
  { value: "germany", label: "ألمانيا" },
  { value: "france", label: "فرنسا" },
  { value: "uk", label: "بريطانيا" },
  { value: "usa", label: "الولايات المتحدة" },
  { value: "turkey", label: "تركيا" },
  { value: "iran", label: "إيران" },
  { value: "pakistan", label: "باكستان" },
  { value: "india", label: "الهند" },
  { value: "bangladesh", label: "بنغلاديش" },
  { value: "afghanistan", label: "أفغانستان" },
  { value: "other", label: "أخرى" },
];


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
  { value: "djiboutian", label: "جيبوتي" },
  { value: "mauritanian", label: "موريتاني" },
  { value: "comoran", label: "قمري" },
  { value: "finnish", label: "فنلندي" },
  { value: "swedish", label: "سويدي" },
  { value: "norwegian", label: "نرويجي" },
  { value: "german", label: "ألماني" },
  { value: "french", label: "فرنسي" },
  { value: "british", label: "بريطاني" },
  { value: "american", label: "أمريكي" },
  { value: "turkish", label: "تركي" },
  { value: "iranian", label: "إيراني" },
  { value: "pakistani", label: "باكستاني" },
  { value: "indian", label: "هندي" },
  { value: "bangladeshi", label: "بنغلاديشي" },
  { value: "afghan", label: "أفغاني" },
  { value: "other", label: "أخرى" },
];


export const RELIGIONS = [
  { value: "muslim", label: "مسلم" },
  { value: "christian", label: "مسيحي" },
  { value: "other", label: "أخرى" },
];


export const SECTS_BY_RELIGION = {
  muslim: [
    { value: "sunni", label: "سني" },
    { value: "shia", label: "شيعي" },
    { value: "ibadi", label: "إباضي" },
    { value: "sufi", label: "صوفي" },
    { value: "other", label: "أخرى" },
  ],
  christian: [
    { value: "catholic", label: "كاثوليكي" },
    { value: "orthodox", label: "أرثوذكسي" },
    { value: "protestant", label: "بروتستانتي" },
    { value: "coptic", label: "قبطي" },
    { value: "maronite", label: "ماروني" },
    { value: "other", label: "أخرى" },
  ],
  other: [{ value: "other", label: "أخرى" }],
};


export const GENDERS = [
  { value: "male", label: "ذكر" },
  { value: "female", label: "أنثى" },
];


export const MARITAL_STATUS = [
  { value: "single", label: "أعزب/عزباء" },
  { value: "married", label: "متزوج/ة" },
  { value: "divorced", label: "مطلق/ة" },
  { value: "widowed", label: "أرمل/ة" },
  { value: "separated", label: "منفصل/ة" },
];


export const RESIDENCY_TYPES = [
  { value: "temporary", label: "مؤقتة" },
  { value: "permanent", label: "دائمة" },
  { value: "finnish_citizenship", label: "الجنسية الفنلندية" },
  { value: "no_residency", label: "بدون إقامة" },
];


export const EDUCATION_LEVELS = [
  { value: "no_education", label: "بدون تعليم رسمي" },
  { value: "basic", label: "تعليم أساسي (ابتدائي وإعدادي)" },
  { value: "secondary", label: "ثانوي عام" },
  { value: "vocational", label: "دبلوم / معهد مهني" },
  { value: "bachelor", label: "بكالوريوس" },
  { value: "master", label: "ماجستير" },
  { value: "doctorate", label: "دكتوراه" },
  { value: "other", label: "أخرى" },
];


export const INCOME_SOURCES = [
  { value: "government", label: "من الحكومة" },
  { value: "private_work", label: "من عملي الخاص" },
  { value: "unemployment_benefit", label: "إعانة بطالة" },
  { value: "student_allowance", label: "منحة طالب" },
  { value: "pension", label: "معاش تقاعدي" },
  { value: "other", label: "أخرى" },
];


export const RELIGION_COMMITMENT = [
  { value: "committed", label: "ملتزم بالصلاة" },
  { value: "sometimes", label: "بعض الأحيان" },
  { value: "never", label: "أبداً" },
];


export const HIJAB_STATUS = [
  { value: "hijab_committed", label: "ملتزمة محجبة" },
  { value: "hijab_with_makeup", label: "محجبة مع مكياج" },
  { value: "no_hijab", label: "بدون حجاب" },
];


export const YES_NO_OPTIONS = [
  { value: 1, label: "نعم" },
  { value: 0, label: "لا" },
];


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


export const SKIN_COLORS = [
  { value: "white", label: "أبيض" },
  { value: "wheat", label: "قمحي" },
  { value: "light_brown", label: "بني فاتح" },
  { value: "brown", label: "بني" },
  { value: "dark_brown", label: "بني غامق" },
  { value: "black", label: "أسود" },
];


export const EYE_COLORS = [
  { value: "black", label: "أسود" },
  { value: "brown", label: "بني" },
  { value: "hazel", label: "عسلي" },
  { value: "green", label: "أخضر" },
  { value: "blue", label: "أزرق" },
  { value: "gray", label: "رمادي" },
];


export const HAIR_TYPES = [
  { value: "straight", label: "ناعم" },
  { value: "wavy", label: "مموج" },
  { value: "curly", label: "مجعد" },
  { value: "bald", label: "أصلع" },
];


export const getLabelByValue = (options, value) => {
  if (Array.isArray(options)) {
    const option = options.find((opt) => opt.value === value);
    return option?.label || value || "غير محدد";
  }
  return value || "غير محدد";
};

export const getValueByLabel = (options, label) => {
  if (Array.isArray(options)) {
    const option = options.find((opt) => opt.label === label);
    return option?.value || label;
  }
  return label;
};
