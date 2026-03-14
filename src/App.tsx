import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import PackagesPage from "./pages/PackagesPage";
import NoticesPage from "./pages/NoticesPage";
import ToolsPage from "./pages/ToolsPage";
import ShopPage from "./pages/ShopPage";
import SocialServicesPage from "./pages/SocialServicesPage";
import AdminPage from "./pages/AdminPage";
import AIToolsPage from "./pages/AIToolsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <DataProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/packages" element={<PackagesPage />} />
                  <Route path="/notices" element={<NoticesPage />} />
                  <Route path="/tools" element={<ToolsPage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/social-services" element={<SocialServicesPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/ai-tools" element={<AIToolsPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
