import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";

import DashboardHome from "../Pages/DashboardHome";
import SLA from "../Pages/SLA";
import Volume from "../Pages/Volume";
import Retrabalho from "../Pages/Retrabalho";
import Clientes from "../Pages/Clientes";
import Colaboradores from "../Pages/Colaboradores";

// DETALHES
import PessoaDetalhe from "../Pages/PessoaDetalhe";
import ClienteDetalhe from "../Pages/ClienteDetalhe"

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/sla" element={<SLA />} />
          <Route path="/colaboradores" element={<Colaboradores />} />
          <Route path="/volume" element={<Volume />} />
          <Route path="/retrabalho" element={<Retrabalho />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/pessoa/:ownerId" element={<PessoaDetalhe />} />
          <Route path="/cliente/:clientId" element={<ClienteDetalhe />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}