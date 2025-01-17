import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaEdit } from "react-icons/fa";

function VisualizarOS() {
  const [osList, setOsList] = useState([]);
  const [filters, setFilters] = useState({
    cliente: "",
    equipamento: "",
    problema: "",
    status: "",
    dataInicio: "",
    dataFim: "",
  });

  const [editingOS, setEditingOS] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Função para buscar as ordens de serviço
  const fetchOS = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      console.log("Query Params:", query); // Depuração para ver a query gerada
      const response = await axios.get(`http://localhost:5000/api/os?${query}`);
      setOsList(response.data);
    } catch (error) {
      console.error("Erro ao buscar OS:", error);
    }
  };

  useEffect(() => {
    fetchOS();
  }, [filters]); // Atualiza quando algum filtro for alterado

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/os/${id}`);
      setOsList(osList.filter((os) => os._id !== id));
    } catch (error) {
      console.error("Erro ao deletar OS:", error);
    }
  };

  const openEditModal = (os) => {
    setEditingOS({ ...os });
    setShowModal(true);
  };

  const closeEditModal = () => {
    setEditingOS(null);
    setShowModal(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingOS((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    console.log("Dados sendo salvos:", editingOS);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/os/${editingOS._id}`,
        {
          cliente: editingOS.cliente,
          servicos: editingOS.servicos,
          equipamento: editingOS.equipamento,
          problema: editingOS.problema,
          detalhes: editingOS.detalhes,
          marca: editingOS.marca,
          bairro: editingOS.bairro,
          rua: editingOS.rua,
          colaborador: editingOS.colaborador,
          status: editingOS.status,
        } 
      );
      const updatedOS = response.data;
      setOsList((prevList) =>
        prevList.map((os) => (os._id === updatedOS._id ? updatedOS : os))
      );
      closeEditModal();
    } catch (error) {
      console.error("Erro ao salvar OS:", error);
    }
  };

  return (
    <div className="visualizar-os">
      <h1 className="os-title">Visualizar Ordens de Serviço</h1>
      
      <div className="filters-container">
        <div className="filter-group">
        
          <label htmlFor="cliente">Cliente:</label>
          <input
            type="text"
            id="cliente"
            name="cliente"
            value={filters.cliente}
            onChange={handleChange}
            placeholder="Digite o nome do cliente"
            className="filter-input"
          />
          <br></br>
          
        
  <label htmlFor="status">Status:</label>
  <select
    id="status"
    name="status"
    value={filters.status}
    onChange={handleChange}
    className="filter-input"
  >
    <option value="">Selecione um status</option>
    <option value="Agendado">Agendado</option>
    <option value="Em pausa">Em pausa</option>
    <option value="Cancelado">Cancelado</option>
    <option value="Concluído">Concluído</option>
  </select>
</div>


        
       
        <div className="filter-group">
          <label htmlFor="dataInicio">Data Início:</label>
          <input
            type="date"
            id="dataInicio"
            name="dataInicio"
            value={filters.dataInicio}
            onChange={handleChange}
            className="filter-input"
          />
        <br></br>
        
        
          <label htmlFor="dataFim">Data Fim:</label>
          <input
            type="date"
            id="dataFim"
            name="dataFim"
            value={filters.dataFim}
            onChange={handleChange}
            className="filter-input"
          />
        </div>
        
        </div>
      <table className="os-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Serviço</th>
            <th>Equipamento</th>
            <th>Problema</th>
            <th>Detalhes</th>
            <th>Bairro</th>
            <th>Rua</th>
            <th>Colaborador</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {osList.length > 0 ? (
            osList.map((os) => (
              <tr key={os._id}>
                <td>{os.cliente}</td>
                <td>{os.servicos.join(", ")}</td>
                <td>{os.equipamento}</td>
                <td>{os.problema}</td>
                <td>{os.detalhes || "N/A"}</td>
                <td>{os.bairro}</td>
                <td>{os.rua}</td>
                <td>{os.colaborador}</td>
                <td>{os.status}</td>
                <td>
                  <button onClick={() => openEditModal(os)}>
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="empty-row">Nenhuma OS encontrada</td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && editingOS && (
        <div className="modal">
          <div className="modal-content">
            <h2>Editar OS</h2>
            <label>
              Serviço:
              <input
                type="text"
                name="servicos"
                value={editingOS.servicos.join(", ")}
                onChange={(e) =>
                  setEditingOS((prev) => ({
                    ...prev,
                    servicos: e.target.value.split(",").map((s) => s.trim()),
                  }))
                }
              />
            </label>
            <label>
              Equipamento:
              <input
                type="text"
                name="equipamento"
                value={editingOS.equipamento}
                onChange={handleEditChange}
              />
            </label>
            <label>
              Problema:
              <input
                type="text"
                name="problema"
                value={editingOS.problema}
                onChange={handleEditChange}
              />
            </label>
            <label>
              Status:
              <select
                name="status"
                value={editingOS.status}
                onChange={handleEditChange}
              >
                <option value="Agendado">Agendado</option>
                <option value="Em pausa">Em pausa</option>
                <option value="Cancelado">Cancelado</option>
                <option value="Concluído">Concluído</option>
              </select>
            </label>
            <button onClick={handleSave}>Salvar</button>
            <button onClick={closeEditModal}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VisualizarOS;
