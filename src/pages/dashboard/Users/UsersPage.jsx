// src/pages/dashboard/Users/UsersPage.jsx
import React from "react";
import {
  Tag,
  Space,
  Button,
  Tooltip,
  Avatar,
  Image,
  Dropdown,
  Card,
  Input,
} from "antd";
import {
  Edit,
  Trash2,
  Users,
  Eye,
  UserCheck,
  UserX,
  RefreshCw,
  MoreVertical,
  User,
  CheckCircle,
  XCircle,
  UserCircle,
  Target,
  Phone,
  Mail,
  Search,
} from "lucide-react";
import DataTable from "../../../components/common/DataTable";
import { useUsersPage } from "./useUsersPage";
import UserModal from "./components/UserModal";

const UsersPage = () => {
  const {
    data,
    loading,
    total,
    tableParams,
    handleTableChange,
    searchValue,
    handleSearch,
    handleClearSearch,
    isModalVisible,
    editingRecord,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseModal,
    handleSave,
    handleDelete,
    handleToggleBlock,
    handleOpenDetails,
    handleRefresh,
  } = useUsersPage();

  // Actions Dropdown Menu
  const getActionItems = (record) => [
    {
      key: "view",
      icon: <Eye className="w-4 h-4" />,
      label: "عرض التفاصيل",
      onClick: () => handleOpenDetails(record),
    },
    {
      key: "edit",
      icon: <Edit className="w-4 h-4" />,
      label: "تعديل",
      onClick: () => handleOpenEdit(record),
    },
    { type: "divider" },
    {
      key: "block",
      icon: record.is_verified ? (
        <UserX className="w-4 h-4" />
      ) : (
        <UserCheck className="w-4 h-4" />
      ),
      label: record.is_verified ? "حظر المستخدم" : "تفعيل المستخدم",
      onClick: () => handleToggleBlock(record),
    },
    { type: "divider" },
    {
      key: "delete",
      icon: <Trash2 className="w-4 h-4" />,
      label: "حذف",
      danger: true,
      onClick: () => handleDelete(record),
    },
  ];

  // Table Columns with Built-in Filters
  const columns = [
    {
      title: "المستخدم",
      dataIndex: "full_name",
      key: "full_name",
      fixed: "left",
      width: 280,
      sorter: true,
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar
              size={50}
              src={
                record.profile?.profile_picture ? (
                  <Image
                    src={record.profile.profile_picture}
                    alt={text}
                    preview={{ mask: <Eye className="w-4 h-4" /> }}
                    style={{ objectFit: "cover" }}
                  />
                ) : null
              }
              icon={
                !record.profile?.profile_picture && <User className="w-5 h-5" />
              }
              className="bg-primary/10 text-primary border-2 border-white shadow-md"
            />
            {record.has_profile == 1 && (
              <Tooltip title="لديه بروفايل">
                <div className="absolute -bottom-1 -right-1 bg-green-500 cursor-help rounded-full p-0.5 border-2 border-white">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              </Tooltip>
            )}
            {record.has_target_profile == 1 && (
              <Tooltip title="لديه مواصفات شريك">
                <div className="absolute -bottom-1 -left-1 bg-red-500 cursor-help rounded-full p-0.5 border-2 border-white">
                  <Target className="w-3 h-3 text-white" />
                </div>
              </Tooltip>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-800 truncate">
              {text || "-"}
            </div>
            <div onClick={() => window.location.href = `mailto:${record.email}`} className="text-xs cursor-pointer text-gray-400 truncate flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {record.email || "-"}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "رقم الهاتف",
      dataIndex: "phone_number",
      key: "phone_number",
      width: 160,
      render: (phone, record) => (
        <div className="flex items-center gap-1 text-gray-600">
          <Phone className="w-3 h-3 text-primary" />
          <span dir="ltr">
            {record.country_code} {phone || "-"}
          </span>
        </div>
      ),
    },
    {
      title: "الجنس",
      dataIndex: "gender",
      key: "gender",
      width: 100,
      align: "center",
      filters: [
        { text: "ذكر", value: "male" },
        { text: "أنثى", value: "female" },
      ],
      filterMultiple: false,
      render: (gender) => (
        <Tag
          color={gender === "male" ? "blue" : "pink"}
          className="rounded-full px-3"
          icon={
            gender === "male" ? (
              <span className="ml-1">♂</span>
            ) : (
              <span className="ml-1">♀</span>
            )
          }
        >
          {gender === "male" ? "ذكر" : "أنثى"}
        </Tag>
      ),
    },
    {
      title: "البروفايل",
      dataIndex: "has_profile",
      key: "has_profile",
      width: 130,
      align: "center",
      filters: [
        { text: "لديه بروفايل", value: 1 },
        { text: "بدون بروفايل", value: 0 },
      ],
      filterMultiple: false,
      render: (hasProfile, record) => (
        <Space direction="vertical" size={2} align="center">
          <Tag
            color={hasProfile ? "success" : "default"}
            className="rounded-full px-2 flex! items-center!"
          >
            {hasProfile ? (
              <UserCircle className="w-3 h-3 ml-1" />
            ) : (
              <XCircle className="w-3 h-3 ml-1" />
            )}
            {hasProfile ? "موجود" : "غير موجود"}
          </Tag>
          {record.has_target_profile == 1 && (
            <Tag
              color="purple"
              className="rounded-full px-2 flex! items-center!"
            >
              <Target className="w-3 h-3 ml-1 inline" />
              هدف
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: "الحالة",
      dataIndex: "is_verified",
      key: "is_verified",
      width: 120,
      align: "center",
      render: (isVerified, record) => (
        <Space direction="vertical" size={2} align="center">
          <Tag
            color={isVerified ? "success" : "error"}
            className="rounded-full px-3 flex! items-center!"
            icon={
              isVerified ? (
                <CheckCircle className="w-3 h-3 ml-1" />
              ) : (
                <XCircle className="w-3 h-3 ml-1" />
              )
            }
          >
            {isVerified ? "نشط" : "محظور"}
          </Tag>
          {record.is_blocked && (
            <Tag color="red" className="rounded-full px-2 text-xs">
              محظور
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: "تاريخ التسجيل",
      dataIndex: "created_at",
      key: "created_at",
      width: 140,
      sorter: true,
      defaultSortOrder: "descend",
      render: (date) => (
        <span className="text-gray-500 text-sm">
          {date ? new Date(date).toLocaleDateString("ar-EG") : "-"}
        </span>
      ),
    },
    {
      title: "الإجراءات",
      key: "actions",
      width: 100,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="عرض">
            <Button
              type="text"
              icon={<Eye className="w-4 h-4 text-primary" />}
              className="flex items-center justify-center hover:bg-primary/10"
              onClick={() => handleOpenDetails(record)}
            />
          </Tooltip>
          <Dropdown
            menu={{ items: getActionItems(record) }}
            trigger={["click"]}
            placement="bottomLeft"
          >
            <Button
              type="text"
              icon={<MoreVertical className="w-4 h-4 text-gray-500" />}
              className="flex items-center justify-center hover:bg-gray-100"
            />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Users className="w-6 h-6 text-primary" />
              </div>
              إدارة المستخدمين
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              إدارة حسابات الأعضاء والتحقق من حالاتهم
            </p>
          </div>

          {/* Stats & Actions */}
          <div className="flex items-center gap-3">
            <Card
              size="small"
              className="bg-primary/5 border-primary/20 min-w-[90px]"
            >
              <div className="text-center">
                <div className="text-xl font-bold text-primary">{total}</div>
                <div className="text-xs text-primary/70">إجمالي</div>
              </div>
            </Card>

            <Tooltip title="تحديث">
              <Button
                icon={
                  <RefreshCw
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
                }
                onClick={handleRefresh}
                size="large"
              />
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Data Table with Built-in Filters */}
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        searchable={true}
        searchPlaceholder="ابحث بالاسم أو البريد أو الهاتف..."
        searchValue={searchValue}
        onSearch={handleSearch}
        onChange={handleTableChange}
        emptyText="لا يوجد مستخدمين مسجلين حالياً"
        emptyIcon={Users}
        scroll={{ x: 1200 }}
        pagination={{
          current: tableParams.page,
          pageSize: tableParams.limit,
          total: total,
          showSizeChanger: true,
          showTotal: (total, range) => (
            <span className="text-gray-500">
              {range[0]}-{range[1]} من {total} مستخدم
            </span>
          ),
        }}
        rowClassName={(record, index) =>
          `${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"} ${record.is_blocked ? "opacity-60" : ""
          }`
        }
      />

      {/* User Modal */}
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
