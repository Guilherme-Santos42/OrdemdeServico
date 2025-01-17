import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBars,
  FaFolderOpen,
  FaEye,
  FaPlus,
  FaCalendarAlt,
  FaAddressBook,
} from "react-icons/fa";
import { IoCreate } from "react-icons/io5";
import CadastrarServicos from "./CadastrarServicos";
import CadastrarCliente from "./CadastrarCliente";
import CadastrarOS from "./CadastrarOS";
import VisualizarOS from "./VisualizarOS";
import Calendario from "./Calendario";
import CriarUsuario from "./CriarUsuario"; 


function Dashboard() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [activePage, setActivePage] = useState("home");
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (!role) {
      navigate("/login");
    } else {
      setUserRole(role);
    }
  }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarExpanded((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const MenuItem = ({ page, icon, label, allowedRoles }) => {
    if (!allowedRoles.includes(userRole)) return null; // Ocultar itens do menu sem permissão

    return (
      <li
        onClick={() => setActivePage(page)}
        className={activePage === page ? "active" : ""}
        aria-label={`Ir para ${label}`}
      >
        {icon}
        {isSidebarExpanded && <span>{label}</span>}
      </li>
    );
  };

  const renderContent = () => {
    switch (activePage) {
      case "cadastrar-servicos":
        return <CadastrarServicos />;
      case "visualizar-os":
        return <VisualizarOS />;
      case "cadastrar-cliente":
        return <CadastrarCliente />;
      case "cadastrar-os":
        return <CadastrarOS />;
      case "calendario":
        return <Calendario />;
      case "criar-user":
        return <CriarUsuario />;
      default:
        return (
          <div>
            <h1>Bem-vindo ao Dashboard</h1>
            <p>Selecione uma opção no menu para continuar.</p>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo">
          <img src="/novo.png" alt="Logo" className="logo-img" />
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Sair
        </button>
      </header>

      <aside className={`sidebar ${isSidebarExpanded ? "expanded" : "collapsed"}`}>
        <div className="sidebar-header">
          <button className="toggle-button" onClick={toggleSidebar}>
            <FaBars />
          </button>
          {isSidebarExpanded && <h2>Menu</h2>}
        </div>
        <ul>
          <MenuItem
            page="cadastrar-os"
            icon={<FaFolderOpen className="menu-icon" />}
            label=" Cadastrar OS"
            allowedRoles={["admin"]}
          />
          <MenuItem
            page="cadastrar-servicos"
            icon={<FaPlus className="menu-icon" />}
            label=" Cadastrar Serviços"
            allowedRoles={["admin"]}
          />
          <MenuItem
            page="cadastrar-cliente"
            icon={<FaAddressBook className="menu-icon" />}
            label=" Clientes"
            allowedRoles={["admin"]}
          />
          <MenuItem
            page="visualizar-os"
            icon={<FaEye className="menu-icon" />}
            label=" Visualizar OS"
            allowedRoles={["admin", "visualizar_os"]}
          />
          <MenuItem
            page="calendario"
            icon={<FaCalendarAlt className="menu-icon" />}
            label=" Calendário"
            allowedRoles={["admin"]}
          />
          <MenuItem
            page="criar-user"
            icon={<IoCreate className="menu-icon" />}
            label=" Criar Usuário"
            allowedRoles={["admin"]}
          />
        </ul>
      </aside>

      <main className="main-content">{renderContent()}</main>
    </div>
  );
}

export default Dashboard;
