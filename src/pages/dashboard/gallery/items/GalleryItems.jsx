// src/pages/dashboard/gallery/items/GalleryItems.jsx
import { Tag, Space, Button, Tooltip, Image } from "antd";
import { Edit, Trash2, Images, Eye } from "lucide-react";
import DataTable, {
  getColumnSearchProps,
} from "../../../../components/common/DataTable";
import { useGalleryItems } from "./useGalleryItems";
import GalleryItemModal from "./GalleryItemModal";

const GalleryItems = () => {
  const {
    data,
    categories,
    getCategoryLabel,
    isModalVisible,
    editingRecord,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseModal,
    handleSave,
    handleDelete,
  } = useGalleryItems();

  const columns = [
    {
      title: "الصورة",
      dataIndex: "url",
      key: "url",
      width: 100,
      render: (url, record) => (
        <div className="w-16 h-12 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
          <Image
            src={url}
            alt={record.label}
            height={"100%"}
            width={"100%"}
            className="!w-full !h-full object-cover"
            preview={{
              mask: (
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span className="text-[10px]">عرض</span>
                </div>
              ),
            }}
          />
        </div>
      ),
    },
    {
      title: "العنوان",
      dataIndex: "label",
      key: "label",
      ...getColumnSearchProps("label", "ابحث باسم الصورة..."),
      render: (text) => (
        <span className="font-semibold text-gray-800">{text}</span>
      ),
    },
    {
      title: "التصنيف",
      dataIndex: "category",
      key: "category",
      filters: categories.map((cat) => ({ text: cat.label, value: cat.id })),
      onFilter: (value, record) => record.category === value,
      render: (categoryId) => (
        <Tag color="cyan" className="rounded-full px-3 py-1 text-xs border">
          {getCategoryLabel(categoryId)}
        </Tag>
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
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Images className="w-6 h-6 text-primary" />
            </div>
            عناصر المعرض
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            إضافة الصور وربطها بالتصنيفات المناسبة.
          </p>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={data}
        addButton={true}
        addButtonText="إضافة صورة"
        onAddClick={handleOpenAdd}
        emptyIcon={Images}
      />
      <GalleryItemModal
        visible={isModalVisible}
        onCancel={handleCloseModal}
        onSave={handleSave}
        initialData={editingRecord}
        categories={categories}
      />
    </div>
  );
};
export default GalleryItems;
