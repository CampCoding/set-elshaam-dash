// src/pages/dashboard/banners/Banners.jsx
import { Tag, Space, Button, Tooltip, Image as AntImage, Badge, Typography } from "antd";
import { Edit, Trash2, Layout, ImageIcon, Film, Monitor } from "lucide-react";
import DataTable, { getColumnSearchProps } from "../../../components/common/DataTable";
import { useBanners } from "./useBanners";
import BannerModal from "./components/BannerModal";

const { Text } = Typography;

const Banners = () => {
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
  } = useBanners();

  const columns = [
    {
      title: "الميديا",
      dataIndex: "media_path",
      key: "media_path",
      width: 120,
      render: (url, record) => (
        <div className="relative w-20 h-14 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center bg-gray-50 shadow-sm">
          {record.media_type === "video" ? (
            <div className="flex flex-col items-center">
              <Film className="w-5 h-5 text-primary" />
              <span className="text-[8px] font-bold text-primary mt-0.5">VIDEO</span>
            </div>
          ) : url ? (
            <AntImage src={url} width="100%" height="100%" style={{ objectFit: "cover" }} />
          ) : (
            <ImageIcon className="w-5 h-5 text-gray-300" />
          )}
        </div>
      ),
    },
    {
      title: "الصفحة",
      dataIndex: "page_name",
      key: "page_name",
      width: 120,
      render: (page) => (
        <Tag color="blue" className="rounded-full px-3 font-bold uppercase tracking-wide text-[10px]">
          {page}
        </Tag>
      ),
    },
    {
      title: "العنوان",
      dataIndex: "title_ar",
      key: "title_ar",
      ...getColumnSearchProps("title_ar", "ابحث بالعنوان..."),
      render: (text, record) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-800">{text}</span>
          {record.sub_title_ar && <Text type="secondary" className="text-xs">{record.sub_title_ar}</Text>}
        </div>
      ),
    },
    {
      title: "الحالة",
      dataIndex: "is_active",
      key: "is_active",
      width: 100,
      align: "center",
      render: (active) => (
        <Badge status={active === 1 || active === true ? "success" : "default"} text={active === 1 || active === true ? "مفعل" : "معطل"} />
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
              <Monitor className="w-6 h-6 text-primary" />
            </div>
            إدارة البنرات (Hero)
          </h1>
          <p className="text-gray-500 mt-1 text-sm">إدارة صور وفيديوهات الواجهة الرئيسية لمختلف صفحات الموقع.</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        searchPlaceholder="ابحث في البنرات..."
        addButton={true}
        addButtonText="إضافة بنر جديد"
        onAddClick={handleOpenAdd}
        emptyText="لا يوجد بنرات مضافة"
        emptyIcon={Layout}
      />

      <BannerModal
        visible={isModalVisible}
        onCancel={handleCloseModal}
        onSave={handleSave}
        initialData={editingRecord}
      />
    </div>
  );
};

export default Banners;
