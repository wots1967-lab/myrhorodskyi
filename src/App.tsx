import { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";

// Lazy load non-critical route pages
const Courses = lazy(() => import("./pages/Courses"));
const Tests = lazy(() => import("./pages/Tests"));
const BeckAnxietyTest = lazy(() => import("./pages/BeckAnxietyTest"));
const BrovermanTest = lazy(() => import("./pages/BrovermanTest"));
const BeckDepressionTest = lazy(() => import("./pages/BeckDepressionTest"));
const PSS10Test = lazy(() => import("./pages/PSS10Test"));
const DarkTriadTest = lazy(() => import("./pages/DarkTriadTest"));
const TemperamentTest = lazy(() => import("./pages/TemperamentTest"));
const EgoStatesTest = lazy(() => import("./pages/EgoStatesTest"));
const ExpandedEgoStatesTest = lazy(() => import("./pages/ExpandedEgoStatesTest"));
const LoveLanguagesTest = lazy(() => import("./pages/LoveLanguagesTest"));
const YSQTest = lazy(() => import("./pages/YSQTest"));
const IFSScaleTest = lazy(() => import("./pages/IFSScaleTest"));
const IFSSelfTest = lazy(() => import("./pages/IFSSelfTest"));
const Resources = lazy(() => import("./pages/Resources"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse text-muted-foreground">Завантаження...</div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/tests" element={<Tests />} />
            <Route path="/tests/shkala-tryvohy-beka" element={<BeckAnxietyTest />} />
            <Route path="/tests/test-neiromediatoriv-brovermana" element={<BrovermanTest />} />
            <Route path="/tests/shkala-depresii-beka" element={<BeckDepressionTest />} />
            <Route path="/tests/shkala-stresu-pss10" element={<PSS10Test />} />
            <Route path="/tests/temna-triada" element={<DarkTriadTest />} />
            <Route path="/tests/temperament-aizenka" element={<TemperamentTest />} />
            <Route path="/tests/profil-ego-staniv" element={<EgoStatesTest />} />
            <Route path="/tests/5-mov-lyubovi" element={<LoveLanguagesTest />} />
            <Route path="/tests/rozshyrenyi-profil-ego-staniv" element={<ExpandedEgoStatesTest />} />
            <Route path="/tests/opytuvalnyk-rannih-shem-ysq" element={<YSQTest />} />
            <Route path="/tests/diagnostyka-samosti-ifs" element={<IFSSelfTest />} />
            <Route path="/resources" element={<Resources />} />
            {/* Old URL redirects */}
            <Route path="/tests/beck-anxiety" element={<Navigate to="/tests/shkala-tryvohy-beka" replace />} />
            <Route path="/tests/broverman" element={<Navigate to="/tests/test-neiromediatoriv-brovermana" replace />} />
            <Route path="/tests/beck-depression" element={<Navigate to="/tests/shkala-depresii-beka" replace />} />
            <Route path="/tests/pss10" element={<Navigate to="/tests/shkala-stresu-pss10" replace />} />
            <Route path="/tests/dark-triad" element={<Navigate to="/tests/temna-triada" replace />} />
            <Route path="/tests/temperament" element={<Navigate to="/tests/temperament-aizenka" replace />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
