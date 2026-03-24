// src/pages/doctor/ReservedMeetings/ReservedMeetings.jsx
import { useEffect, useState } from "react";
import { Button, Tag, Tooltip, Popconfirm, Dropdown } from "antd";
import {
  Calendar,
  Clock,
  Mail,
  Phone,
  Play,
  Square,
  Link,
  FileText,
  Trash2,
  MoreVertical,
  ExternalLink,
  RefreshCw,
  Video,
} from "lucide-react";
import DataTable, {
  getColumnSearchProps,
  getColumnDateRangeProps,
  getColumnSelectFilterProps,
} from "../../../components/common/DataTable";
import useReservedMeetingsData from "./useReservedMeetingsData";
import StudentInfoCell from "./components/StudentInfoCell";
import MeetingActionModal from "./components/MeetingActionModal";

const ReservedMeetings = () => {
  const {
    meetings,
    loading,
    actionLoading,
    fetchMeetings,
    startMeeting,
    endMeeting,
    updateMeetingLink,
    updateMeetingNotes,
    cancelMeeting,
  } = useReservedMeetingsData();

  // Modal State
  const [modalState, setModalState] = useState({
    open: false,
    type: null, // 'link' | 'notes'
    meeting: null,
  });

  // ============ Modal Handlers ============
  const openLinkModal = (meeting) => {
    setModalState({ open: true, type: "link", meeting });
  };

  const openNotesModal = (meeting) => {
    setModalState({ open: true, type: "notes", meeting });
  };

  const closeModal = () => {
    setModalState({ open: false, type: null, meeting: null });
  };

  const handleModalSave = async (value) => {
    const { type, meeting } = modalState;
    let success = false;

    if (type === "link") {
      success = await updateMeetingLink(meeting.meeting_id, value);
    } else {
      success = await updateMeetingNotes(meeting.meeting_id, value);
    }

    if (success) closeModal();
  };

  // ============ Status Config ============
  const statusConfig = {
    pending: { color: "blue", label: "Pending" },
    ongoing: { color: "orange", label: "Ongoing" },
    ended: { color: "green", label: "Completed" },
  };

  // ============ Table Columns ============
  const columns = [
    {
      title: "Student",
      key: "student",
      fixed: "left",
      width: 200,
      ...getColumnSearchProps("student_name", "Search student..."),
      render: (_, record) => (
        <StudentInfoCell
          student={{
            name: record.student_name,
            nickname: record.student_nickname,
            avatar: record.student_avatar,
          }}
        />
      ),
    },
    {
      title: "Contact",
      key: "contact",
      width: 200,
      render: (_, record) => (
        <div className="space-y-1">
          <Tooltip title={record.student_email}>
            <div className="cursor-help flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="truncate max-w-[150px]">
                {record.student_email}
              </span>
            </div>
          </Tooltip>
          <Tooltip title={record.student_phone}>
            <div className="cursor-help flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4 text-gray-400" />
              <span>{record.student_phone}</span>
            </div>
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Date & Time",
      key: "datetime",
      width: 180,
      ...getColumnDateRangeProps("slot_date"),
      sorter: (a, b) => new Date(a.slot_date) - new Date(b.slot_date),
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{record.slot_date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>
              {record.start_time?.slice(0, 5)} - {record.end_time?.slice(0, 5)}
            </span>
          </div>
        </div>
      ),
    },

    {
      title: "Meeting Link",
      dataIndex: "meeting_url",
      key: "meeting_url",
      width: 150,
      align: "center",
      render: (url) =>
        url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-medium"
          >
            <Video className="w-4 h-4" />
            Join
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-gray-400 text-sm">Not set</span>
        ),
    },
    {
      title: "Notes",
      dataIndex: "student_notes",
      key: "student_notes",
      width: 200,
      ellipsis: true,
      render: (notes) =>
        notes ? (
          <Tooltip title={notes}>
            <span className="text-gray-600">{notes}</span>
          </Tooltip>
        ) : (
          <span className="text-gray-400 text-sm">No notes</span>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 120,
      align: "center",
      render: (_, record) => {
        const isPending = record.status === "pending";
        const isOngoing = record.status === "ongoing";
        const isEnded = record.status === "ended";

        const menuItems = [
          // Start Meeting (only for pending)
          isPending && {
            key: "start",
            icon: <Play className="w-4 h-4 text-green-600" />,
            label: "Start Meeting",
            onClick: () => startMeeting(record.meeting_id),
          },
          // End Meeting (only for ongoing)
          isOngoing && {
            key: "end",
            icon: <Square className="w-4 h-4 text-orange-600" />,
            label: "End Meeting",
            onClick: () => endMeeting(record.meeting_id),
          },
          // Update Link (not for ended)
          !isEnded && {
            key: "link",
            icon: <Link className="w-4 h-4 text-blue-600" />,
            label: "Update Link",
            onClick: () => openLinkModal(record),
          },
          // Update Notes (always)
          {
            key: "notes",
            icon: <FileText className="w-4 h-4 text-purple-600" />,
            label: "Update Notes",
            onClick: () => openNotesModal(record),
          },
          // Divider
          !isEnded && { type: "divider" },
          // Cancel (not for ended)
          !isEnded && {
            key: "cancel",
            icon: <Trash2 className="w-4 h-4" />,
            label: (
              <Popconfirm
                title="Cancel this meeting?"
                description="This action cannot be undone."
                onConfirm={() => cancelMeeting(record.meeting_id)}
                okText="Yes, Cancel"
                cancelText="No"
                okButtonProps={{ danger: true }}
              >
                <span className="text-red-600">Cancel Meeting</span>
              </Popconfirm>
            ),
            danger: true,
          },
        ].filter(Boolean);

        return (
          <Dropdown
            menu={{ items: menuItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              type="text"
              icon={<MoreVertical className="w-5 h-5" />}
              className="hover:bg-gray-100"
            />
          </Dropdown>
        );
      },
    },
  ];

  useEffect(() => {
    console.log(meetings, "meetings");
  }, [meetings]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Reserved Meetings
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and track all your scheduled appointments
          </p>
        </div>

        {/* Refresh Button */}
        <Button
          icon={<RefreshCw className="w-4 h-4" />}
          onClick={fetchMeetings}
          loading={loading}
          size="large"
        >
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Meetings</p>
              <p className="text-2xl font-bold text-gray-900">
                {meetings.length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-blue-600">
                {meetings.filter((m) => m.status === "pending").length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {meetings.filter((m) => m.status === "ended").length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
              <Video className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={meetings}
        loading={loading}
        searchable={true}
        searchPlaceholder="Search by student name, email, or phone..."
        rowKey="meeting_id"
        pageSize={10}
        emptyText="No reserved meetings found"
        emptyIcon={Calendar}
        rowClassName={(record) => {
          switch (record.status) {
            case "ended":
              return "row-ended";
            case "ongoing":
              return "row-ongoing";
            case "pending":
              return "row-pending";
            default:
              return "";
          }
        }}
      />

      {/* Action Modal */}
      <MeetingActionModal
        open={modalState.open}
        onClose={closeModal}
        type={modalState.type}
        meeting={modalState.meeting}
        onSave={handleModalSave}
        loading={actionLoading}
      />
    </div>
  );
};

export default ReservedMeetings;
