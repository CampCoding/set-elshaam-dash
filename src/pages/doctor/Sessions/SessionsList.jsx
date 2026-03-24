// src/pages/doctor/Sessions/SessionsList.jsx
import { useState, useMemo } from "react";
import { Input, Pagination, Empty, Spin } from "antd";
import { Search, Plus, BookOpen, RefreshCw } from "lucide-react";
import useSessionsData from "./useSessionsData";
import SessionCard from "./components/SessionCard";
import SessionModal from "./components/SessionModal";

const ITEMS_PER_PAGE = 6;

const SessionsList = () => {
  const {
    sessions,
    loading,
    actionLoading,
    fetchSessions,
    createSession,
    updateSession,
    deleteSession,
  } = useSessionsData();

  // State
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalState, setModalState] = useState({
    open: false,
    session: null,
  });

  // ============ Filtered Sessions ============
  const filteredSessions = useMemo(() => {
    if (!searchText.trim()) return sessions;

    const search = searchText.toLowerCase();
    return sessions.filter(
      (session) =>
        session.title?.toLowerCase().includes(search) ||
        session.topic?.toLowerCase().includes(search) ||
        session.address?.toLowerCase().includes(search)
    );
  }, [sessions, searchText]);

  // ============ Paginated Sessions ============
  const paginatedSessions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSessions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredSessions, currentPage]);

  // ============ Handlers ============
  const openCreateModal = () => {
    setModalState({ open: true, session: null });
  };

  const openEditModal = (session) => {
    setModalState({ open: true, session });
  };

  const closeModal = () => {
    setModalState({ open: false, session: null });
  };

  const handleSave = async (sessionData, sessionId) => {
    if (sessionId) {
      return await updateSession(sessionId, sessionData);
    } else {
      return await createSession(sessionData);
    }
  };

  const handleDelete = async (sessionId) => {
    await deleteSession(sessionId);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset to page 1 when search changes
  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sessions</h1>
          <p className="text-gray-500 mt-1">
            Create and manage your group sessions
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          <button
            onClick={fetchSessions}
            disabled={loading}
            className="p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-5 h-5 text-gray-600 ${loading ? "animate-spin" : ""}`}
            />
          </button>

          {/* Create Button */}
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Create Session</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Total Sessions</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {sessions.length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {sessions.filter((s) => s.status === "active").length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">This Week</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {
              sessions.filter((s) => {
                const sessionDate = new Date(s.session_date);
                const today = new Date();
                const weekFromNow = new Date(
                  today.getTime() + 7 * 24 * 60 * 60 * 1000
                );
                return sessionDate >= today && sessionDate <= weekFromNow;
              }).length
            }
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Total Capacity</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            {sessions.reduce((sum, s) => sum + (s.student_limit || 0), 0)}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <Input
          placeholder="Search sessions by title, topic, or location..."
          value={searchText}
          onChange={handleSearch}
          prefix={<Search className="w-5 h-5 text-gray-400" />}
          allowClear
          size="large"
        />
      </div>

      {/* Sessions Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spin size="large" />
        </div>
      ) : paginatedSessions.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Pagination */}
          {filteredSessions.length > ITEMS_PER_PAGE && (
            <div className="flex justify-center pt-4">
              <Pagination
                current={currentPage}
                total={filteredSessions.length}
                pageSize={ITEMS_PER_PAGE}
                onChange={handlePageChange}
                showSizeChanger={false}
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} sessions`
                }
              />
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="text-center py-8">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 text-lg">
                  {searchText ? "No sessions found" : "No sessions yet"}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {searchText
                    ? "Try adjusting your search"
                    : "Create your first session to get started"}
                </p>
                {!searchText && (
                  <button
                    onClick={openCreateModal}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Create Session
                  </button>
                )}
              </div>
            }
          />
        </div>
      )}

      {/* Session Modal */}
      <SessionModal
        open={modalState.open}
        onClose={closeModal}
        onSave={handleSave}
        session={modalState.session}
        loading={actionLoading}
      />
    </div>
  );
};

export default SessionsList;
