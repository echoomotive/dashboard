import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";
import DashboardLayout from "@/components/DashboardLayout";
import Index from "./pages/Index";
import UploadPage from "./pages/UploadPage";
import LiveAnalysis from "./pages/LiveAnalysis";
import EmotionInsights from "./pages/EmotionInsights";
import SessionHistory from "./pages/SessionHistory";
import Analytics from "./pages/Analytics";
import Infrastructure from "./pages/Infrastructure";
import TeamManagement from "./pages/TeamManagement";
import Reports from "./pages/Reports";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import NotFound from "./pages/NotFound";
import ScrollToTop from "@/components/ScrollToTop";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const queryClient = new QueryClient();

const App = () => (
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />

            {/* Protected Routes Wrapper */}
            <Route
              element={
                <>
                  <SignedIn>
                    <DashboardLayout>
                      <Outlet />
                    </DashboardLayout>
                  </SignedIn>
                  <SignedOut>
                    <Navigate to="/login" replace />
                  </SignedOut>
                </>
              }
            >
              <Route path="/" element={<Index />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/live-analysis" element={<LiveAnalysis />} />
              <Route path="/emotion-insights" element={<EmotionInsights />} />
              <Route path="/session-history" element={<SessionHistory />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/infrastructure" element={<Infrastructure />} />
              <Route path="/team" element={<TeamManagement />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ClerkProvider>
);

export default App;
