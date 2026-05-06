
import {
  Tag,
  Space,
  Button,
  Tooltip,
  Image as AntImage,
  Badge,
  Typography,
} from "antd";
import {
  Edit,
  Trash2,
  Newspaper,
  Calendar,
  Hash,
  Bookmark,
} from "lucide-react";
import DataTable, {
  getColumnSearchProps,
} from "../../../components/common/DataTable";
import { useNews } from "./useNews";
import NewsModal from "./components/NewsModal";

const { Text, Paragraph } = Typography;

const News = () => {
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
  } = useNews();

  const columns = [
    {
      title: "الصورة",
      dataIndex: "main_image",
      key: "main_image",
      width: 100,
      render: (url) => (
        <div className="w-16 h-10 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
          {url ? (
            <AntImage
              src={url}
              width="100%"
              height="100%"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <Newspaper size={16} className="text-gray-300" />
          )}
        </div>
      ),
    },
    {
      title: "العنوان",
      dataIndex: "title_ar",
      key: "title_ar",
      width: 300,
      ...getColumnSearchProps("title_ar", "ابحث بالعنوان..."),
      render: (text, record) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-800 line-clamp-1">{text}</span>
          <span className="text-[10px] text-gray-400 font-mono">
            /{record.slug}
          </span>
        </div>
      ),
    },
    {
      title: "التصنيف",
      dataIndex: "category_ar",
      key: "category_ar",
      width: 120,
      render: (cat) => (
        <Tag
          color="cyan"
          className="rounded-full px-3 border-none !flex items-center gap-1 w-fit"
        >
          <Bookmark size={10} />
          {cat || "عام"}
        </Tag>
      ),
    },
    {
      title: "الملخص",
      dataIndex: "summary_ar",
      key: "summary_ar",
      width: 400,
      render: (text) => (
        <Paragraph
          ellipsis={{ rows: 2, tooltip: true }}
          className="m-0 text-gray-500 text-xs"
        >
          {text}
        </Paragraph>
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
              <Newspaper className="w-6 h-6 text-primary" />
            </div>
            إدارة الأخبار والمقالات
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            إدارة المحتوى الإخباري، المقالات، والفعاليات المنشورة على الموقع.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        searchPlaceholder="ابحث في الأخبار..."
        addButton={true}
        addButtonText="إضافة خبر جديد"
        onAddClick={handleOpenAdd}
        emptyText="لا يوجد أخبار مضافة"
        emptyIcon={Newspaper}
      />

      <NewsModal
        visible={isModalVisible}
        onCancel={handleCloseModal}
        onSave={handleSave}
        initialData={editingRecord}
      />
    </div>
  );
};

export default News;
