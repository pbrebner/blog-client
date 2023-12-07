import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.jsx";
import "./index.css";

import ErrorPage from "./pages/ErrorPage.jsx";
import Home from "./pages/Home.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Post from "./pages/Post.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <Home />, errorElement: <ErrorPage /> },
            {
                path: "account",
                errorElement: <ErrorPage />,
                children: [
                    { path: "signup", element: <Signup /> },
                    { path: "login", element: <Login /> },
                    { path: ":id", element: <Profile /> },
                ],
            },
            {
                path: "posts/:id",
                element: <Post />,
                errorElement: <ErrorPage />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
