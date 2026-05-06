
import {
  Tag,
  Space,
  Button,
  Tooltip,
  Image as AntImage,
  Typography,
  Badge,
} from "antd";
import {
  Edit,
  Trash2,
  FileText,
  ExternalLink,
  ImageIcon,
  Film,
} from "lucide-react";
import DataTable, {
  getColumnSearchProps,
} from "../../../components/common/DataTable";
import { usePagesContent } from "./usePagesContent";
import ContentModal from "./components/ContentModal";

const { Paragraph } = Typography;

const PagesContent = () => {
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
  } = usePagesContent();

  const columns = [
    {
      title: "الصفحه",
      dataIndex: "page_name",
      key: "page_name",
      width: 100,
      render: (page_name) => (
        <div>
          <span className="font-bold text-gray-800">{page_name}</span>
        </div>
      ),
    },

    {
      title: "العنوان",
      dataIndex: "title_ar",
      key: "title_ar",
      width: 250,
      ...getColumnSearchProps("title_ar", "ابحث بالعنوان..."),
      render: (text, record) => (
        <div className="flex flex-col">
          <span
            className="font-bold text-gray-800"
            dangerouslySetInnerHTML={{ __html: text }}
          ></span>
          <span className="text-xs text-gray-400">{record.title_en}</span>
        </div>
      ),
    },
    {
      title: "الميديا",
      dataIndex: "main_media",
      key: "main_media",
      width: 100,
      render: (url, record) => (
        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center bg-gray-50">
          {record.media_type === "video" ? (
            <div className="flex flex-col items-center">
              <Film className="w-6 h-6 text-primary" />
              <span className="text-[10px] font-bold text-primary mt-1">
                VIDEO
              </span>
            </div>
          ) : url ? (
            <AntImage
              src={url}
              width="100%"
              height="100%"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <ImageIcon className="w-6 h-6 text-gray-300" />
          )}
        </div>
      ),
    },
    {
      title: "المحتوى",
      dataIndex: "content_ar",
      key: "content_ar",
      render: (text) => (
        <Paragraph
          ellipsis={{ rows: 2, tooltip: true }}
          className="m-0 text-gray-500 text-sm"
        >
          <div dangerouslySetInnerHTML={{ __html: text }} />
        </Paragraph>
      ),
    },
    {
      title: "الزر",
      key: "button",
      width: 150,
      render: (_, record) =>
        record.button_text_ar ? (
          <div className="flex flex-col gap-1">
            <Tag color="purple" className="m-0 text-center">
              {record.button_text_ar}
            </Tag>
            {record.button_link && (
              <a
                href={record.button_link}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-blue-500 flex items-center gap-1 hover:underline"
              >
                <ExternalLink className="w-3 h-3" /> الرابط
              </a>
            )}
          </div>
        ) : (
          <span className="text-gray-300">-</span>
        ),
    },
    {
      title: "صور إضافية",
      dataIndex: "extra_media",
      key: "extra_media",
      width: 100,
      align: "center",
      render: (extra) => (
        <Badge
          count={Array.isArray(extra) ? extra.length : 0}
          showZero
          color="#8b5cf6"
        >
          <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
            <ImageIcon className="w-4 h-4 text-gray-400" />
          </div>
        </Badge>
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
              <FileText className="w-6 h-6 text-primary" />
            </div>
            محتوى الصفحات
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            إدارة المحتوى النصي والمرئي لمختلف صفحات الموقع (الرئيسية، من نحن،
            الخ).
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        searchPlaceholder="ابحث بالعنوان..."


        onAddClick={handleOpenAdd}
        emptyText="لا يوجد محتوى مضاف حتى الآن"
        emptyIcon={FileText}
      />

      <ContentModal
        visible={isModalVisible}
        onCancel={handleCloseModal}
        onSave={handleSave}
        initialData={editingRecord}
      />
    </div>
  );
};

export default PagesContent;
