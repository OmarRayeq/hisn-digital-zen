import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Tasbeeh from "./pages/Tasbeeh";
import Saved from "./pages/Saved";
import AdhkarReader from "./pages/AdhkarReader";
import HisnReader from "./pages/HisnReader";
import NotFound from "./pages/NotFound";
import BottomNav from "./components/BottomNav";

const queryClient = new QueryClient();

// Main pages that show the bottom nav
const MAIN_PATHS = ["/", "/tasbeeh", "/saved"];

const AppContent = () => {
  const location = useLocation();
  const showNav = MAIN_PATHS.includes(location.pathname);

  return (
    <div className="fixed inset-0 flex flex-col" style={{ maxWidth: "640px", margin: "0 auto" }}>
      <div className="flex-1 relative overflow-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tasbeeh" element={<Tasbeeh />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/adhkar/:categoryId" element={<AdhkarReader />} />
          <Route path="/hisn/:categoryId" element={<HisnReader />} />
          <Route path="/index" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {showNav && <BottomNav />}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <AppContent />
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
