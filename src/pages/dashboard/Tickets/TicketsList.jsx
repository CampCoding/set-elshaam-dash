import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Filter, 
  Clock, 
  User, 
  AlertCircle, 
  MessageSquare,
  ArrowRight
} from "lucide-react";
import { ticketsService } from "../../../api/services/tickets.service";
import "./Tickets.css";

const TicketsList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await ticketsService.getTickets();
      setTickets(response.data || []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         ticket.user_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusLabel = (status) => {
    switch(status) {
      case 'open': return 'مفتوحة';
      case 'in_progress': return 'قيد التنفيذ';
      case 'closed': return 'مغلقة';
      default: return status;
    }
  };

  const getPriorityLabel = (priority) => {
    switch(priority) {
      case 'high': return 'عالية';
      case 'medium': return 'متوسطة';
      case 'low': return 'منخفضة';
      default: return priority;
    }
  };

  if (loading) {
    return (
      <div className="tickets-container">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          جاري التحميل...
        </div>
      </div>
    );
  }

  return (
    <div className="tickets-container" dir="rtl">
      <div className="tickets-header">
        <h1>نظام التذاكر والدعم الفني</h1>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        marginBottom: '24px', 
        flexWrap: 'wrap',
        background: 'white',
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <Search style={{ position: 'absolute', right: '12px', top: '10px', color: '#94a3b8' }} size={20} />
          <input 
            type="text" 
            placeholder="البحث في التذاكر..." 
            style={{ 
              width: '100%', 
              padding: '10px 40px 10px 12px', 
              borderRadius: '8px', 
              border: '1px solid #e2e8f0',
              outline: 'none'
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Filter size={20} color="#64748b" />
          <select 
            style={{ 
              padding: '10px', 
              borderRadius: '8px', 
              border: '1px solid #e2e8f0',
              background: 'white',
              outline: 'none'
            }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">كل الحالات</option>
            <option value="open">مفتوحة</option>
            <option value="in_progress">قيد التنفيذ</option>
            <option value="closed">مغلقة</option>
          </select>
        </div>
      </div>

      <div className="tickets-grid">
        {filteredTickets.map((ticket) => (
          <div 
            key={ticket.id} 
            className={`ticket-card priority-${ticket.priority}`}
            onClick={() => navigate(`/tickets/${ticket.id}`)}
          >
            <div className="ticket-card-header">
              <h3 className="ticket-subject">{ticket.subject}</h3>
              <span className={`ticket-status status-${ticket.status}`}>
                {getStatusLabel(ticket.status)}
              </span>
            </div>

            <div className="ticket-info">
              <div className="ticket-info-item">
                <User size={16} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: '600' }}>{ticket.user_name || 'مستخدم'}</span>
                  <span style={{ fontSize: '11px', opacity: 0.7 }}>{ticket.user_email}</span>
                </div>
              </div>
              <div className="ticket-info-item">
                <AlertCircle size={16} />
                <span>أولوية: {getPriorityLabel(ticket.priority)}</span>
              </div>
              <div className="ticket-info-item">
                <Clock size={16} />
                <span>{new Date(ticket.created_at).toLocaleDateString('ar-EG')}</span>
              </div>
            </div>

            <div className="ticket-footer">
              <span>#{ticket.id}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#3b82f6', fontWeight: '600' }}>
                عرض التفاصيل
                <ArrowRight size={14} />
              </div>
            </div>
          </div>
        ))}

        {filteredTickets.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#64748b' }}>
            <MessageSquare size={48} style={{ marginBottom: '16px', opacity: 0.2 }} />
            <p>لا توجد تذاكر تطابق معايير البحث</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsList;
