// src/pages/dashboard/packages/Packages.jsx
import { Tag, Space, Button, Tooltip } from "antd";
import { Edit, Trash2, Package } from "lucide-react";
import DataTable, {
  getColumnSearchProps,
} from "../../../components/common/DataTable";
import { usePackagesPage } from "./usePackagesPage";
import PackageModal from "./components/PackageModal";

const Packages = () => {
  const {
    data,
    loading,
    isModalVisible,
    editingRecord,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseModal,
    handleSave,
    handleDelete,
  } = usePackagesPage();

  // تعريف أعمدة الجدول
  const columns = [
    {
      title: "اسم الباقة",
      dataIndex: "name",
      key: "name",
      width: 200,
      ...getColumnSearchProps("name", "ابحث باسم الباقة..."),
      render: (text) => (
        <span className="font-bold text-gray-800 text-base">{text}</span>
      ),
    },
    {
      title: "السعر",
      dataIndex: "price",
      key: "price",
      width: 120,
      sorter: (a, b) => Number(a.price) - Number(b.price),
      render: (price) => (
        <div className="font-bold text-lg text-primary bg-primary/5 px-3 py-1 rounded-lg inline-block border border-primary/10">
          {price} $
        </div>
      ),
    },
    {
      title: "الخدمات المشمولة",
      dataIndex: "services",
      key: "services",
      render: (services) => (
        <div className="flex flex-wrap gap-1.5">
          {services.map((service, index) => (
            <Tag
              key={index}
              color="blue"
              className="rounded-full px-3 py-1 text-xs border-blue-200 bg-blue-50 text-blue-700 m-0"
            >
              {service}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "عدد الخدمات",
      key: "servicesCount",
      width: 120,
      align: "center",
      render: (_, record) => (
        <span className="bg-gray-100 text-gray-600 rounded-full px-3 py-1 text-sm font-medium">
          {record.services?.length || 0} خدمات
        </span>
      ),
    },
    {
      title: "الإجراءات",
      key: "actions",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="تعديل الباقة">
            <Button
              type="text"
              icon={<Edit className="w-4 h-4 text-accent-dark" />}
              className="flex items-center justify-center hover:bg-accent/10"
              onClick={() => handleOpenEdit(record)}
            />
          </Tooltip>
          <Tooltip title="حذف الباقة">
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
              <Package className="w-6 h-6 text-primary" />
            </div>
            باقات الأفراح
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            إدارة الباقات المُجمعة وتحديد أسعارها والخدمات المشمولة بها.
          </p>
        </div>
      </div>

      {/* Data Table Component */}
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        searchPlaceholder="ابحث في الباقات..."
        addButton={true}
        addButtonText="إضافة باقة جديدة"
        onAddClick={handleOpenAdd}
        emptyText="لا توجد باقات مضافة حتى الآن"
        emptyIcon={Package}
      />

      {/* Modal Component */}
      <PackageModal
        visible={isModalVisible}
        onCancel={handleCloseModal}
        onSave={handleSave}
        initialData={editingRecord}
      />
    </div>
  );
};

export default Packages;
