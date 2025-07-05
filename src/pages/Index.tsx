import { useState } from "react";
import { Layout } from "@/components/Layout";
import { MemberDashboard } from "@/components/MemberDashboard";
import { AdminPanel } from "@/components/AdminPanel";

const Index = () => {
  const [currentView, setCurrentView] = useState<"member" | "admin">("member");

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {currentView === "member" ? <MemberDashboard /> : <AdminPanel />}
    </Layout>
  );
};

export default Index;
