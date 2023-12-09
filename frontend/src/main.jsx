import ReactDOM from "react-dom/client";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { CouponContextProvider } from "./context/CouponContext.jsx";

import { AuthContextProvider } from "./context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <AuthContextProvider>
        <CouponContextProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<App />} />
                </Routes>
            </Router>
        </CouponContextProvider>
    </AuthContextProvider>
);
