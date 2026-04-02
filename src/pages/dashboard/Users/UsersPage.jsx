// src/pages/dashboard/Users/UsersPage.jsx
import { Tag, Space, Button, Tooltip, Avatar } from "antd";
import { Edit, Trash2, Users, Eye, Lock, Unlock, UserCheck, UserX } from "lucide-react";
import DataTable, { getColumnSearchProps } from "../../../components/common/DataTable";
import { useUsersPage } from "./useUsersPage";
import UserModal from "./components/UserModal";

const UsersPage = () => {
  const {
    data,
    loading,
    total,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    isModalVisible,
    editingRecord,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseModal,
    handleSave,
    handleDelete,
    handleToggleBlock,
    handleOpenDetails,
  } = useUsersPage();

  const columns = [
    {
      title: "العضو",
      dataIndex: "full_name",
      key: "full_name",
      ...getColumnSearchProps("full_name", "ابحث باسم العضو..."),
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={record.profile?.profile_picture || null}
            icon={<Users className="w-4 h-4" />}
            className="bg-primary/10 text-primary border-2 border-white shadow-sm"
          />
          <div>
            <div className="font-semibold text-gray-800">{text}</div>
            <div className="text-xs text-gray-400">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "رقم الهاتف",
      dataIndex: "phone_number",
      key: "phone_number",
      render: (phone, record) => (
        <span dir="ltr">
          {record.country_code} {phone || "-"}
        </span>
      ),
    },
    {
      title: "الجنس",
      dataIndex: "gender",
      key: "gender",
      width: 100,
      filters: [
        { text: "ذكر", value: "male" },
        { text: "أنثى", value: "female" },
      ],
      onFilter: (value, record) => record.gender === value,
      render: (gender) => (
        <Tag color={gender === "male" ? "blue" : "pink"}>
          {gender === "male" ? "ذكر" : "أنثى"}
        </Tag>
      ),
    },
    {
      title: "الحالة",
      dataIndex: "is_verified",
      key: "is_verified",
      width: 120,
      render: (is_verified) => (
        <Tag color={is_verified ? "success" : "error"} className="rounded-full px-3">
          {is_verified ? "نشط" : "محظور"}
        </Tag>
      ),
    },
    {
      title: "تاريخ التسجيل",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => (date ? new Date(date).toLocaleDateString("ar-EG") : "-"),
    },
    {
      title: "الإجراءات",
      key: "actions",
      width: 180,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title={record.is_verified ? "حظر المستخدم" : "تفعيل المستخدم"}>
            <Button
              type="text"
              icon={record.is_verified ? <UserX className="w-4 h-4 text-orange-500" /> : <UserCheck className="w-4 h-4 text-green-500" />}
              className={`flex items-center justify-center hover:bg-${record.is_verified ? "orange" : "green"}-50`}
              onClick={() => handleToggleBlock(record)}
            />
          </Tooltip>
          <Tooltip title="عرض التفاصيل">
            <Button
              type="text"
              icon={<Eye className="w-4 h-4 text-primary" />}
              className="flex items-center justify-center hover:bg-primary/10"
              onClick={() => handleOpenDetails(record)}
            />
          </Tooltip>
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
              <Users className="w-6 h-6 text-primary" />
            </div>
            إدارة المستخدمين
          </h1>
          <p className="text-gray-500 mt-1 text-sm">إدارة حسابات الأعضاء والتحقق من حالاتهم</p>
        </div>
        <div className="flex gap-3">
           <div className="bg-primary/10 rounded-xl px-4 py-2 text-center">
            <div className="text-lg font-bold text-primary">{total}</div>
            <div className="text-xs text-primary">إجمالي المستخدمين</div>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        searchPlaceholder="ابحث في المستخدمين..."
        addButton={true}
        addButtonText="إضافة مستخدم جديد"
        onAddClick={handleOpenAdd}
        emptyText="لا يوجد مستخدمين مسجلين حالياً"
        emptyIcon={Users}
        pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            onChange: (page, limit) => {
                setCurrentPage(page);
                setPageSize(limit);
            }
        }}
      />

      {/* مودال الإضافة وتعديل الحساب */}
      <UserModal
        visible={isModalVisible}
        onCancel={handleCloseModal}
        onSave={handleSave}
        initialData={editingRecord}
        loading={loading}
      />
    </div>
  );
};

export default UsersPage;
