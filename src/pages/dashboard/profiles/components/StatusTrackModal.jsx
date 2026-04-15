import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Tag,
  Typography,
  Input,
  Avatar,
  Select,
  message,
} from "antd";
import {
  Activity,
  FileCheck,
  Search,
  Users,
  CheckCircle,
  RefreshCw,
  Clock,
  Check,
  MessageSquare,
  Shield,
  User,
  ChevronDown,
} from "lucide-react";
import dayjs from "dayjs";
import api from "../../../../api/axios"; // ✅
const { TextArea } = Input;

// ==================== Config ====================
const STATUS_TRACK = [
  {
    key: "reviewing",
    label: "جاري مراجعة البيانات",
    icon: FileCheck,
    color: "blue",
    dotColor: "#3b82f6",
    description: "يتم مراجعة بيانات الملف الشخصي من قِبل الفريق",
  },
  {
    key: "searching",
    label: "تم قبول الطلب وجاري البحث عن شريك",
    icon: Search,
    color: "orange",
    dotColor: "#f97316",
    description: "تم قبول الطلب والفريق يبحث عن شريك مناسب",
  },

  {
    key: "re_searching",
    label: "جاري البحث عن شريك مرة أخرى",
    icon: RefreshCw,
    color: "purple",
    dotColor: "#8b5cf6",
    description: "يتم البحث من جديد عن شريك أكثر ملاءمة",
  },
  {
    key: "preparing_meeting",
    label: "التحضير للمقابلة",
    icon: Users,
    color: "cyan",
    dotColor: "#06b6d4",
    description: "تم إيجاد شريك مناسب ويتم التحضير للمقابلة",
  },

  {
    key: "waiting_client_response",
    label: "في انتظار رد بعد المقابلة",
    icon: Clock,
    color: "orange",
    dotColor: "#f97316",
    description: "في انتظار رد العميل بعد المقابلة",
  },
  {
    key: "completed",
    label: "تم انتهاء الخدمة",
    icon: CheckCircle,
    color: "green",
    dotColor: "#22c55e",
    description: "تم إتمام الخدمة بنجاح",
  },
];

const INITIAL_HISTORY = [
  {
    id: 1,
    statusKey: "reviewing",
    timestamp: "2024-01-15 10:30",
    byName: "الإدارة",
    note: "تم استلام الملف وبدء المراجعة",
  },
  {
    id: 2,
    statusKey: "searching",
    timestamp: "2024-01-16 14:20",
    byName: "الإدارة",
    note: "تم قبول الملف الشخصي وبدأنا البحث عن شريك مناسب",
  },
];

// ==================== StatusTrackModal ====================
const StatusTrackModal = ({ visible, onCancel, record }) => {
  const [currentStatus, setCurrentStatus] = useState("searching");
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [selectedNewStatus, setSelectedNewStatus] = useState(null);
  const [adminNote, setAdminNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [loadingData, setLoadingData] = useState(false); // ✅ جديد

  useEffect(() => {
    if (visible && record) {
      const trackingHistory = record.user_tracking_history || [];

      // ✅ فلتر الـ null entries
      const validHistory = trackingHistory
        .filter((item) => item.status !== null)
        .map((item, i) => ({
          id: i + 1,
          statusKey: item.status,
          timestamp: item.history_date
            ? dayjs(item.history_date).format("YYYY-MM-DD HH:mm")
            : "-",
          byName: "الإدارة",
          notes: item.note || "",
        }));

      setHistory(validHistory);

      // ✅ آخر status هو الحالي
      const lastValid = [...trackingHistory]
        .reverse()
        .find((item) => item.status !== null);
      setCurrentStatus(lastValid?.status || null);
    }
  }, [visible, record]);

  const handleUpdate = async () => {
    if (!selectedNewStatus || !record?.user_id) return;
    setIsUpdating(true);
    try {
      await api.post(
        `/admin/users/${record.user_id}/profile/tracking-history`,
        {
          status: selectedNewStatus,
          notes: adminNote || "",
        }
      );

      // ✅ أضف للـ history locally
      const newEntry = {
        id: history.length + 1,
        statusKey: selectedNewStatus,
        timestamp: dayjs().format("YYYY-MM-DD HH:mm"),
        byName: "الإدارة",
        notes: adminNote || "",
      };

      setHistory((prev) => [...prev, newEntry]);
      setCurrentStatus(selectedNewStatus);
      setSelectedNewStatus(null);
      setAdminNote("");
      message.success("تم تحديث الحالة بنجاح");
    } catch (error) {
      console.error("Update Status Error:", error);
      message.error("فشل في تحديث الحالة");
    } finally {
      setIsUpdating(false);
    }
  };

  const currentConfig = STATUS_TRACK.find((s) => s.key === currentStatus);
  const CurrentIcon = currentConfig?.icon;

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={580}
      centered
      title={
        <div className="flex items-center gap-2 text-primary">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <Activity className="w-5 h-5" />
          </div>
          <span>تتبع حالة الطلب</span>
        </div>
      }
    >
      <div className="max-h-[70vh] overflow-y-auto flex flex-col gap-4 pt-3">
        {/* Record Info */}
        {record && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-3">
              <Avatar
                size={36}
                icon={<User className="w-4 h-4" />}
                className="bg-primary/10 text-primary"
              />
              <div>
                <div className="font-semibold text-gray-800 text-sm">
                  {record.full_name}
                </div>
                <div className="text-xs text-gray-400">البروفايل الحالى</div>
              </div>
            </div>
            <Tag
              color={currentConfig?.color}
              className="rounded-full px-3 flex items-center gap-1"
            >
              {CurrentIcon && <CurrentIcon className="w-3 h-3 inline ml-1" />}
              {currentConfig?.label}
            </Tag>
          </div>
        )}

        {!currentStatus && (
          <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <Activity className="w-10 h-10 mx-auto mb-2 text-gray-300" />
            <p className="text-gray-400 text-sm">لم يتم تحديد حالة بعد</p>
            <p className="text-gray-300 text-xs mt-1">
              اختر حالة من الأسفل للبدء
            </p>
          </div>
        )}

        {/* Current Status Banner */}
        <div
          className="flex items-center gap-3 p-4 rounded-xl border-2 justify-between"
          style={{
            borderColor: currentConfig?.dotColor,
            background: `${currentConfig?.dotColor}10`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-full shrink-0"
              style={{
                background: `${currentConfig?.dotColor}20`,
                color: currentConfig?.dotColor,
              }}
            >
              {CurrentIcon && <CurrentIcon className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-0.5">الحالة الحالية</div>
              <div className="font-bold text-gray-800">
                {currentConfig?.label}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                {currentConfig?.description}
              </div>
            </div>
          </div>
          <Tag
            color={currentConfig?.color}
            className="rounded-full px-3 py-1 mr-auto shrink-0"
          >
            نشط
          </Tag>
        </div>

        {/* Update Status */}
        <div className="flex flex-col gap-2 p-4 rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
            <Activity className="w-4 h-4 text-primary" />
            تحديث الحالة
          </div>

          <Select
            placeholder="اختر الحالة الجديدة..."
            className="w-full"
            value={selectedNewStatus}
            onChange={setSelectedNewStatus}
            suffixIcon={<ChevronDown className="w-4 h-4" />}
            options={STATUS_TRACK.filter((s) => s.key !== currentStatus).map(
              (s) => {
                const Icon = s.icon;
                return {
                  value: s.key,
                  label: (
                    <div className="flex items-center gap-2">
                      <Icon
                        className="w-4 h-4 shrink-0"
                        style={{ color: s.dotColor }}
                      />
                      <span>{s.label}</span>
                    </div>
                  ),
                };
              }
            )}
          />

          <TextArea
            placeholder="أضف ملاحظة (اختياري)..."
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            rows={2}
            className="resize-none rounded-lg"
          />

          <Button
            type="primary"
            onClick={handleUpdate}
            disabled={!selectedNewStatus}
            loading={isUpdating}
            icon={<Check className="w-4 h-4" />}
            className="bg-primary w-full flex items-center justify-center gap-2"
          >
            تحديث الحالة
          </Button>
        </div>

        {/* History */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Clock className="w-4 h-4 text-gray-400" />
            سجل التحديثات
            <Tag color="blue" className="rounded-full text-xs mr-auto">
              {history.length} تحديث
            </Tag>
          </div>

          {[...history].reverse().map((item, index) => {
            const config = STATUS_TRACK.find((s) => s.key === item.statusKey);
            const Icon = config?.icon;
            const isLatest = index === 0;

            return (
              <div
                key={item.id}
                className="flex gap-3 p-3 rounded-xl border"
                style={{
                  borderColor: isLatest ? `${config?.dotColor}40` : "#f3f4f6",
                  background: isLatest ? `${config?.dotColor}08` : "#fafafa",
                }}
              >
                {/* Icon */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: `${config?.dotColor}20`,
                    color: config?.dotColor,
                    border: `2px solid ${config?.dotColor}40`,
                  }}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag
                      color={config?.color}
                      className="rounded-full text-xs px-2 m-0"
                    >
                      {config?.label}
                    </Tag>
                    {isLatest && (
                      <Tag
                        color="gold"
                        className="rounded-full text-xs px-2 m-0"
                      >
                        الأحدث
                      </Tag>
                    )}
                  </div>

                  {item.note && (
                    <div className="flex items-start gap-1.5 mt-1.5">
                      <MessageSquare className="w-3 h-3 text-gray-400 mt-0.5 shrink-0" />
                      <p className="text-xs text-gray-600">{item.note}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-400">
                    <Shield className="w-3 h-3" />
                    <span>{item.byName}</span>
                    <span>•</span>
                    <Clock className="w-3 h-3" />
                    <span>{item.timestamp}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default StatusTrackModal;
