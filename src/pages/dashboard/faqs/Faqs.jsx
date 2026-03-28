// src/pages/dashboard/faqs/Faqs.jsx
import { Tag, Space, Button, Tooltip, Typography } from "antd";
import { Edit, Trash2, MessageCircleQuestion } from "lucide-react";
import DataTable, {
  getColumnSearchProps,
} from "../../../components/common/DataTable";
import { useFaqsPage } from "./useFaqsPage";
import FaqModal from "./components/FaqModal";

const { Paragraph } = Typography;

const Faqs = () => {
  const {
    data,
    loading,
    servicesList,
    setServicesList,
    isModalVisible,
    editingRecord,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseModal,
    handleSave,
    handleDelete,
  } = useFaqsPage();

  const columns = [
    {
      title: "السؤال",
      dataIndex: "question",
      key: "question",
      width: 250,
      ...getColumnSearchProps("question", "ابحث في الأسئلة..."),
      render: (text) => <span className="font-bold text-gray-800">{text}</span>,
    },
    {
      title: "الإجابة",
      dataIndex: "answer",
      key: "answer",
      render: (text) => (
        <Paragraph
          ellipsis={{ rows: 2, expandable: false, tooltip: text }}
          className="m-0 text-gray-500"
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
              <MessageCircleQuestion className="w-6 h-6 text-primary" />
            </div>
            الأسئلة الشائعة (FAQ)
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            إدارة الأسئلة والإجابات وربطها بخدمات المنصة ليسهل على المستخدمين
            الوصول إليها.
          </p>
        </div>
      </div>

      {/* Data Table Component */}
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        searchPlaceholder="ابحث باسم السؤال..."
        addButton={true}
        addButtonText="إضافة سؤال جديد"
        onAddClick={handleOpenAdd}
        emptyText="لا توجد أسئلة مضافة حتى الآن"
        emptyIcon={MessageCircleQuestion}
      />

      {/* Modal Component */}
      <FaqModal
        visible={isModalVisible}
        onCancel={handleCloseModal}
        onSave={handleSave}
        initialData={editingRecord}
        servicesList={servicesList}
        setServicesList={setServicesList}
      />
    </div>
  );
};

export default Faqs;
