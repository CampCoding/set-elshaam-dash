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
    pagination,
    handleTableChange,
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
      dataIndex: "slider_images",
      key: "slider_images",
      width: 90,
      render: (slider_images, record) => {
        const image = Array.isArray(slider_images) && slider_images.length > 0 
          ? slider_images[0].path || slider_images[0]
          : record.image; // fallback
        return (
          <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-gray-100 shadow-sm">
            <img
              src={image || "https://via.placeholder.com/150"}
              alt={record.title_ar}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/150?text=No+Image";
              }}
            />
          </div>
        );
      },
    },
    {
      title: "اسم الخدمة",
      dataIndex: "title_ar",
      key: "title_ar",
      ...getColumnSearchProps("title_ar", "ابحث باسم الخدمة..."),
      render: (text, record) => (
        <div>
          <div className="font-semibold text-gray-800">{text || record.name}</div>
          {record.subtitle_ar && (
            <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">
              {record.subtitle_ar}
            </div>
          )}
        </div>
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
        const isActive = status === "active" || status === 1;
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
              {data.filter((s) => s.status === "active" || s.status === 1).length}
            </div>
            <div className="text-xs text-green-500">مفعّل</div>
          </div>
          <div className="bg-red-50 rounded-xl px-4 py-2 text-center">
            <div className="text-lg font-bold text-red-600">
              {data.filter((s) => s.status === "inactive" || s.status === 0).length}
            </div>
            <div className="text-xs text-red-500">متوقف</div>
          </div>
          <div className="bg-primary/10 rounded-xl px-4 py-2 text-center">
            <div className="text-lg font-bold text-primary">{pagination.total}</div>
            <div className="text-xs text-primary">إجمالي</div>
          </div>
        </div>
      </div>

      {/* Data Table Component */}
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
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
