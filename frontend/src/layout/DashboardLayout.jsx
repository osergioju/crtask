import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

export default function DashboardLayout() {
  return (
    <div className="h-screen bg-white text-white w-full flex">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Área direita */}
      <div className="flex-1 flex flex-col">
        
        {/* Header */}
        <Header />

        {/* Conteúdo */}
        <main className="flex-1 w-full px-8 pb-20 pt-10 min-h-screen overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
}