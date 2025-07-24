import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Chat from "../pages/Chat";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";

const AppRouter: React.FC = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    </BrowserRouter>
) 

export default AppRouter;