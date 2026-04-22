import React, { useState } from "react";
import {
  Card,
  Input,
  Button,
  List,
  Typography,
  Divider,
  Tag,
  Space,
  Upload,
  message,
  Collapse,
} from "antd";
import {
  Send,
  Mail,
  Paperclip,
  Clock,
  User as UserIcon,
  ChevronDown,
  Paperclip as AttachmentIcon,
} from "lucide-react";
import dayjs from "dayjs";
import { usersService } from "../../../../api/services/users.service";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const DirectEmailTab = ({ userId, emails, onRefresh, loading }) => {
  const [subject, setSubject] = useState("");
  const [messageText, setMessageText] = useState("");
  const [fileList, setFileList] = useState([]);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!subject.trim() || !messageText.trim()) {
      message.error("يرجى إدخال الموضوع والرسالة");
      return;
    }

    setSending(true);
    try {
      const formData = new FormData();
      formData.append("subject", subject);
      formData.append("message", messageText);
      fileList.forEach((file) => {
        // Since we return false in beforeUpload, 'file' is the raw File object
        formData.append("attachments", file);
      });

      await usersService.sendDirectEmail(userId, formData);
      message.success("تم إرسال الإيميل بنجاح");
      setSubject("");
      setMessageText("");
      setFileList([]);
      onRefresh();
    } catch (error) {
      message.error("فشل في إرسال الإيميل");
    } finally {
      setSending(false);
    }
  };

  const uploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
    multiple: true,
  };

  return (
    <div className="space-y-6 mt-4 rtl" dir="rtl">
      {/* Send Section */}
      <Card
        title={
          <div className="flex items-center gap-2 text-primary">
            <Send size={18} />
            <span>إرسال إيميل جديد</span>
          </div>
        }
        className="rounded-xl border-blue-50"
      >
        <div className="space-y-4">
          <div>
            <Text strong className="block mb-1 text-xs">موضوع الرسالة</Text>
            <Input
              placeholder="أدخل عنوان الرسالة..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="rounded-lg h-10"
            />
          </div>
          <div>
            <Text strong className="block mb-1 text-xs">نص الرسالة</Text>
            <TextArea
              placeholder="اكتب رسالتك هنا..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              rows={4}
              className="rounded-lg"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Upload {...uploadProps}>
              <Button icon={<AttachmentIcon size={14} className="ml-1" />} className="flex items-center rounded-lg">
                إرفاق ملفات
              </Button>
            </Upload>
            
            <Button
              type="primary"
              icon={<Send size={16} className="ml-2" />}
              loading={sending}
              onClick={handleSend}
              className="bg-primary hover:bg-primary/90 min-w-[120px] rounded-lg h-10 flex items-center"
            >
              إرسال الآن
            </Button>
          </div>
        </div>
      </Card>

      <Divider>سجل المراسلات السابقة</Divider>

      {/* List Section */}
      <List
        loading={loading}
        dataSource={emails}
        locale={{ emptyText: <Empty description="لا توجد مراسلات سابقة" /> }}
        renderItem={(item) => {
          let attachments = [];
          if (Array.isArray(item.attachments)) {
            attachments = item.attachments;
          } else if (typeof item.attachments === "string" && item.attachments.startsWith("[")) {
            try {
              attachments = JSON.parse(item.attachments);
            } catch (e) {
              attachments = [];
            }
          }

          return (
            <Card className="mb-3 rounded-xl hover:shadow-md transition-shadow border-gray-100 p-0 overflow-hidden">
               <Collapse
                ghost
                expandIcon={({ isActive }) => <ChevronDown size={16} className={`transition-transform ${isActive ? 'rotate-180' : ''}`} />}
                expandIconPosition="end"
              >
                <Collapse.Panel
                  header={
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
                          <Mail size={16} />
                        </div>
                        <div>
                          <Text strong className="block text-sm leading-none mb-1">{item.subject}</Text>
                          <Space className="text-[10px] text-gray-400">
                            <span className="flex items-center gap-1"><Clock size={10} /> {dayjs(item.created_at).format('YYYY-MM-DD HH:mm')}</span>
                            <span className="flex items-center gap-1"><UserIcon size={10} /> معرف الأدمن: {item.admin_id}</span>
                          </Space>
                        </div>
                      </div>
                      {attachments.length > 0 && (
                        <Tag color="cyan" className="m-0 text-[10px] rounded-full">
                          {attachments.length} مرفقات
                        </Tag>
                      )}
                    </div>
                  }
                  key="1"
                >
                  <div className="pt-2 px-2">
                    <Paragraph className="text-gray-600 whitespace-pre-wrap text-sm leading-relaxed">
                      {item.message}
                    </Paragraph>
                    
                    {attachments.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-dashed border-gray-100">
                         <Text strong className="block mb-2 text-xs text-gray-400">المرفقات المرسلة:</Text>
                         <div className="flex flex-wrap gap-2">
                            {attachments.map((url, idx) => (
                              <Button
                                key={idx}
                                icon={<AttachmentIcon size={12} />}
                                size="small"
                                className="text-[10px] rounded-md flex items-center gap-1"
                                onClick={() => window.open(url, '_blank')}
                              >
                                {url.split('/').pop()}
                              </Button>
                            ))}
                         </div>
                      </div>
                    )}
                  </div>
                </Collapse.Panel>
              </Collapse>
            </Card>
          );
        }}
      />
    </div>
  );
};

const Empty = ({ description }) => (
  <div className="text-center py-10 opacity-40">
    <Mail size={48} className="mx-auto mb-2" />
    <Paragraph>{description}</Paragraph>
  </div>
);

export default DirectEmailTab;
