import ReactDOM from "react-dom/client";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { CouponContextProvider } from "./context/CouponContext.jsx";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import CompanyLogin from "./pages/CompanyLogin.jsx";
import CompanyDashboard from "./pages/CompanyDashboard.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import Generate from "./pages/Generate.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <AuthContextProvider>
        <CouponContextProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/companyLogin" element={<CompanyLogin />} />
                    <Route path="/company" element={<CompanyDashboard />} />
                    <Route path="/dashboard" element={<UserDashboard/>} />
                    <Route path="/generate" element={<Generate />} />
                </Routes>
            </Router>
        </CouponContextProvider>
    </AuthContextProvider>
);
