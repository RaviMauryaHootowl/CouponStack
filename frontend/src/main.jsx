import ReactDOM from "react-dom/client";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import Generate from "./pages/Generate.jsx";
import { CouponContextProvider } from "./context/CouponContext.jsx";

import CompanyLogin from "./pages/CompanyLogin.jsx";
import CompanyDashboard from "./pages/CompanyDashboard.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { init } from "@airstack/airstack-react";

init("1f658796ad3724726bc36250b6dd8daf5");

ReactDOM.createRoot(document.getElementById("root")).render(
    <AuthContextProvider>
        <CouponContextProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/generate" element={<Generate />} />
                    <Route path="/companyLogin" element={<CompanyLogin />} />
                    <Route path="/company" element={<CompanyDashboard />} />
                    <Route path="/dashboard" element={<UserDashboard/>} />
                    
                </Routes>
            </Router>
        </CouponContextProvider>
        </AuthContextProvider>
);
