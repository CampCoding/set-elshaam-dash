// src/pages/doctor/Sessions/useSessionsData.jsx
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import { SESSIONS_ENDPOINTS } from "../../../api/endpoints";
import { message } from "antd";

const useSessionsData = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // ============ Fetch Sessions ============
  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(SESSIONS_ENDPOINTS.LIST);

      if (response.data.status === "success") {
        setSessions(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
      message.error("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  }, []);

  // ============ Create Session ============
  const createSession = async (sessionData) => {
    setActionLoading(true);
    try {
      const response = await api.post(SESSIONS_ENDPOINTS.CREATE, sessionData);

      if (response.data.status === "success") {
        message.success("Session created successfully");
        await fetchSessions(); // Refresh list
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error creating session:", error);
      message.error(
        error.response?.data?.message || "Failed to create session"
      );
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // ============ Update Session ============
  const updateSession = async (session_id, sessionData) => {
    setActionLoading(true);
    try {
      const response = await api.patch(SESSIONS_ENDPOINTS.UPDATE, {
        session_id,
        ...sessionData,
      });

      if (response.data.status === "success") {
        // Update local state
        setSessions((prev) =>
          prev.map((session) =>
            session.id === session_id ? { ...session, ...sessionData } : session
          )
        );
        message.success("Session updated successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating session:", error);
      message.error(
        error.response?.data?.message || "Failed to update session"
      );
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // ============ Delete Session ============
  const deleteSession = async (session_id) => {
    setActionLoading(true);
    try {
      const response = await api.delete(`${SESSIONS_ENDPOINTS.DELETE}`, {
        data: { session_id: session_id },
      });

      if (response.data.status === "success") {
        setSessions((prev) =>
          prev.filter((session) => session.id !== session_id)
        );
        message.success("Session deleted successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting session:", error);
      message.error(
        error.response?.data?.message || "Failed to delete session"
      );
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // ============ Initial Fetch ============
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessions,
    loading,
    actionLoading,
    fetchSessions,
    createSession,
    updateSession,
    deleteSession,
  };
};

export default useSessionsData;
