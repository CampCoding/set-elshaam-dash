import React, { useState } from "react";
import { Modal, Steps, Button, Tag, Space, Divider, Typography } from "antd";
import { DollarSign, Send, CheckCircle, Clock } from "lucide-react";

const { Text } = Typography;

const mockStages = [
  {
    id: 1,
    name: "المرحلة الأولى - تقديم الطلب",
    price: 500,
    status: "paid", // paid, unpaid, pending
  },
  {
    id: 2,
    name: "المرحلة الثانية - قبول الطلب وجاري البحث عن شريك",
    price: 1500,
    status: "unpaid",
  },
  {
    id: 3,
    name: "المرحلة الثالثة - نزول مقابلة بين الطرفين",
    price: 5000,
    status: "pending",
  },
];

const PaymentModal = ({ visible, onCancel, record, onSend }) => {
  const [loadingStageId, setLoadingStageId] = useState(null);

  // Determine active step (e.g. first unpaid or just index 1 for demo)
  const currentStep = 1;

  const handleSend = (stage) => {
    setLoadingStageId(stage.id);
    // Fake delay for UI
    setTimeout(() => {
      setLoadingStageId(null);
      if (onSend) {
        onSend(stage);
      }
    }, 600);
  };

  const getStepStatus = (status, index, current) => {
    if (status === "paid") return "finish";
    if (index === current) return "process";
    return "wait";
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-primary">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <DollarSign className="w-5 h-5" />
          </div>
          <span>المدفوعات والمراحل</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      centered
      className="payment-modal"
    >
      <div className="py-4">
        {record && (
          <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
            <div>
              <Text className="text-gray-500 text-xs">البروفايل الحالى</Text>
              <div className="font-semibold text-gray-800 text-base">
                {record.full_name}
              </div>
            </div>
            <div className="text-left">
              <Text className="text-gray-500 text-xs">المرحلة الحالية</Text>
              <div className="font-semibold text-primary text-base">
                {mockStages[currentStep]?.name}
              </div>
            </div>
          </div>
        )}

        <Steps
          direction="vertical"
          current={currentStep}
          className="px-4"
          items={mockStages.map((stage, index) => {
            const isPaid = stage.status === "paid";
            const isActive = index === currentStep;

            return {
              title: (
                <div className="flex justify-between items-center w-full min-w-[200px]">
                  <span className="font-semibold">{stage.name}</span>
                  <span className="font-bold text-accent px-2">
                    {stage.price} €
                  </span>
                </div>
              ),
              status: getStepStatus(stage.status, index, currentStep),
              description: (
                <div className="mt-2 mb-4 p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <Space>
                      {isPaid ? (
                        <Tag
                          color="success"
                          icon={<CheckCircle className="w-3 h-3 ml-1 inline" />}
                          className="rounded-full px-3 py-1 text-base!"
                        >
                          تم الدفع
                        </Tag>
                      ) : isActive ? (
                        <Tag
                          color="warning"
                          icon={<Clock className="w-3 h-3 ml-1 inline" />}
                          className="rounded-full px-3 py-1 text-base!"
                        >
                          بانتظار الدفع
                        </Tag>
                      ) : (
                        <Tag color="default" className="rounded-full px-3 py-1">
                          غير متاح بعد
                        </Tag>
                      )}
                    </Space>

                    {isActive && (
                      <Button
                        type="primary"
                        onClick={() => handleSend(stage)}
                        loading={loadingStageId === stage.id}
                        icon={<Send className="w-4 h-4 ml-1" />}
                        className="bg-primary hover:bg-primary/90 flex items-center justify-center rounded-lg"
                      >
                        إرسال المطالبة
                      </Button>
                    )}
                  </div>
                </div>
              ),
            };
          })}
        />
      </div>
    </Modal>
  );
};

export default PaymentModal;
