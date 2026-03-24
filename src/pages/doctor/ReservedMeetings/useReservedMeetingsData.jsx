// src/pages/doctor/ReservedMeetings/useReservedMeetingsData.jsx
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import { MEETINGS_ENDPOINTS } from "../../../api/endpoints";
import { message } from "antd";

const useReservedMeetingsData = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // ============ Fetch Meetings ============
  const fetchMeetings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(MEETINGS_ENDPOINTS.LIST);

      if (response.data.status === "success") {
        const transformedData = response.data.data.map((meeting) => ({
          key: meeting.meeting_id,
          meeting_id: meeting.meeting_id,
          student_id: meeting.student_id,
          meeting_url: meeting.meeting_url,
          is_started: meeting.is_started,
          is_ended: meeting.is_ended,
          student_notes: meeting.sudent_notes,
          slot_date: meeting.slot_date,
          start_time: meeting.start_time,
          end_time: meeting.end_time,
          student_name: meeting.student_data?.student_name,
          student_email: meeting.student_data?.student_email,
          student_phone: meeting.student_data?.phone,
          student_nickname: meeting.student_data?.student_nickname,
          student_avatar: meeting.student_data?.student_avater_url,
          status: meeting.is_ended
            ? "ended"
            : meeting.is_started
              ? "ongoing"
              : "pending",
        }));

        setMeetings(transformedData);
      }
    } catch (error) {
      console.error("Error fetching meetings:", error);
      toast.error("Failed to load meetings");
    } finally {
      setLoading(false);
    }
  }, []);

  // ============ Perform Action ============
  const performAction = async (meeting_id, action, extraData = {}) => {
    setActionLoading(true);
    try {
      const response = await api.patch(MEETINGS_ENDPOINTS.ACTION, {
        meeting_id,
        action,
        ...extraData,
      });

      if (response.data.status === "success") {
        console.log(response, "cursor-help");
        setMeetings((prev) =>
          prev.map((meeting) => {
            if (meeting.meeting_id !== meeting_id) return meeting;

            switch (action) {
              case "start":
                return { ...meeting, is_started: 1, status: "ongoing" };
              case "end":
                return { ...meeting, is_ended: 1, status: "ended" };
              case "update_link":
                return { ...meeting, meeting_url: extraData.meeting_url };
              case "update_notes":
                return { ...meeting, student_notes: extraData.notes };
              default:
                return meeting;
            }
          })
        );

        const actionMessages = {
          start: "Meeting started successfully",
          end: "Meeting ended successfully",
          update_link: "Meeting link updated",
          update_notes: "Notes updated successfully",
        };
        message.success(response?.data?.message);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error performing action:", error);
      toast.error("Failed to perform action");
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // ============ Cancel Meeting ============
  const cancelMeeting = async (meeting_id) => {
    setActionLoading(true);
    try {
      const response = await api.delete(MEETINGS_ENDPOINTS.CANCEL, {
        data: { meeting_id },
      });

      if (response.data.status === "success") {
        setMeetings((prev) =>
          prev.filter((meeting) => meeting.meeting_id !== meeting_id)
        );
        toast.success("Meeting cancelled successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error cancelling meeting:", error);
      toast.error("Failed to cancel meeting");
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // ============ Shorthand Actions ============
  const startMeeting = (meeting_id) => performAction(meeting_id, "start");
  const endMeeting = (meeting_id) => performAction(meeting_id, "end");
  const updateMeetingLink = (meeting_id, meeting_url) =>
    performAction(meeting_id, "update_link", { meeting_url });
  const updateMeetingNotes = (meeting_id, notes) =>
    performAction(meeting_id, "update_notes", { notes });

  // ============ Initial Fetch ============
  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  return {
    meetings,
    loading,
    actionLoading,
    fetchMeetings,
    startMeeting,
    endMeeting,
    updateMeetingLink,
    updateMeetingNotes,
    cancelMeeting,
  };
};

export default useReservedMeetingsData;
