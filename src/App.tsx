import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AccountCreation from "./pages/AccountCreation";
import Onboarding from "./pages/Onboarding";
import Swipe from "./pages/Swipe";
import Shortlist from "./pages/Shortlist";
import GrantDetail from "./pages/GrantDetail";
import Apply from "./pages/Apply";
import Submitted from "./pages/Submitted";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/account-creation" element={<AccountCreation />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/swipe" element={<Swipe />} />
          <Route path="/shortlist" element={<Shortlist />} />
          <Route path="/grant/:id" element={<GrantDetail />} />
          <Route path="/apply/:id" element={<Apply />} />
          <Route path="/submitted/:id" element={<Submitted />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
