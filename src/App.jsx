import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import arEG from "antd/locale/ar_EG";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import "./styles/index.css";

function App() {
  return (
    <ConfigProvider
      direction="rtl"
      locale={arEG}
      theme={{
        token: {
          colorPrimary: "#023048",
          fontFamily: "Cairo, Tajawal, sans-serif",
          borderRadius: 8,
        },
      }}
    >
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
