// src/pages/dashboard/services/Services.jsx
import { Tag, Space, Button, Tooltip } from "antd";
import { Edit, Trash2, LayoutList, Eye, Lock, Unlock } from "lucide-react";
import DataTable, {
  getColumnSearchProps,
} from "../../../components/common/DataTable";
import { useServicesPage } from "./useServicesPage";
import ServiceModal from "./components/ServiceModal";
import ServiceDetailsModal from "./components/ServiceDetailsModal";

const Services = () => {
  const {
    data,
    loading,
    // مودال الإضافة/التعديل
    isModalVisible,
    editingRecord,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseModal,
    handleSave,
    handleDelete,
    // مودال التفاصيل
    isDetailsModalVisible,
    selectedRecord,
    handleOpenDetails,
    handleCloseDetails,
  } = useServicesPage();

  // تعريف أعمدة الجدول
  const columns = [
    {
      title: "الصورة",
      dataIndex: "image",
      key: "image",
      width: 90,
      render: (image, record) => (
        <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-gray-100 shadow-sm">
          <img
            src={image || "https://via.placeholder.com/150"}
            alt={record.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/150?text=No+Image";
            }}
          />
        </div>
      ),
    },
    {
      title: "اسم الخدمة",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name", "ابحث باسم الخدمة..."),
      render: (text, record) => (
        <div>
          <div className="font-semibold text-gray-800">{text}</div>
          {record.subtitle && (
            <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">
              {record.subtitle}
            </div>
          )}
        </div>
      ),
    },
    // {
    //   title: "التصنيف",
    //   dataIndex: "category",
    //   key: "category",
    //   width: 130,
    //   filters: [
    //     { text: "زواج", value: "زواج" },
    //     { text: "قاعات", value: "قاعات" },
    //     { text: "ضيافة", value: "ضيافة" },
    //     { text: "فرق موسيقية", value: "فرق موسيقية" },
    //     { text: "تراث", value: "تراث" },
    //     { text: "ملابس", value: "ملابس" },
    //     { text: "صوتيات", value: "صوتيات" },
    //     { text: "تصوير", value: "تصوير" },
    //   ],
    //   onFilter: (value, record) => record.category === value,
    //   render: (category) => (
    //     <Tag color="blue" className="rounded-full px-3 py-0.5">
    //       {category}
    //     </Tag>
    //   ),
    // },
    // {
    //   title: "الصور",
    //   dataIndex: "images",
    //   key: "images",
    //   width: 80,
    //   align: "center",
    //   render: (images) => (
    //     <div className="flex! items-center justify-center bg-gray-100 text-gray-600 rounded-full px-2.5 py-1 text-xs font-medium">
    //       {images?.length || 0} صور
    //     </div>
    //   ),
    // },
    {
      title: "الوصول",
      dataIndex: "requiresLogin",
      key: "requiresLogin",
      width: 100,
      align: "center",
      filters: [
        { text: "يتطلب تسجيل", value: true },
        { text: "متاح للجميع", value: false },
      ],
      onFilter: (value, record) => record.requiresLogin === value,
      render: (requiresLogin) => (
        <Tooltip title={requiresLogin ? "تتطلب تسجيل دخول" : "متاحة للجميع"}>
          <div
            className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
              requiresLogin ? "bg-orange-100" : "bg-green-100"
            }`}
          >
            {requiresLogin ? (
              <Lock className="w-4 h-4 text-orange-500" />
            ) : (
              <Unlock className="w-4 h-4 text-green-500" />
            )}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "الحالة",
      dataIndex: "status",
      key: "status",
      width: 100,
      filters: [
        { text: "مفعّل", value: "active" },
        { text: "غير مفعّل", value: "inactive" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        const isActive = status === "active";
        return (
          <Tag
            color={isActive ? "success" : "error"}
            className="rounded-full px-3 py-0.5"
          >
            {isActive ? "مفعّل" : "غير مفعّل"}
          </Tag>
        );
      },
    },
    {
      title: "الإجراءات",
      key: "actions",
      width: 140,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="عرض التفاصيل">
            <Button
              type="text"
              icon={<Eye className="w-4 h-4 text-primary" />}
              className="flex items-center justify-center hover:bg-primary/10"
              onClick={() => handleOpenDetails(record)}
            />
          </Tooltip>
          <Tooltip title="تعديل">
            <Button
              type="text"
              icon={<Edit className="w-4 h-4 text-accent-dark" />}
              className="flex items-center justify-center hover:bg-accent/10"
              onClick={() => handleOpenEdit(record)}
            />
          </Tooltip>
          <Tooltip title="حذف">
            <Button
              type="text"
              danger
              icon={<Trash2 className="w-4 h-4 text-red-500" />}
              className="flex items-center justify-center hover:bg-red-50"
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <LayoutList className="w-6 h-6 text-primary" />
            </div>
            إدارة الخدمات
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            إدارة جميع الخدمات المقدمة في منصة ست الشام (أفراح، قاعات، فرق،
            الخ...)
          </p>
        </div>
        {/* إحصائية سريعة */}
        <div className="flex gap-3">
          <div className="bg-green-50 rounded-xl px-4 py-2 text-center">
            <div className="text-lg font-bold text-green-600">
              {data.filter((s) => s.status === "active").length}
            </div>
            <div className="text-xs text-green-500">مفعّل</div>
          </div>
          <div className="bg-red-50 rounded-xl px-4 py-2 text-center">
            <div className="text-lg font-bold text-red-600">
              {data.filter((s) => s.status === "inactive").length}
            </div>
            <div className="text-xs text-red-500">متوقف</div>
          </div>
          <div className="bg-primary/10 rounded-xl px-4 py-2 text-center">
            <div className="text-lg font-bold text-primary">{data.length}</div>
            <div className="text-xs text-primary">إجمالي</div>
          </div>
        </div>
      </div>

      {/* Data Table Component */}
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        searchPlaceholder="ابحث في الخدمات..."
        addButton={true}
        addButtonText="إضافة خدمة جديدة"
        onAddClick={handleOpenAdd}
        emptyText="لا توجد خدمات مضافة حتى الآن"
        emptyIcon={LayoutList}
      />

      {/* Modal - إضافة/تعديل */}
      <ServiceModal
        visible={isModalVisible}
        onCancel={handleCloseModal}
        onSave={handleSave}
        initialData={editingRecord}
      />

      {/* Modal - التفاصيل */}
      <ServiceDetailsModal
        visible={isDetailsModalVisible}
        onClose={handleCloseDetails}
        service={selectedRecord}
      />
    </div>
  );
};

export default Services;
