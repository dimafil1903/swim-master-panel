
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import ProgramList from "./pages/programs/ProgramList";
import ProgramForm from "./pages/programs/ProgramForm";
import LevelList from "./pages/levels/LevelList";
import LevelForm from "./pages/levels/LevelForm";
import LevelMap from "./pages/levels/LevelMap";
import SkillList from "./pages/skills/SkillList";
import SkillForm from "./pages/skills/SkillForm";
import ProgressList from "./pages/progress/ProgressList";
import ProgressForm from "./pages/progress/ProgressForm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/programs" element={<ProgramList />} />
              <Route path="/programs/new" element={<ProgramForm />} />
              <Route path="/programs/edit/:programId" element={<ProgramForm />} />
              <Route path="/levels/:programId" element={<LevelList />} />
              <Route path="/levels/new/:programId" element={<LevelForm />} />
              <Route path="/levels/edit/:levelId" element={<LevelForm />} />
              <Route path="/levels/map/:levelId" element={<LevelMap />} />
              <Route path="/skills/:levelId" element={<SkillList />} />
              <Route path="/skills/new/:levelId" element={<SkillForm />} />
              <Route path="/skills/edit/:skillId" element={<SkillForm />} />
              <Route path="/progress/:skillId" element={<ProgressList />} />
              <Route path="/progress/new/:skillId" element={<ProgressForm />} />
              <Route path="/progress/edit/:progressId" element={<ProgressForm />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
