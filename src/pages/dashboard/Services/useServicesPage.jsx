// src/pages/dashboard/services/useServicesPage.jsx
import { useState } from "react";
import { message, Modal } from "antd";

// البيانات الكاملة
const initialMockData = [
  {
    id: 1,
    name: "بوفيه طعام",
    subtitle: "خدمات طعام متكاملة لحفلات الزفاف",
    category: "ضيافة",
    image:
      "https://res.cloudinary.com/dp7jfs375/image/upload/v1772624889/Image_16_kqermq.webp",
    images: [
      "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop",
    ],
    description: [
      "نقدم لكم أفضل خدمات البوفيه المفتوح لحفلات الزفاف والمناسبات الخاصة. نوفر تشكيلة واسعة من الأطباق الشرقية والغربية التي ترضي جميع الأذواق.",
      "فريقنا من الطهاة المحترفين يضمن لكم تجربة طعام استثنائية تليق بأجمل يوم في حياتكم. نحرص على استخدام أجود المكونات الطازجة.",
    ],
    requiresLogin: false,
    status: "active",
    faqs: [
      {
        question: "هل يمكن تخصيص قائمة الطعام؟",
        answer:
          "نعم بالتأكيد، يمكنك الجلوس مع الشيف الخاص بنا لتحديد قائمة الطعام التي تناسب ذوقك وميزانيتك.",
      },
      {
        question: "هل توفرون خدمة الضيافة (الويترز)؟",
        answer:
          "نعم، البوفيه يشمل طاقم ضيافة محترف لخدمة ضيوفكم طوال فترة الحفل.",
      },
    ],
  },
  {
    id: 2,
    name: "حجز صالة الأفراح",
    subtitle: "صالات فخمة لإقامة حفلات الزفاف",
    category: "قاعات",
    image:
      "https://res.cloudinary.com/dp7jfs375/image/upload/v1772624876/Image_18_sgz7td.webp",
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2069&auto=format&fit=crop",
    ],
    description: [
      "نوفر لكم أفخم صالات الأفراح المجهزة بالكامل لإقامة حفلات زفاف لا تُنسى.",
      "صالاتنا تتسع لأعداد كبيرة مع توفير كافة الخدمات من إضاءة وصوتيات وديكورات فاخرة.",
    ],
    requiresLogin: false,
    status: "active",
    faqs: [
      {
        question: "ماذا يحدث في حال إلغاء الحجز؟",
        answer:
          "سياسة الإلغاء تختلف حسب وقت الإلغاء. في حال الإلغاء قبل موعد الفعالية بشهر، يمكن استرداد 50% من المبلغ.",
      },
    ],
  },
  {
    id: 3,
    name: "البحث عن شريك",
    subtitle: "خدمة التوفيق بين الراغبين في الزواج",
    category: "زواج",
    image:
      "https://res.cloudinary.com/dp7jfs375/image/upload/v1772624891/Image_24_w9hszw.webp",
    images: [
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1529634597503-139d3726fed5?q=80&w=2069&auto=format&fit=crop",
    ],
    description: [
      "نقدم خدمة التوفيق بين الراغبين في الزواج بطريقة شرعية ومحترمة. نساعدكم في إيجاد الشريك المناسب.",
      "خدمتنا تعتمد على الخصوصية التامة والسرية في التعامل مع بياناتكم الشخصية.",
    ],
    requiresLogin: true,
    status: "active",
    faqs: [
      {
        question: "كيف تتم عملية المطابقة؟",
        answer:
          "نقوم بدراسة ملفك الشخصي بعناية فائقة، ثم نستخدم نظاماً متقدماً لمطابقة المعايير الشخصية والثقافية والدينية. بعد ذلك نرشح لك أنسب الخيارات المتوافقة مع تطلعاتك.",
      },
    ],
  },
  {
    id: 4,
    name: "فرقة العراضة الشامية رجال",
    subtitle: "فرقة تراثية لإحياء الأفراح",
    category: "تراث",
    image:
      "https://res.cloudinary.com/dp7jfs375/image/upload/v1772624886/Image_15_gizrgx.webp",
    images: [
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop",
    ],
    description: [
      "فرقة العراضة الشامية تقدم لكم عروضاً تراثية أصيلة تضفي جواً من الفرح والبهجة على حفلات الزفاف.",
      "فرقتنا مكونة من فنانين محترفين يحافظون على الموروث الشعبي الشامي الأصيل.",
    ],
    requiresLogin: false,
    status: "active",
    faqs: [],
  },
  {
    id: 5,
    name: "زغاريد",
    subtitle: "فرقة زغاريد نسائية",
    category: "تراث",
    image:
      "https://res.cloudinary.com/dp7jfs375/image/upload/v1772624883/Image_19_xwxbeq.webp",
    images: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop",
    ],
    description: [
      "نوفر فرقة زغاريد نسائية محترفة لإضافة لمسة من الفرح التقليدي على حفلات الزفاف.",
      "فريقنا يضم سيدات محترفات في فن الزغاريد الشامية الأصيلة.",
    ],
    requiresLogin: false,
    status: "active",
    faqs: [],
  },
  {
    id: 6,
    name: "فرقة زفة ودقة ستي للسيدات",
    subtitle: "فرقة نسائية لإحياء الحفلات",
    category: "فرق موسيقية",
    image:
      "https://res.cloudinary.com/dp7jfs375/image/upload/v1772624880/Image_6_ucse64.webp",
    images: [
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=2070&auto=format&fit=crop",
    ],
    description: [
      "فرقة زفة ودقة ستي النسائية تقدم عروضاً مميزة لحفلات الزفاف والمناسبات الخاصة بالسيدات.",
      "نقدم أجمل الأغاني التراثية والشعبية التي تضفي جواً من البهجة والسرور.",
    ],
    requiresLogin: false,
    status: "active",
    faqs: [],
  },
  {
    id: 7,
    name: "تصوير المناسبات",
    subtitle: "توثيق أجمل لحظاتكم",
    category: "تصوير",
    image:
      "https://res.cloudinary.com/dp7jfs375/image/upload/v1772624895/Image_20_itocr9.webp",
    images: [
      "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=2070&auto=format&fit=crop",
    ],
    description: [
      "نوفر خدمات تصوير احترافية لتوثيق أجمل لحظات حفل زفافكم بأحدث الكاميرات والمعدات.",
      "فريقنا من المصورين المحترفين يلتقط كل التفاصيل الجميلة في يومكم المميز.",
    ],
    requiresLogin: false,
    status: "active",
    faqs: [],
  },
  {
    id: 8,
    name: "DJ",
    subtitle: "دي جي محترف لإحياء الحفلات",
    category: "صوتيات",
    image:
      "https://res.cloudinary.com/dp7jfs375/image/upload/v1772624897/Image_17_yh0rmk.webp",
    images: [
      "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070&auto=format&fit=crop",
    ],
    description: [
      "نوفر خدمات DJ محترف لإحياء حفلات الزفاف مع أحدث المعدات الصوتية والإضاءة.",
      "DJ محترف يقدم مزيجاً من الأغاني العربية والأجنبية التي تناسب جميع الأذواق.",
    ],
    requiresLogin: false,
    status: "active",
    faqs: [],
  },
  {
    id: 9,
    name: "تأجير بدلات",
    subtitle: "بدلات عريس فاخرة للإيجار",
    category: "ملابس",
    image:
      "https://res.cloudinary.com/dp7jfs375/image/upload/v1772624893/Image_22_nm7mzc.webp",
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071&auto=format&fit=crop",
    ],
    description: [
      "نوفر تشكيلة واسعة من بدلات العريس الفاخرة للإيجار بأسعار مناسبة.",
      "جميع البدلات من أشهر الماركات العالمية مع خدمة التعديل والتفصيل.",
    ],
    requiresLogin: false,
    status: "inactive",
    faqs: [],
  },
];

export const useServicesPage = () => {
  const [data, setData] = useState(initialMockData);
  const [loading, setLoading] = useState(false);

  // Modal States - للإضافة والتعديل
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // Modal State - للتفاصيل
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleOpenAdd = () => {
    setEditingRecord(null);
    setIsModalVisible(true);
  };

  const handleOpenEdit = (record) => {
    setEditingRecord(record);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingRecord(null);
  };

  const handleOpenDetails = (record) => {
    setSelectedRecord(record);
    setIsDetailsModalVisible(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsModalVisible(false);
    setSelectedRecord(null);
  };

  const handleSave = (values) => {
    setLoading(true);

    setTimeout(() => {
      if (editingRecord) {
        // حالة التعديل
        const updatedData = data.map((item) =>
          item.id === editingRecord.id ? { ...item, ...values } : item
        );
        setData(updatedData);
        message.success("تم تعديل الخدمة بنجاح");
      } else {
        // حالة الإضافة
        const newRecord = {
          ...values,
          id: Date.now(),
          images: values.images || [],
          description: values.description ? [values.description] : [],
          faqs: values.faqs || [],
        };
        setData([newRecord, ...data]);
        message.success("تم إضافة الخدمة بنجاح");
      }

      setLoading(false);
      handleCloseModal();
    }, 500);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "تأكيد الحذف",
      content: `هل أنت متأكد من حذف خدمة "${record.name}"؟`,
      okText: "نعم، احذف",
      cancelText: "إلغاء",
      okButtonProps: { danger: true },
      onOk: () => {
        const newData = data.filter((item) => item.id !== record.id);
        setData(newData);
        message.success("تم حذف الخدمة بنجاح");
      },
    });
  };

  return {
    data,
    loading,
    isModalVisible,
    editingRecord,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseModal,
    handleSave,
    handleDelete,
    isDetailsModalVisible,
    selectedRecord,
    handleOpenDetails,
    handleCloseDetails,
  };
};
