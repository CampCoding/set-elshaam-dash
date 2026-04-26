// src/pages/dashboard/contactInfo/ContactInfo.jsx
import { Tag, Space, Button, Tooltip, Image as AntImage, Badge, Switch } from "antd";
import { Edit, Trash2, Phone, Mail, Globe, MapPin, MessageCircle, ExternalLink } from "lucide-react";
import DataTable, { getColumnSearchProps } from "../../../components/common/DataTable";
import { useContactInfo } from "./useContactInfo";
import ContactModal from "./components/ContactModal";

const ContactInfo = () => {
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
  } = useContactInfo();

  const getTypeIcon = (type) => {
    switch (type) {
      case "phone": return <Phone size={16} className="text-blue-500" />;
      case "email": return <Mail size={16} className="text-purple-500" />;
      case "whatsapp": return <MessageCircle size={16} className="text-green-500" />;
      case "address": return <MapPin size={16} className="text-red-500" />;
      default: return <Globe size={16} className="text-gray-500" />;
    }
  };

  const columns = [
    {
      title: "أيقونة",
      dataIndex: "icon",
      key: "icon",
      width: 80,
      align: "center",
      render: (url) => url ? (
        <AntImage src={url} width={40} height={40} className="rounded-lg object-contain bg-gray-50 p-1 border border-gray-100" />
      ) : <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100"><Globe className="w-5 h-5 text-gray-300" /></div>,
    },
    {
      title: "النوع",
      dataIndex: "type",
      key: "type",
      width: 120,
      render: (type) => (
        <div className="flex items-center gap-2">
          {getTypeIcon(type)}
          <span className="font-bold text-gray-700 uppercase text-xs tracking-wider">{type}</span>
        </div>
      ),
    },
    {
      title: "القيمة",
      dataIndex: "value",
      key: "value",
      ...getColumnSearchProps("value", "ابحث بالقيمة..."),
      render: (text) => <span className="font-medium text-gray-800">{text}</span>,
    },
    {
      title: "الحالة",
      dataIndex: "is_active",
      key: "is_active",
      width: 100,
      align: "center",
      render: (active) => (
        <Tag color={active === 1 || active === true ? "success" : "default"} className="rounded-full px-3">
          {active === 1 || active === true ? "مفعل" : "معطل"}
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
              <Phone className="w-6 h-6 text-primary" />
            </div>
            بيانات التواصل
          </h1>
          <p className="text-gray-500 mt-1 text-sm">إدارة أرقام الهواتف، البريد الإلكتروني، وروابط التواصل الاجتماعي المتاحة للعملاء.</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        searchPlaceholder="ابحث في بيانات التواصل..."
        addButton={true}
        addButtonText="إضافة رقم / إيميل"
        onAddClick={handleOpenAdd}
        emptyText="لا يوجد بيانات تواصل مضافة"
        emptyIcon={Globe}
      />

      <ContactModal
        visible={isModalVisible}
        onCancel={handleCloseModal}
        onSave={handleSave}
        initialData={editingRecord}
      />
    </div>
  );
};

export default ContactInfo;
