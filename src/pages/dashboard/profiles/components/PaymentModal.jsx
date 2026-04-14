import React, { useState, useEffect } from "react";
import {
  Modal,
  Steps,
  Button,
  Tag,
  Space,
  Typography,
  InputNumber,
  Timeline,
  Select,
  Card,
} from "antd";
import {
  DollarSign,
  Send,
  CheckCircle,
  Clock,
  Edit3,
  X,
  Check,
  Activity,
  Search,
  FileCheck,
  Users,
  XCircle,
  RefreshCw,
  ChevronDown,
} from "lucide-react";

import { stagesService } from "../../../../api/services/stage.service";
import api from "../../../../api/axios";
import { message, Spin } from "antd";

const { Text } = Typography;

// ==================== Payment Stages ====================
const mockStages = [
  {
    id: 1,
    name: "المرحلة الأولى - تقديم الطلب",
    price: 500,
    status: "paid",
  },
  {
    id: 2,
    name: "المرحلة الثانية - قبول الطلب وجاري البحث عن شريك",
    price: 1500,
    status: "unpaid",
  },
  {
    id: 3,
    name: "المرحلة الثالثة - نزول مقابلة بين الطرفين",
    price: 5000,
    status: "pending",
  },
];

// ==================== Status Track Config ====================
const STATUS_TRACK = [
  {
    key: "reviewing",
    label: "جاري مراجعة البيانات",
    icon: <FileCheck className="w-4 h-4" />,
    color: "blue",
    dotColor: "#3b82f6",
    description: "يتم مراجعة بيانات الملف الشخصي من قِبل الفريق",
  },
  {
    key: "searching",
    label: "تم قبول الطلب وجاري البحث عن شريك",
    icon: <Search className="w-4 h-4" />,
    color: "orange",
    dotColor: "#f97316",
    description: "تم قبول الطلب والفريق يبحث عن شريك مناسب",
  },
  {
    key: "re_searching",
    label: "جاري البحث عن شريك مرة أخرى",
    icon: <RefreshCw className="w-4 h-4" />,
    color: "purple",
    dotColor: "#8b5cf6",
    description: "يتم البحث من جديد عن شريك أكثر ملاءمة",
  },
  {
    key: "preparing_meeting",
    label: "التحضير للمقابلة",
    icon: <Users className="w-4 h-4" />,
    color: "cyan",
    dotColor: "#06b6d4",
    description: "تم إيجاد شريك مناسب ويتم التحضير للمقابلة",
  },
  {
    key: "completed",
    label: "تم انتهاء الخدمة",
    icon: <CheckCircle className="w-4 h-4" />,
    color: "green",
    dotColor: "#22c55e",
    description: "تم إتمام الخدمة بنجاح",
  },
  {
    key: "cancelled",
    label: "تم إلغاء الطلب",
    icon: <XCircle className="w-4 h-4" />,
    color: "red",
    dotColor: "#ef4444",
    description: "تم إلغاء الطلب",
  },
];

// ==================== Status Track Modal ====================
const StatusTrackModal = ({ visible, onCancel, record }) => {
  const [currentStatus, setCurrentStatus] = useState("searching");

  const [statusHistory, setStatusHistory] = useState([
    {
      key: "reviewing",
      label: "جاري مراجعة البيانات",
      timestamp: "2024-01-15 10:30",
      by: "الإدارة",
    },
    {
      key: "searching",
      label: "تم قبول الطلب وجاري البحث عن شريك",
      timestamp: "2024-01-16 14:20",
      by: "الإدارة",
    },
  ]);
  const [selectedNewStatus, setSelectedNewStatus] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const currentStatusConfig = STATUS_TRACK.find((s) => s.key === currentStatus);

  const handleUpdateStatus = () => {
    if (!selectedNewStatus) return;

    setIsUpdating(true);
    setTimeout(() => {
      const newStatusConfig = STATUS_TRACK.find(
        (s) => s.key === selectedNewStatus
      );

      setStatusHistory((prev) => [
        ...prev,
        {
          key: selectedNewStatus,
          label: newStatusConfig?.label,
          timestamp: new Date().toLocaleString("ar-EG"),
          by: "الإدارة",
        },
      ]);

      setCurrentStatus(selectedNewStatus);
      setSelectedNewStatus(null);
      setIsUpdating(false);
    }, 800);
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-primary">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <Activity className="w-5 h-5" />
          </div>
          <span>تتبع حالة الطلب</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={580}
      centered
    >
      <div className="py-4 space-y-5">
        {/* Record Info */}
        {record && (
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
            <div>
              <Text className="text-gray-500 text-xs">البروفايل الحالى</Text>
              <div className="font-semibold text-gray-800 text-base">
                {record.full_name}
              </div>
            </div>
            <div className="text-left">
              <Text className="text-gray-500 text-xs">الحالة الحالية</Text>
              <div className="mt-1">
                <Tag
                  color={currentStatusConfig?.color}
                  className="rounded-full px-3 py-0.5 flex items-center gap-1"
                >
                  {currentStatusConfig?.icon}
                  <span className="mr-1">{currentStatusConfig?.label}</span>
                </Tag>
              </div>
            </div>
          </div>
        )}

        {/* Current Status Banner */}
        <div
          className="p-4 rounded-xl border-2 flex items-center gap-3"
          style={{
            borderColor: currentStatusConfig?.dotColor,
            background: `${currentStatusConfig?.dotColor}10`,
          }}
        >
          <div
            className="p-2 rounded-full"
            style={{
              background: `${currentStatusConfig?.dotColor}20`,
              color: currentStatusConfig?.dotColor,
            }}
          >
            {currentStatusConfig?.icon}
          </div>
          <div>
            <div className="font-bold text-gray-800 text-sm">
              {currentStatusConfig?.label}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              {currentStatusConfig?.description}
            </div>
          </div>
        </div>

        {/* Update Status */}
        <Card
          size="small"
          className="rounded-xl border border-gray-100"
          title={
            <span className="text-sm font-semibold text-gray-700">
              تحديث الحالة
            </span>
          }
        >
          <div className="flex items-center gap-3">
            <Select
              placeholder="اختر الحالة الجديدة..."
              className="flex-1"
              value={selectedNewStatus}
              onChange={setSelectedNewStatus}
              suffixIcon={<ChevronDown className="w-4 h-4" />}
              options={STATUS_TRACK.filter((s) => s.key !== currentStatus).map(
                (s) => ({
                  value: s.key,
                  label: (
                    <div className="flex items-center gap-2">
                      <span style={{ color: s.dotColor }}>{s.icon}</span>
                      <span>{s.label}</span>
                    </div>
                  ),
                })
              )}
            />
            <Button
              type="primary"
              onClick={handleUpdateStatus}
              disabled={!selectedNewStatus}
              loading={isUpdating}
              className="bg-primary flex items-center gap-1 shrink-0"
            >
              <Check className="w-4 h-4" />
              تحديث
            </Button>
          </div>
        </Card>

        {/* History Timeline */}
        <div>
          <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            سجل الحالات
          </div>

          <div className="max-h-52 overflow-y-auto pr-1">
            <Timeline
              mode="right"
              items={[...statusHistory].reverse().map((item, index) => {
                const config = STATUS_TRACK.find((s) => s.key === item.key);
                return {
                  dot: (
                    <div
                      className="flex items-center justify-center w-6 h-6 rounded-full"
                      style={{
                        background: `${config?.dotColor}20`,
                        color: config?.dotColor,
                        border: `2px solid ${config?.dotColor}`,
                      }}
                    >
                      {config?.icon &&
                        React.cloneElement(config.icon, {
                          className: "w-3 h-3",
                        })}
                    </div>
                  ),
                  children: (
                    <div
                      className={`pb-2 ${index === 0 ? "opacity-100" : "opacity-70"}`}
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <Tag
                          color={config?.color}
                          className="rounded-full text-xs px-2"
                        >
                          {item.label}
                        </Tag>
                        {index === 0 && (
                          <Tag
                            color="gold"
                            className="rounded-full text-xs px-2"
                          >
                            الحالة الحالية
                          </Tag>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {item.timestamp}
                        <span className="text-gray-300">•</span>
                        <span>{item.by}</span>
                      </div>
                    </div>
                  ),
                };
              })}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

// ==================== Payment Modal ====================
const PaymentModal = ({ visible, onCancel, record, onSend }) => {
  const [loadingStageId, setLoadingStageId] = useState(null);

  const [stages, setStages] = useState([]);
  const [loadingStages, setLoadingStages] = useState(false);
  const [userPayments, setUserPayments] = useState([]);

  // Custom price per stage
  const [customPrices, setCustomPrices] = useState({});
  const [editingStageId, setEditingStageId] = useState(null);
  const [tempPrice, setTempPrice] = useState(null);

  // Status Track Modal
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);

  const handleConfirmPrice = (stageId) => {
    if (tempPrice !== null && tempPrice > 0) {
      setCustomPrices((prev) => ({ ...prev, [stageId]: tempPrice }));
    }
    setEditingStageId(null);
    setTempPrice(null);
  };

  const handleCancelEdit = () => {
    setEditingStageId(null);
    setTempPrice(null);
  };

  const handleEditClick = (stage) => {
    setTempPrice(getFinalPrice(stage));
    setEditingStageId(stage.id);
  };

  const handleResetPrice = (stageId) => {
    setCustomPrices((prev) => {
      const next = { ...prev };
      delete next[stageId];
      return next;
    });
  };

  // ✅ Fetch stages + user payments
  useEffect(() => {
    if (visible && record?.id) {
      fetchData();
    }
  }, [visible, record]);

  const fetchData = async () => {
    setLoadingStages(true);
    try {
      const [stagesRes, paymentsRes] = await Promise.all([
        stagesService.getStages(),
        api.get(`/admin/payments/user/${record.id}`),
      ]);
      setStages(stagesRes.data || []);
      setUserPayments(paymentsRes.data?.data || []);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoadingStages(false);
    }
  };

  // ✅ استبدل handleSend
  const handleSend = async (stage) => {
    setLoadingStageId(stage.id);
    try {
      await api.post("/admin/payments/create", {
        userId: record.id,
        title: stage.title,
        price: getFinalPrice(stage),
      });
      message.success(`تم إرسال المطالبة: ${stage.title}`);
      await fetchData(); // ✅ refresh
      if (onSend) onSend(stage);
    } catch (error) {
      message.error("فشل في إرسال المطالبة");
    } finally {
      setLoadingStageId(null);
    }
  };

  // ✅ السعر الافتراضي من الـ stage
  const getFinalPrice = (stage) =>
    customPrices[stage.id] ?? parseFloat(stage.price);

  const isCustomPrice = (stage) =>
    customPrices[stage.id] !== undefined &&
    customPrices[stage.id] !== parseFloat(stage.price);

  // ✅ هل المرحلة دي اتبعتلها مطالبة قبل كده
  const getPaymentForStage = (stage) =>
    userPayments.find((p) => p.title === stage.title);

  return (
    <>
      <Modal
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <DollarSign className="w-5 h-5" />
              </div>
              <span>المدفوعات والمراحل</span>
            </div>
            {/* ✅ زرار تتبع الحالة */}
            <Button
              type="default"
              size="small"
              icon={<Activity className="w-4 h-4" />}
              className="flex items-center gap-1 border-blue-300 text-blue-600 hover:bg-blue-50 ml-8"
              onClick={() => setIsStatusModalVisible(true)}
            >
              تتبع الحالة
            </Button>
          </div>
        }
        open={visible}
        onCancel={onCancel}
        footer={null}
        width={650}
        centered
        className="payment-modal"
      >
        <div className="py-4">
          {/* Record Info */}
          {record && (
            <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
              <div>
                <Text className="text-gray-500 text-xs">البروفايل الحالى</Text>
                <div className="font-semibold text-gray-800 text-base">
                  {record.full_name}
                </div>
              </div>
              <div className="text-left">
                <Text className="text-gray-500 text-xs">
                  ⚡ يمكنك الإرسال بأي ترتيب
                </Text>
                <div className="text-xs text-gray-400 mt-1">
                  المراحل غير مرتبطة ببعضها
                </div>
              </div>
            </div>
          )}

          {/* Stages List */}
          <div className="space-y-4">
            {/* Stages List */}
            {loadingStages ? (
              <div className="flex items-center justify-center py-10">
                <Spin size="large" />
              </div>
            ) : (
              <div className="space-y-4">
                {stages
                  .filter((s) => s.is_active === 1)
                  .map((stage, index) => {
                    const existingPayment = getPaymentForStage(stage);
                    const isPaid = existingPayment?.status === "paid";
                    const isPending = existingPayment?.status === "pending";
                    const isEditing = editingStageId === stage.id;
                    const originalPrice = parseFloat(stage.price);
                    const finalPrice = getFinalPrice(stage);
                    const hasCustomPrice = isCustomPrice(stage);

                    return (
                      <div
                        key={stage.id}
                        className={`rounded-xl border-2 overflow-hidden transition-all ${
                          isPaid
                            ? "border-green-200 bg-green-50/30"
                            : isPending
                              ? "border-orange-200 bg-orange-50/30"
                              : "border-gray-100 bg-white"
                        }`}
                      >
                        {/* Stage Header */}
                        <div
                          className={`flex items-center justify-between px-4 py-3 ${
                            isPaid
                              ? "bg-green-50"
                              : isPending
                                ? "bg-orange-50"
                                : "bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                isPaid
                                  ? "bg-green-500 text-white"
                                  : isPending
                                    ? "bg-orange-400 text-white"
                                    : "bg-gray-200 text-gray-600"
                              }`}
                            >
                              {isPaid ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : isPending ? (
                                <Clock className="w-4 h-4" />
                              ) : (
                                index + 1
                              )}
                            </div>
                            <div>
                              <span className="font-semibold text-gray-800 text-sm">
                                {stage.title}
                              </span>
                              {stage.details && (
                                <div className="text-xs text-gray-400 mt-0.5">
                                  {stage.details}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Price */}
                          <div className="flex items-center gap-2">
                            {hasCustomPrice && (
                              <span className="text-gray-400 line-through text-xs">
                                {originalPrice} €
                              </span>
                            )}
                            <span
                              className={`font-bold text-base ${
                                hasCustomPrice
                                  ? "text-green-600"
                                  : isPaid
                                    ? "text-green-600"
                                    : "text-primary"
                              }`}
                            >
                              {existingPayment
                                ? existingPayment.price
                                : finalPrice}{" "}
                              €
                            </span>
                            {hasCustomPrice && (
                              <Tag
                                color="green"
                                className="text-xs rounded-full m-0"
                              >
                                مخصص
                              </Tag>
                            )}
                          </div>
                        </div>

                        {/* Stage Body */}
                        <div className="px-4 py-3">
                          <div className="flex items-center justify-between flex-wrap gap-3">
                            {/* Status Tag */}
                            <div className="flex items-center gap-2">
                              {isPaid ? (
                                <Tag
                                  color="success"
                                  icon={
                                    <CheckCircle className="w-3 h-3 inline ml-1" />
                                  }
                                  className="rounded-full px-3 py-1"
                                >
                                  تم الدفع
                                </Tag>
                              ) : isPending ? (
                                <Tag
                                  color="warning"
                                  icon={
                                    <Clock className="w-3 h-3 inline ml-1" />
                                  }
                                  className="rounded-full px-3 py-1"
                                >
                                  في انتظار الدفع
                                </Tag>
                              ) : (
                                <Tag
                                  color="default"
                                  className="rounded-full px-3 py-1"
                                >
                                  لم تُرسل بعد
                                </Tag>
                              )}

                              {/* ✅ رابط الدفع لو pending */}
                              {isPending &&
                                existingPayment?.paymentDetails?.url && (
                                  <a
                                    href={existingPayment.paymentDetails.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                                  >
                                    رابط الدفع ↗
                                  </a>
                                )}
                            </div>

                            {/* Actions - بس لو مش paid */}
                            {!isPaid && (
                              <div className="flex items-center gap-2 flex-wrap">
                                {isEditing ? (
                                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                                    <InputNumber
                                      min={1}
                                      value={tempPrice}
                                      onChange={(val) => setTempPrice(val)}
                                      className="w-28"
                                      placeholder="أدخل السعر"
                                      suffix="€"
                                      autoFocus
                                    />
                                    <button
                                      onClick={() =>
                                        handleConfirmPrice(stage.id)
                                      }
                                      className="flex items-center justify-center w-7 h-7 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
                                    >
                                      <Check className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={handleCancelEdit}
                                      className="flex items-center justify-center w-7 h-7 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md transition-colors"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleEditClick(stage)}
                                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary border border-gray-200 hover:border-primary/50 rounded-lg px-2 py-1.5 transition-all bg-white"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                      <span>تعديل السعر</span>
                                    </button>
                                    {hasCustomPrice && (
                                      <button
                                        onClick={() =>
                                          handleResetPrice(stage.id)
                                        }
                                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 rounded-lg px-2 py-1.5 transition-all bg-white"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                        <span>افتراضي</span>
                                      </button>
                                    )}
                                  </div>
                                )}

                                {!isEditing && (
                                  <Button
                                    type="primary"
                                    onClick={() => handleSend(stage)}
                                    loading={loadingStageId === stage.id}
                                    icon={<Send className="w-4 h-4 ml-1" />}
                                    className="bg-primary hover:bg-primary/90 flex items-center justify-center rounded-lg"
                                  >
                                    {isPending
                                      ? "إعادة إرسال"
                                      : "إرسال المطالبة"}
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Price Summary */}
                          {hasCustomPrice && !isEditing && (
                            <div className="mt-3 pt-3 border-t border-dashed border-gray-200">
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-3 text-gray-500">
                                  <span>
                                    الأصلي:{" "}
                                    <span className="line-through">
                                      {originalPrice} €
                                    </span>
                                  </span>
                                  <span className="text-gray-300">|</span>
                                  <span>
                                    الفرق:{" "}
                                    <span
                                      className={
                                        finalPrice < originalPrice
                                          ? "text-red-500 font-medium"
                                          : "text-green-500 font-medium"
                                      }
                                    >
                                      {finalPrice < originalPrice ? "-" : "+"}
                                      {Math.abs(originalPrice - finalPrice)} €
                                    </span>
                                  </span>
                                </div>
                                <span className="font-bold text-green-600">
                                  النهائي: {finalPrice} €
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* ✅ Status Track Modal */}
      <StatusTrackModal
        visible={isStatusModalVisible}
        onCancel={() => setIsStatusModalVisible(false)}
        record={record}
      />
    </>
  );
};

export default PaymentModal;
