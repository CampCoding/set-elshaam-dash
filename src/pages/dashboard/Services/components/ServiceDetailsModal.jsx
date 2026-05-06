
import { Modal, Tag, Image, Divider, Collapse } from "antd";
import {
  Eye,
  Lock,
  Unlock,
  Images,
  FileText,
  Info,
  Layers,
  Hash,
  ToggleRight,
  MessageCircleQuestion,
} from "lucide-react";

const ServiceDetailsModal = ({ visible, onClose, service }) => {
  if (!service) return null;

  const isActive = service.status === "active" || service.status === 1;

  const mainImage = Array.isArray(service.slider_images) && service.slider_images.length > 0
    ? service.slider_images[0].path || service.slider_images[0]
    : service.image;

  const gallery = Array.isArray(service.gallery_images)
    ? service.gallery_images.map(img => img.path || img)
    : service.images || [];

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={850}
      centered
      className="service-details-modal"
      styles={{
        body: {
          direction: "rtl",
          padding: "24px",
          maxHeight: "80vh",
          overflowY: "auto",
        },
        header: { direction: "rtl" },
      }}
      title={
        <div className="flex items-center gap-3 text-right" dir="rtl">
          <div className="p-2 rounded-xl">
            <Eye className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl font-bold text-gray-800">تفاصيل الخدمة</span>
        </div>
      }
    >
      <div className="space-y-6" dir="rtl">
        {/* ===== القسم العلوي - الصورة والمعلومات الأساسية ===== */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-2/5">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-100 h-64">
              <Image
                src={mainImage}
                alt={service.title_ar || service.name}
                width="100%"
                height="100%"
                className="!w-full !h-full"
                style={{ objectFit: "cover" }}
                fallback="https://via.placeholder.com/400x300?text=لا+توجد+صورة"
                preview={{
                  mask: (
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>عرض</span>
                    </div>
                  ),
                }}
              />
              <div className="absolute top-3 right-3">
                <Tag
                  color={isActive ? "success" : "error"}
                  className="rounded-full px-3 py-1 text-sm font-medium shadow-sm"
                >
                  {isActive ? "مفعّل" : "غير مفعّل"}
                </Tag>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {service.title_ar || service.name}
              </h2>
              {(service.subtitle_ar || service.subtitle) && (
                <p className="text-gray-500 text-base leading-relaxed">
                  {service.subtitle_ar || service.subtitle}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Tag
                color="blue"
                className="rounded-full px-4 py-1.5 text-sm flex! items-center gap-2"
              >
                <Layers className="w-3.5 h-3.5" />
                {service.category}
              </Tag>
              <Tag
                color={service.requiresLogin ? "orange" : "green"}
                className="rounded-full px-4 py-1.5 text-sm flex! items-center gap-2"
              >
                {service.requiresLogin ? (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    تتطلب تسجيل دخول
                  </>
                ) : (
                  <>
                    <Unlock className="w-3.5 h-3.5" />
                    متاحة للجميع
                  </>
                )}
              </Tag>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 text-center border border-primary/10">
                <div className="text-3xl font-bold text-primary mb-1">
                  {gallery.length}
                </div>
                <div className="text-sm text-gray-600">صور المعرض</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-xl p-4 text-center border border-purple-500/10">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {service.faqs?.length || 0}
                </div>
                <div className="text-sm text-gray-600">أسئلة شائعة</div>
              </div>
            </div>
          </div>
        </div>

        <Divider className="!my-5" />

        {/* ===== قسم الوصف التفصيلي ===== */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            الوصف التفصيلي
          </h3>
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            {service.description_ar || (service.description && service.description.length > 0) ? (
              <div className="space-y-4">
                {(service.description_ar ? service.description_ar.split("\n") : service.description).map((paragraph, index) => (
                  <div key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <p className="text-gray-600 leading-relaxed flex-1">
                      {paragraph}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-6">لا يوجد وصف متاح</p>
            )}
          </div>
        </div>

        {/* ===== قسم الأسئلة الشائعة (FAQ) ===== */}
        {service.faqs && service.faqs.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="p-1.5 bg-purple-100 rounded-lg">
                <MessageCircleQuestion className="w-4 h-4 text-purple-600" />
              </div>
              الأسئلة الشائعة للخدمة
              <span className="text-sm font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {service.faqs.length} أسئلة
              </span>
            </h3>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <Collapse
                ghost
                expandIconPosition="end"
                className="faq-collapse"
                items={service.faqs.map((faq, index) => ({
                  key: String(index),
                  label: (
                    <span className="font-semibold text-gray-800 text-base">
                      {faq.question}
                    </span>
                  ),
                  children: (
                    <p className="text-gray-600 m-0 pe-4 leading-relaxed bg-white p-3 rounded-lg border border-gray-100">
                      {faq.answer}
                    </p>
                  ),
                }))}
              />
            </div>
          </div>
        )}

        {/* ===== قسم معرض الصور ===== */}
        {gallery.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <Images className="w-4 h-4 text-primary" />
              </div>
              معرض الصور
              <span className="text-sm font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {gallery.length} صور
              </span>
            </h3>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <Image.PreviewGroup
                preview={{
                  countRender: (current, total) => (
                    <span className="text-white">
                      {current} / {total}
                    </span>
                  ),
                }}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {gallery.map((img, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer group"
                    >
                      <Image
                        src={img}
                        alt={`صورة ${index + 1}`}
                        width="100%"
                        height="100%"
                        style={{ objectFit: "cover" }}
                        className="!w-full !h-full"
                        fallback="https://via.placeholder.com/150?text=خطأ"
                        preview={{
                          mask: (
                            <div className="flex flex-col items-center gap-1">
                              <Eye className="w-5 h-5" />
                              <span className="text-xs">عرض</span>
                            </div>
                          ),
                        }}
                      />
                      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </Image.PreviewGroup>
            </div>
          </div>
        )}

        {/* ===== معلومات إضافية ===== */}
        <div className="bg-gradient-to-l from-primary/5 via-transparent to-accent/5 rounded-xl p-5 border border-gray-100">
          <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
            <div className="p-1.5 bg-gray-100 rounded-lg">
              <Info className="w-4 h-4 text-gray-500" />
            </div>
            معلومات إضافية
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-3 border border-gray-100 flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Hash className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <div className="text-xs text-gray-400">رقم الخدمة</div>
                <div className="font-bold text-gray-700">#{service.id}</div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-100 flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Layers className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <div className="text-xs text-gray-400">التصنيف</div>
                <div className="font-bold text-gray-700">
                  {service.category}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-100 flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${isActive ? "bg-green-50" : "bg-red-50"}`}
              >
                <ToggleRight
                  className={`w-4 h-4 ${isActive ? "text-green-500" : "text-red-500"}`}
                />
              </div>
              <div>
                <div className="text-xs text-gray-400">الحالة</div>
                <div
                  className={`font-bold ${isActive ? "text-green-600" : "text-red-500"}`}
                >
                  {isActive ? "نشط" : "متوقف"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ServiceDetailsModal;
