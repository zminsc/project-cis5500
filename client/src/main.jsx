import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {NextUIProvider} from "@nextui-org/react";
import {Route, BrowserRouter, Routes} from "react-router-dom";
import Container from "./components/Container.jsx";
import CustomNavbar from "./components/CustomNavbar.jsx";
import RecipesPage from "./pages/recipes.jsx";
import HomePage from "./pages/home.jsx";
import CommunityPage from "./pages/community.jsx";
import AboutPage from "./pages/about.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NextUIProvider>
        <BrowserRouter>
            <Container>
                <CustomNavbar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/recipes" element={<RecipesPage />} />
                    <Route path="/community" element={<CommunityPage />} />
                    <Route path="/about" element={<AboutPage />} />
                </Routes>
            </Container>
        </BrowserRouter>
    </NextUIProvider>
  </StrictMode>
)
