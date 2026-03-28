// src/pages/dashboard/gallery/categories/Categories.jsx
import { Space, Button, Tooltip } from "antd";
import { Edit, Trash2, Layers } from "lucide-react";
import DataTable, {
  getColumnSearchProps,
} from "../../../../components/common/DataTable";
import { useCategories } from "./useCategories";
import CategoryModal from "./CategoryModal";

const Categories = () => {
  const {
    data,
    isModalVisible,
    editingRecord,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseModal,
    handleSave,
    handleDelete,
  } = useCategories();

  const columns = [
    {
      title: "اسم التصنيف",
      dataIndex: "label",
      key: "label",
      ...getColumnSearchProps("label", "ابحث باسم التصنيف..."),
      render: (text) => (
        <span className="font-bold text-gray-800 text-base">{text}</span>
      ),
    },

    {
      title: "الإجراءات",
      key: "actions",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="تعديل">
            <Button
              type="text"
              icon={<Edit className="w-4 h-4 text-accent-dark" />}
              onClick={() => handleOpenEdit(record)}
            />
          </Tooltip>
          <Tooltip title="حذف">
            <Button
              type="text"
              danger
              icon={<Trash2 className="w-4 h-4 text-red-500" />}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Layers className="w-6 h-6 text-primary" />
            </div>
            تصنيفات المعرض
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            إدارة الأقسام والتصنيفات لصور المعرض العام.
          </p>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={data}
        addButton={true}
        addButtonText="تصنيف جديد"
        onAddClick={handleOpenAdd}
        emptyIcon={Layers}
      />
      <CategoryModal
        visible={isModalVisible}
        onCancel={handleCloseModal}
        onSave={handleSave}
        initialData={editingRecord}
      />
    </div>
  );
};
export default Categories;
