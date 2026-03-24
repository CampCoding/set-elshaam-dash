// src/pages/doctor/ReservedMeetings/components/MeetingActionModal.jsx
import { useState, useEffect } from "react";
import { Modal, Input, Button } from "antd";
import { Link, FileText, X } from "lucide-react";

const { TextArea } = Input;

const MeetingActionModal = ({
  open,
  onClose,
  type, // 'link' | 'notes'
  meeting,
  onSave,
  loading,
}) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (open && meeting) {
      setValue(
        type === "link"
          ? meeting.meeting_url || ""
          : meeting.student_notes || ""
      );
    }
  }, [open, meeting, type]);

  const handleSave = () => {
    onSave(value);
  };

  const isLink = type === "link";

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={500}
      closeIcon={<X className="w-5 h-5" />}
      title={
        <div className="flex items-center gap-2">
          {isLink ? (
            <Link className="w-5 h-5 text-primary" />
          ) : (
            <FileText className="w-5 h-5 text-primary" />
          )}
          <span>{isLink ? "Update Meeting Link" : "Update Notes"}</span>
        </div>
      }
    >
      <div className="py-4">
        {/* Student Info */}
        {meeting && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Student:{" "}
              <span className="font-medium text-gray-900">
                {meeting.student_name}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Date:{" "}
              <span className="font-medium text-gray-900">
                {meeting.slot_date}
              </span>{" "}
              at{" "}
              <span className="font-medium text-gray-900">
                {meeting.start_time?.slice(0, 5)}
              </span>
            </p>
          </div>
        )}

        {/* Input Field */}
        {isLink ? (
          <Input
            placeholder="Enter meeting URL (e.g., https://meet.google.com/xxx)"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            prefix={<Link className="w-4 h-4 text-gray-400" />}
            size="large"
          />
        ) : (
          <TextArea
            placeholder="Enter notes about this meeting..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={4}
            maxLength={500}
            showCount
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button onClick={onClose} size="large">
          Cancel
        </Button>
        <Button
          type="primary"
          onClick={handleSave}
          loading={loading}
          size="large"
        >
          Save Changes
        </Button>
      </div>
    </Modal>
  );
};

export default MeetingActionModal;
