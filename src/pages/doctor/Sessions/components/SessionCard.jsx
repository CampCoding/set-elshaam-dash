// src/pages/doctor/Sessions/components/SessionCard.jsx
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  BookOpen,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { Dropdown, Popconfirm, Tag } from "antd";

const SessionCard = ({ session, onEdit, onDelete }) => {
  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format time
  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Check if session is past
  const isPast = () => {
    const sessionDateTime = new Date(
      `${session.session_date}T${session.session_time}`
    );
    return sessionDateTime < new Date();
  };

  // Status config
  const getStatusConfig = () => {
    if (isPast()) {
      return { color: "default", label: "Completed" };
    }
    switch (session.status) {
      case "active":
        return { color: "green", label: "Active" };
      case "cancelled":
        return { color: "red", label: "Cancelled" };
      case "full":
        return { color: "orange", label: "Full" };
      default:
        return { color: "blue", label: session.status };
    }
  };

  const statusConfig = getStatusConfig();

  // Dropdown menu items
  const menuItems = [
    {
      key: "edit",
      icon: <Edit className="w-4 h-4" />,
      label: "Edit Session",
      onClick: () => onEdit(session),
    },
    { type: "divider" },
    {
      key: "delete",
      icon: <Trash2 className="w-4 h-4" />,
      label: (
        <Popconfirm
          title="Delete this session?"
          description="This action cannot be undone."
          onConfirm={() => onDelete(session.id)}
          okText="Yes, Delete"
          cancelText="No"
          okButtonProps={{ danger: true }}
        >
          <span className="text-red-600">Delete Session</span>
        </Popconfirm>
      ),
      danger: true,
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
      {/* Header */}
      <div className="p-4 pb-3 border-b border-gray-50">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate text-lg">
              {session.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <BookOpen className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm text-gray-600 truncate">
                {session.topic}
              </span>
            </div>
          </div>

          {/* Actions Dropdown */}
          <Dropdown
            menu={{ items: menuItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100">
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>
          </Dropdown>
        </div>

        {/* Status Tag */}
        <div className="mt-3">
          <Tag color={statusConfig.color}>{statusConfig.label}</Tag>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Date */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Date</p>
            <p className="text-sm font-medium text-gray-900">
              {formatDate(session.session_date)}
            </p>
          </div>
        </div>

        {/* Time */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Time</p>
            <p className="text-sm font-medium text-gray-900">
              {formatTime(session.session_time)}
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-orange-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500">Location</p>
            <p className="text-sm font-medium text-gray-900 truncate">
              {session.address}
            </p>
          </div>
        </div>

        {/* Student Limit */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Student Limit</p>
            <p className="text-sm font-medium text-gray-900">
              {session.student_limit} students
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionCard;
