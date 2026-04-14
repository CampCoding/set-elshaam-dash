// src/pages/dashboard/Profiles/ProfilesPage.jsx
import React, { useState } from "react";
import {
  Tag,
  Space,
  Button,
  Tooltip,
  Avatar,
  Image,
  Select,
  Row,
  Col,
  Card,
  Dropdown,
  Badge,
} from "antd";
import {
  Trash2,
  Eye,
  UserX,
  RefreshCw,
  Filter,
  X,
  MoreVertical,
  User,
  Users,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  Cigarette,
  Heart,
  Briefcase,
  DollarSign,
  Activity,
} from "lucide-react";
import DataTable from "../../../components/common/DataTable";
import { useProfilesPage } from "./useProfilesPage";
import ProfileModal from "./components/ProfileModal";
import PaymentModal from "./components/PaymentModal";
import {
  NATIONALITIES,
  MARITAL_STATUS,
  GENDERS,
  INCOME_SOURCES,
  RELIGION_COMMITMENT,
  getLabelByValue,
} from "../../../constants/userOptions";
import StatusTrackModal from "./components/StatusTrackModal";

const ProfilesPage = () => {
  const {
    data,
    loading,
    total,
    searchValue,
    handleSearch,
    tableParams,
    handleTableChange,
    filters,
    handleFilterChange,
    handleResetFilters,
    handleRefresh,
    hasActiveFilters,
    activeFiltersCount,
    isModalVisible,
    editingRecord,
    handleCloseModal,
    handleSave,
    handleDelete,
    handleToggleBlock,
    handleViewProfile,
    isPaymentModalVisible,
    paymentRecord,
    handleOpenPayment,
    handleClosePayment,
    handleSendInvoice,
  } = useProfilesPage();

  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [statusRecord, setStatusRecord] = useState(null);

  // Calculate age from birthdate
  const calculateAge = (birthdate) => {
    if (!birthdate) return null;
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Filter options
  const verifiedOptions = [
    { value: 1, label: "موثق" },
    { value: 0, label: "غير موثق" },
  ];

  const smokerOptions = [
    { value: 0, label: "غير مدخن" },
    { value: 1, label: "مدخن" },
  ];

  // Actions Dropdown Menu
  const getActionItems = (record) => [
    {
      key: "view",
      icon: <Eye className="w-4 h-4" />,
      label: "عرض البروفايل",
      onClick: () => handleViewProfile(record),
    },
    { type: "divider" },
    {
      key: "block",
      icon: <UserX className="w-4 h-4" />,
      label: record.is_blocked ? "إلغاء الحظر" : "حظر",
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

  // Table Columns
  const columns = [
    {
      title: "البروفايل",
      dataIndex: "full_name",
      key: "full_name",
      fixed: "left",
      width: 280,
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar
              size={50}
              src={
                record.profile_picture ? (
                  <Image
                    src={record.profile_picture}
                    alt={text}
                    preview={{ mask: <Eye className="w-4 h-4" /> }}
                    style={{ objectFit: "cover" }}
                  />
                ) : null
              }
              icon={!record.profile_picture && <User className="w-5 h-5" />}
              className="bg-primary/10 text-primary border-2 border-white shadow-md"
            />
            {record.is_verified === 1 && (
              <Tooltip title="موثق">
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-white">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              </Tooltip>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-800 truncate">
              {text || "-"}
            </div>
            <div className="text-xs text-gray-400 truncate flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {record.email || "-"}
            </div>
            {record.phone_number && (
              <div className="text-xs text-gray-400 truncate flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span dir="ltr">{record.phone_number}</span>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "العمر / الجنس",
      key: "age_gender",
      width: 130,
      align: "center",
      render: (_, record) => {
        const age = calculateAge(record.date_of_birth);
        return (
          <Space direction="vertical" size={2} align="center">
            {age ? (
              <Tag color="blue" className="rounded-full px-3">
                {age} سنة
              </Tag>
            ) : (
              <Tag color="default" className="rounded-full px-3">
                -
              </Tag>
            )}
            <Tag
              color={record.gender === "male" ? "blue" : "pink"}
              className="rounded-full px-3"
            >
              {record.gender === "male" ? "♂ ذكر" : "♀ أنثى"}
            </Tag>
          </Space>
        );
      },
    },
    {
      title: "الجنسية",
      dataIndex: "nationality",
      key: "nationality",
      width: 120,
      align: "center",
      render: (nationality) =>
        nationality ? (
          <Tag color="geekblue" className="rounded-full">
            {getLabelByValue(NATIONALITIES, nationality)}
          </Tag>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      title: "الحالة الاجتماعية",
      dataIndex: "marital_status",
      key: "marital_status",
      width: 130,
      align: "center",
      render: (status) =>
        status ? (
          <Tag
            color={status === "single" ? "green" : "orange"}
            className="rounded-full"
            icon={<Heart className="w-3 h-3 ml-1 inline" />}
          >
            {getLabelByValue(MARITAL_STATUS, status)}
          </Tag>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      title: "مصدر الدخل",
      dataIndex: "income_source",
      key: "income_source",
      width: 120,
      align: "center",
      render: (source) =>
        source ? (
          <Tag color="purple" className="rounded-full">
            <Briefcase className="w-3 h-3 ml-1 inline" />
            {getLabelByValue(INCOME_SOURCES, source)}
          </Tag>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      title: "الالتزام الديني",
      dataIndex: "religion_commitment",
      key: "religion_commitment",
      width: 120,
      align: "center",
      render: (commitment) =>
        commitment ? (
          <Tag
            color={
              commitment === "committed"
                ? "green"
                : commitment === "sometimes" || commitment === "moderate"
                  ? "gold"
                  : "default"
            }
            className="rounded-full"
          >
            {getLabelByValue(RELIGION_COMMITMENT, commitment)}
          </Tag>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      title: "التدخين",
      dataIndex: "is_smoker",
      key: "is_smoker",
      width: 100,
      align: "center",
      render: (isSmoker) => (
        <Tag
          color={isSmoker ? "red" : "green"}
          className="rounded-full"
          icon={<Cigarette className="w-3 h-3 ml-1 inline" />}
        >
          {isSmoker ? "مدخن" : "غير مدخن"}
        </Tag>
      ),
    },
    {
      title: "الحالة",
      dataIndex: "is_verified",
      key: "is_verified",
      width: 100,
      align: "center",
      render: (isVerified) => (
        <Tag
          color={isVerified ? "success" : "default"}
          className="rounded-full px-3"
          icon={
            isVerified ? (
              <CheckCircle className="w-3 h-3 ml-1 inline" />
            ) : (
              <XCircle className="w-3 h-3 ml-1 inline" />
            )
          }
        >
          {isVerified ? "موثق" : "غير موثق"}
        </Tag>
      ),
    },
    {
      title: "تاريخ التسجيل",
      dataIndex: "created_at",
      key: "created_at",
      width: 130,
      render: (date) => (
        <span className="text-gray-500 text-sm">
          {date ? new Date(date).toLocaleDateString("ar-EG") : "-"}
        </span>
      ),
    },
    {
      title: "الإجراءات",
      key: "actions",
      width: 200,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="المراحل والدفع">
            <Button
              type="primary"
              ghost
              icon={<DollarSign className="w-4 h-4 text-white!" />}
              className="flex items-center justify-center border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600 hover:text-green-700"
              onClick={() => handleOpenPayment(record)}
            />
          </Tooltip>

          <Tooltip title="تتبع الحالة">
            <Button
              type="text"
              icon={<Activity className="w-4 h-4 text-blue-500" />}
              className="flex items-center justify-center hover:bg-blue-50"
              onClick={() => {
                setStatusRecord(record);
                setIsStatusModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="عرض">
            <Button
              type="text"
              icon={<Eye className="w-4 h-4 text-primary" />}
              className="flex items-center justify-center hover:bg-primary/10"
              onClick={() => handleViewProfile(record)}
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
              إدارة البروفايلات
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              إدارة البروفايلات الشخصية للمستخدمين
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

      {/* Filters Card */}
      <Card
        styles={{ root: { marginBottom: "10px" } }}
        className="shadow-sm border-gray-100"
      >
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-primary" />
          <span className="font-semibold text-gray-700">الفلاتر</span>
          {hasActiveFilters && (
            <Badge count={activeFiltersCount} size="small" />
          )}
        </div>

        <Row gutter={[16, 16]} align="middle">
          {/* Gender */}
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="الجنس"
              allowClear
              value={filters.gender}
              onChange={(val) => handleFilterChange("gender", val)}
              className="w-full"
              options={GENDERS}
            />
          </Col>

          {/* Marital Status */}
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="الحالة الاجتماعية"
              allowClear
              value={filters.marital_status}
              onChange={(val) => handleFilterChange("marital_status", val)}
              className="w-full"
              options={MARITAL_STATUS}
            />
          </Col>

          {/* Nationality */}
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="الجنسية"
              allowClear
              showSearch
              optionFilterProp="label"
              value={filters.nationality}
              onChange={(val) => handleFilterChange("nationality", val)}
              className="w-full"
              options={NATIONALITIES}
            />
          </Col>

          {/* Verified */}
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="حالة التوثيق"
              allowClear
              value={filters.is_verified}
              onChange={(val) => handleFilterChange("is_verified", val)}
              className="w-full"
              options={verifiedOptions}
            />
          </Col>

          {/* Income Source */}
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="مصدر الدخل"
              allowClear
              value={filters.income_source}
              onChange={(val) => handleFilterChange("income_source", val)}
              className="w-full"
              options={INCOME_SOURCES}
            />
          </Col>

          {/* Smoker */}
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="التدخين"
              allowClear
              value={filters.is_smoker}
              onChange={(val) => handleFilterChange("is_smoker", val)}
              className="w-full"
              options={smokerOptions}
            />
          </Col>

          {/* Religion Commitment */}
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="الالتزام الديني"
              allowClear
              value={filters.religion_commitment}
              onChange={(val) => handleFilterChange("religion_commitment", val)}
              className="w-full"
              options={RELIGION_COMMITMENT}
            />
          </Col>

          {/* Reset Button */}
          <Col xs={12} sm={6} md={4}>
            {hasActiveFilters && (
              <Button
                icon={<X className="w-4 h-4" />}
                onClick={handleResetFilters}
                danger
                className="w-full"
              >
                مسح الفلاتر
              </Button>
            )}
          </Col>
        </Row>
      </Card>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        searchable={true}
        searchPlaceholder="ابحث بالاسم أو البريد أو الهاتف..."
        searchValue={searchValue}
        onSearch={handleSearch}
        onChange={handleTableChange}
        emptyText="لا يوجد بروفايلات مسجلة حالياً"
        emptyIcon={Users}
        scroll={{ x: 1400 }}
        pagination={{
          current: tableParams.page,
          pageSize: tableParams.limit,
          total: total,
          showSizeChanger: true,
          showTotal: (total, range) => (
            <span className="text-gray-500">
              {range[0]}-{range[1]} من {total} بروفايل
            </span>
          ),
        }}
        rowClassName={(record, index) =>
          `${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`
        }
      />

      <ProfileModal
        visible={isModalVisible}
        onCancel={handleCloseModal}
        onSave={handleSave}
        initialData={editingRecord}
        loading={loading}
      />

      {/* Payment Modal */}
      <PaymentModal
        visible={isPaymentModalVisible}
        onCancel={handleClosePayment}
        record={paymentRecord}
        onSend={handleSendInvoice}
      />

      <StatusTrackModal
        visible={isStatusModalVisible}
        onCancel={() => setIsStatusModalVisible(false)}
        record={statusRecord}
      />
    </div>
  );
};

export default ProfilesPage;
