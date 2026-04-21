import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Send, 
  Paperclip, 
  X, 
  User, 
  Shield,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { ticketsService } from "../../../api/services/tickets.service";
import "./Tickets.css";

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchTicketDetails();
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const response = await ticketsService.getTicketDetails(id);
      setTicket(response.data.ticket);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error("Error fetching ticket details:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() && selectedFiles.length === 0) return;

    try {
      setSending(true);
      const formData = new FormData();
      formData.append("message", replyMessage);
      selectedFiles.forEach(file => {
        formData.append("attachments", file);
      });

      await ticketsService.replyTicket(id, formData);
      setReplyMessage("");
      setSelectedFiles([]);
      fetchTicketDetails(); // Refresh to show new message
    } catch (error) {
      console.error("Error sending reply:", error);
    } finally {
      setSending(false);
    }
  };

  const handleCloseTicket = async () => {
    if (window.confirm("هل أنت متأكد من إغلاق هذه التذكرة؟")) {
      try {
        await ticketsService.closeTicket(id);
        fetchTicketDetails();
      } catch (error) {
        console.error("Error closing ticket:", error);
      }
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

  if (!ticket) return <div>التذكرة غير موجودة</div>;

  return (
    <div className="ticket-details-container" dir="rtl">
      <div className="ticket-chat-section">
        <div className="chat-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => navigate('/tickets')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px' }}>{ticket.subject}</h2>
              <span style={{ fontSize: '12px', color: '#64748b' }}># {ticket.id}</span>
            </div>
          </div>
          
          <div className={`ticket-status status-${ticket.status}`}>
            {ticket.status === 'open' ? 'مفتوحة' : ticket.status === 'in_progress' ? 'قيد التنفيذ' : 'مغلقة'}
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`message-bubble ${msg.sender_type === 'admin' ? 'message-admin' : 'message-user'}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '12px', fontWeight: '600' }}>
                {msg.sender_type === 'admin' ? <Shield size={14} /> : <User size={14} />}
                <span>{msg.sender_type === 'admin' ? 'الإدارة' : ticket.user_name}</span>
              </div>
              
              <div>{msg.message}</div>

              {msg.attachments && msg.attachments.length > 0 && (
                <div className="message-attachments">
                  {msg.attachments.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                      <img src={url} alt="attachment" className="attachment-preview" />
                    </a>
                  ))}
                </div>
              )}

              <span className="message-time">
                {new Date(msg.created_at).toLocaleString('ar-EG', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {ticket.status !== 'closed' && (
          <div className="chat-input-section">
            <form className="reply-form" onSubmit={handleReply}>
              <textarea 
                className="reply-textarea"
                placeholder="اكتب ردك هنا..."
                rows="3"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
              />
              
              {selectedFiles.length > 0 && (
                <div className="selected-files">
                  {selectedFiles.map((file, i) => (
                    <div key={i} className="file-tag">
                      {file.name}
                      <X size={14} className="remove-file" onClick={() => removeFile(i)} />
                    </div>
                  ))}
                </div>
              )}

              <div className="reply-actions">
                <div 
                  className="attachment-button"
                  onClick={() => fileInputRef.current.click()}
                >
                  <Paperclip size={18} />
                  <span>إرفاق ملفات</span>
                  <input 
                    type="file" 
                    multiple 
                    hidden 
                    ref={fileInputRef} 
                    onChange={handleFileChange}
                    accept="image/*,.pdf,.doc,.docx"
                  />
                </div>

                <button 
                  type="submit" 
                  className="send-button"
                  disabled={sending || (!replyMessage.trim() && selectedFiles.length === 0)}
                >
                  {sending ? 'جاري الإرسال...' : 'إرسال الرد'}
                  {!sending && <Send size={18} style={{ marginRight: '8px', transform: 'rotate(180deg)' }} />}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <div className="ticket-sidebar">
        <div className="sidebar-card">
          <h3>معلومات التذكرة</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
              <User size={18} color="#64748b" />
              <div>
                <div style={{ color: '#94a3b8', fontSize: '11px' }}>المستخدم</div>
                <div style={{ fontWeight: '600' }}>{ticket.user_name}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>{ticket.user_email}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
              <Clock size={18} color="#64748b" />
              <div>
                <div style={{ color: '#94a3b8', fontSize: '11px' }}>تم الإنشاء في</div>
                <div style={{ fontWeight: '600' }}>{new Date(ticket.created_at).toLocaleString('ar-EG')}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
              <AlertCircle size={18} color="#64748b" />
              <div>
                <div style={{ color: '#94a3b8', fontSize: '11px' }}>الأولوية</div>
                <div style={{ 
                  fontWeight: '700', 
                  color: ticket.priority === 'high' ? '#ef4444' : ticket.priority === 'medium' ? '#f59e0b' : '#10b981'
                }}>
                  {ticket.priority === 'high' ? 'عالية' : ticket.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar-card">
          <h3>الإجراءات</h3>
          <div className="status-buttons">
            <button 
              className={`status-btn ${ticket.status === 'open' ? 'active-open' : ''}`}
              onClick={() => ticketsService.replyTicket(id, { status: 'open' }).then(fetchTicketDetails)}
            >
              فتح التذكرة
            </button>
            <button 
              className={`status-btn ${ticket.status === 'in_progress' ? 'active-in_progress' : ''}`}
              onClick={() => ticketsService.replyTicket(id, { status: 'in_progress' }).then(fetchTicketDetails)}
            >
              قيد التنفيذ
            </button>
            <button 
              className="status-btn active-closed"
              onClick={handleCloseTicket}
              disabled={ticket.status === 'closed'}
            >
              {ticket.status === 'closed' ? 'مغلقة' : 'إغلاق التذكرة'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
