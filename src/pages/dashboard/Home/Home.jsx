// src/pages/dashboard/Home/Home.jsx
import {
  Users,
  CreditCard,
  ArrowRight,
  Heart,
  Clock,
  ShieldCheck,
  UserPlus,
  Euro,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  Row,
  Col,
  Progress,
  List,
  Avatar,
  Tag,
  Button,
  Empty,
  Badge,
} from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { statsService } from "../../../api/services/stats.service";

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await statsService.getStats();
      setDashboardData(response.data);
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = dashboardData;

  // ==================== Stats Cards ====================
  const statsCards = [
    {
      label: "إجمالي المشتركين",
      value: stats?.total_users || 0,
      icon: <Users className="w-8 h-8 text-blue-500" />,
      bg: "bg-blue-50",
    },
    {
      label: "إجمالي الطلبات",
      value: stats?.total_orders || 0,
      icon: <CreditCard className="w-8 h-8 text-purple-500" />,
      bg: "bg-purple-50",
    },
    {
      label: "إجمالي الأرباح",
      value: `${stats?.total_earnings || 0} €`,
      icon: <Euro className="w-8 h-8 text-green-500" />,
      bg: "bg-green-50",
      isText: true,
    },
    {
      label: "طلبات ناجحة",
      value:
        stats?.status_breakdown?.find((s) => s.status === "SUCCESS")?.count ||
        0,
      icon: <ShieldCheck className="w-8 h-8 text-orange-500" />,
      bg: "bg-orange-50",
    },
  ];

  // ==================== Payment Status Config ====================
  const getPaymentStatusTag = (status) => {
    switch (status?.toUpperCase()) {
      case "SUCCESS":
        return (
          <Tag color="success" className="rounded-full">
            تم الدفع
          </Tag>
        );
      case "PENDING":
        return (
          <Tag color="warning" className="rounded-full">
            قيد الانتظار
          </Tag>
        );
      default:
        return (
          <Tag color="default" className="rounded-full">
            {status}
          </Tag>
        );
    }
  };

  return (
    <div className="space-y-8 p-1">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            لوحة الإحصائيات العامة
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            مرحباً بك مجدداً، إليك ملخص نشاط منصة "ست الشام" اليوم
          </p>
        </div>
        {/* <Button
          type="primary"
          size="large"
          icon={<UserPlus className="w-5 h-5" />}
          className="bg-primary hover:scale-105 transition-transform flex items-center gap-2 h-12 px-6 rounded-xl"
          onClick={() => navigate("/users")}
        >
          إضافة مستخدم جديد
        </Button> */}
      </div>

      {/* Stats Cards */}
      <Row gutter={[24, 24]}>
        {statsCards.map((item, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="rounded-3xl border-none shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 font-medium mb-1">{item.label}</p>
                  <h3 className="text-3xl font-bold text-gray-800 tracking-tighter">
                    {item.isText
                      ? item.value
                      : Number(item.value).toLocaleString()}
                  </h3>
                </div>
                <div
                  className={`${item.bg} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300`}
                >
                  {item.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]}>
        {/* Recent Users */}
        <Col xs={24} lg={14}>
          <Card
            title={
              <div className="flex items-center justify-between py-2">
                <span className="text-xl font-bold flex items-center gap-2">
                  <UserPlus className="w-6 h-6 text-primary" />
                  أحدث المشتركين الجدد
                </span>
                <Button
                  type="link"
                  onClick={() => navigate("/users")}
                  className="text-primary font-bold text-base"
                >
                  عرض الكل <ArrowRight className="w-4 h-4 inline mr-1" />
                </Button>
              </div>
            }
            className="rounded-3xl border-none shadow-sm h-full"
            loading={loading}
          >
            <List
              itemLayout="horizontal"
              dataSource={stats?.recent_users || []}
              renderItem={(user) => (
                <List.Item
                  className="px-4 py-3 hover:bg-gray-50 transition-colors rounded-2xl cursor-pointer border-none"
                  onClick={() => navigate(`/users/${user.id}`)}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        size={48}
                        className="bg-primary/10 text-primary border-2 border-white shadow-sm font-bold"
                      >
                        {user.full_name?.[0] || "?"}
                      </Avatar>
                    }
                    title={
                      <span className="font-bold text-gray-800">
                        {user.full_name}
                      </span>
                    }
                    description={
                      <div className="flex items-center gap-3 text-gray-500 text-xs">
                        <span>{user.email}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {dayjs(user.created_at).format("YYYY-MM-DD")}
                        </span>
                      </div>
                    }
                  />
                  <Button
                    icon={<ArrowRight className="w-4 h-4 text-gray-400" />}
                    type="text"
                  />
                </List.Item>
              )}
              locale={{
                emptyText: <Empty description="لا يوجد مستخدمين حالياً" />,
              }}
            />
          </Card>
        </Col>

        {/* Right Column */}
        <Col xs={24} lg={10}>
          <div className="flex flex-col gap-6 h-full">
            {/* Status Breakdown */}
            <Card
              title={<span className="text-xl font-bold">حالة الطلبات</span>}
              className="rounded-3xl border-none shadow-sm"
              loading={loading}
            >
              <div className="space-y-4 py-2">
                {stats?.status_breakdown?.map((item) => {
                  const total = stats?.total_orders || 1;
                  const percent = Math.round((item.count / total) * 100);
                  const isSuccess = item.status === "SUCCESS";

                  return (
                    <div key={item.status}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="flex items-center gap-2 font-bold text-gray-700 text-sm">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              isSuccess ? "bg-green-500" : "bg-orange-400"
                            }`}
                          />
                          {isSuccess ? "مدفوع" : "قيد الانتظار"}
                        </span>
                        <span className="font-bold text-sm">
                          {item.count} ({percent}%)
                        </span>
                      </div>
                      <Progress
                        percent={percent}
                        strokeColor={isSuccess ? "#22c55e" : "#f97316"}
                        showInfo={false}
                        strokeWidth={10}
                        className="mb-0"
                      />
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Recent Orders */}
            <Card
              title={
                <span className="text-xl font-bold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  آخر الطلبات
                </span>
              }
              className="rounded-3xl border-none shadow-sm flex-1"
              loading={loading}
            >
              <div className="flex flex-col gap-3">
                {stats?.recent_orders?.slice(0, 4).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 text-sm truncate">
                        {order.user_name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5 truncate">
                        {order.title}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {dayjs(order.date).format("YYYY-MM-DD")}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0 mr-2">
                      <span className="font-bold text-primary text-sm">
                        {order.price} €
                      </span>
                      {getPaymentStatusTag(order.status)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
