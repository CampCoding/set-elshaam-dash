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
    loading,
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
      dataIndex: "image_path",
      key: "image_path",
      width: 100,
      render: (image_path, record) => (
        <div className="w-16 h-12 rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-50 flex items-center justify-center">
          {image_path ? (
            <Image
              src={image_path}
              alt={record.title_ar}
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
          ) : (
            <Images size={20} className="text-gray-300" />
          )}
        </div>
      ),
    },
    {
      title: "العنوان",
      dataIndex: "title_ar",
      key: "title_ar",
      ...getColumnSearchProps("title_ar", "ابحث باسم الصورة..."),
      render: (text) => (
        <span className="font-semibold text-gray-800">{text || "—"}</span>
      ),
    },
    {
      title: "التصنيف",
      dataIndex: "category_ar",
      key: "category_ar",
      render: (category) => (
        <Tag color="cyan" className="rounded-full px-3 py-0.5 text-xs border border-cyan-100">
          {category || "—"}
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
              className="hover:bg-accent/10 flex items-center justify-center"
              onClick={() => handleOpenEdit(record)}
            />
          </Tooltip>
          <Tooltip title="حذف">
            <Button
              type="text"
              danger
              icon={<Trash2 className="w-4 h-4 text-red-500" />}
              className="hover:bg-red-50 flex items-center justify-center"
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
            معرض الصور
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            إدارة صور الموقع وتصنيفها لعرضها في المعرض العام.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        addButton={true}
        addButtonText="إضافة صورة للمعرض"
        onAddClick={handleOpenAdd}
        emptyIcon={Images}
        emptyText="لا يوجد صور في المعرض حالياً"
      />

      <GalleryItemModal
        visible={isModalVisible}
        onCancel={handleCloseModal}
        onSave={handleSave}
        initialData={editingRecord}
      />
    </div>
  );
};

export default GalleryItems;
