import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Register from "../pages/Register";
import CheckEmail from "../pages/CheckEmail";
import CheckPassword from "../pages/CheckPassword";
import Home from "../pages/Home";
import Message from "../components/Message";
import AuthLayouts from "../layout/AuthLayouts";
import ForgotPassword from "../pages/ForgotPassword";




const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <Home />,
                children: [
                    {
                        path: ":userId",
                        element: <Message />
                    }
                ]
            },
            {
                path: "/register",
                element: <AuthLayouts>
                    <Register />
                </AuthLayouts>
            },
            {
                path: "/email",
                element: <AuthLayouts>
                    <CheckEmail />
                </AuthLayouts>
            },
            {
                path: "/password",
                element: <AuthLayouts>
                    <CheckPassword />
                </AuthLayouts>
            },
            {
                path: "/forgot-password",
                element: <AuthLayouts>
                    <ForgotPassword />
                </AuthLayouts>
            },
        ]
    }

]);

export default router;
