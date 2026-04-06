// src/pages/dashboard/stagePrice/StagesPrice.jsx
import { Tag, Space, Button, Tooltip } from "antd";
import { Edit, Trash2, DollarSign } from "lucide-react";
import DataTable, {
  getColumnSearchProps,
} from "../../../components/common/DataTable";
import { useStagesPrice } from "./useStagesPrice";
import StagePriceModal from "./components/StagePriceModal";

const StagesPrice = () => {
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
  } = useStagesPrice();

  const columns = [
    {
      title: "اسم المرحلة",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name", "ابحث باسم المرحلة..."),
      render: (text) => (
        <div className="font-semibold text-gray-800">{text}</div>
      ),
    },
    {
      title: "السعر",
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (price) => (
        <Tag
          color="blue"
          className="rounded-full px-3 py-0.5 text-sm font-bold"
        >
          {price} €
        </Tag>
      ),
    },
    {
      title: "الملاحظات/الوصف",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <span className="text-gray-500 text-sm line-clamp-2">{text}</span>
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
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space size="small">
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            إدارة أسعار المراحل
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            التحكم بأسعار المراحل وتفاصيل التكلفة
          </p>
        </div>
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

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        searchPlaceholder="ابحث باسم المرحلة..."
        addButton={true}
        addButtonText="إضافة مرحلة جديدة"
        onAddClick={handleOpenAdd}
        emptyText="لا توجد أسعار مراحل مضافة حتى الآن"
        emptyIcon={DollarSign}
      />

      <StagePriceModal
        visible={isModalVisible}
        onCancel={handleCloseModal}
        onSave={handleSave}
        initialData={editingRecord}
      />
    </div>
  );
};

export default StagesPrice;
