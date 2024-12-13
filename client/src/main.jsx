import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {NextUIProvider} from "@nextui-org/react";
import {Route, BrowserRouter, Routes} from "react-router-dom";
import Container from "./components/Container.jsx";
import CustomNavbar from "./components/CustomNavbar.jsx";
import RecipesPage from "./pages/recipes.jsx";
import HomePage from "./pages/home.jsx";
import AboutPage from "./pages/about.jsx";
import RecipeDetail from "./pages/RecipeDetail.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NextUIProvider>
        <BrowserRouter>
            <main>
              <Container>
                  <CustomNavbar />
                  <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/recipes" element={<RecipesPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/recipe/:id/:name?" element={<RecipeDetail />} />
                  </Routes>
              </Container>
            </main>
        </BrowserRouter>
    </NextUIProvider>
  </StrictMode>
)
