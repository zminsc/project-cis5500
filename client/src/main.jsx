import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {NextUIProvider} from "@nextui-org/react";
import {Route, BrowserRouter, Routes, useLocation} from "react-router-dom";
import Container from "./components/Container.jsx";
import CustomNavbar from "./components/CustomNavbar.jsx";
import RecipesPage from "./pages/recipes.jsx";
import HomePage from "./pages/home.jsx";
import AboutPage from "./pages/about.jsx";
import RecipeDetail from "./pages/RecipeDetail.jsx";
import StatsPage from './pages/stats.jsx';

function AppContent() {
    const location = useLocation();

    return (
        <main>
            <Container>
                <CustomNavbar />
            </Container>
            <Container fullWidth={location.pathname === '/recipes'}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/recipes" element={<RecipesPage />} />
                    <Route path="/stats" element={<StatsPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/recipe/:name" element={<RecipeDetail />} />
                </Routes>
            </Container>
        </main>
    );
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <NextUIProvider>
            <BrowserRouter>
                <AppContent />
            </BrowserRouter>
        </NextUIProvider>
    </StrictMode>
)
