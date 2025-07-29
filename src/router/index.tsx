import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "../pages/NotFound";
import { routes } from "./routes";

const AppRouter: React.FC = () => (
    <Routes>
        {routes.map(route => (
            <Route key={route.path} path={route.path} element={route.element} />
        ))}
        <Route path="*" element={<NotFound />} />
    </Routes>
) 

export default AppRouter;