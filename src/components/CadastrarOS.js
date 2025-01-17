import React, { useState, useEffect } from "react";
import axios from "axios";

function CadastrarOS() {
  const [formData, setFormData] = useState({
    cliente: "",
    servico: "",
    equipamento: "",
    problema: "",
    detalhes: "",
    marca: "",
    prazo: "",
    colaborador: "",
    data: "",
    hora: "",
    cep: "",
    bairro: "",
    rua: "",
  });

  const [clientes, setClientes] = useState([]);
  const [servicos, setServicos] = useState([]);

  useEffect(() => {
    fetchClientes();
    fetchServicos();
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/clientes");
      setClientes(response.data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  };

  const fetchServicos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/servicos");
      setServicos(response.data);
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCEPChange = async (e) => {
    const cep = e.target.value;
    setFormData({ ...formData, cep });

    if (cep.length === 8) {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        if (response.data) {
          setFormData({
            ...formData,
            cep,
            bairro: response.data.bairro || "",
            rua: response.data.logradouro || "",
          });
        }
      } catch (error) {
        console.error("Erro ao buscar endereço pelo CEP:", error);
        alert("Não foi possível buscar o endereço. Verifique o CEP.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/os", formData);
      alert("Ordem de Serviço cadastrada com sucesso!");
      setFormData({
        cliente: "",
        servico: "",
        equipamento: "",
        problema: "",
        detalhes: "",
        marca: "",
        prazo: "",
        colaborador: "",
        data: "",
        hora: "",
        cep: "",
        bairro: "",
        rua: "",
      });
    } catch (error) {
      console.error("Erro ao cadastrar OS:", error);
      alert("Erro ao cadastrar OS.");
    }
  };

  return (
    <div className="cadastrar-os">
      <div className="os-title">Cadastrar Ordem de Serviço</div>
      <form onSubmit={handleSubmit} className="os-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="cliente">Cliente:</label>
          <select
            id="cliente"
            name="cliente"
            value={formData.cliente}
            onChange={handleChange}
            required
          >
            <option value="">Selecione um cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente._id} value={cliente.nome}>
                {cliente.nome}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="servico">Serviço:</label>
          <select
            id="servico"
            name="servico"
            value={formData.servico}
            onChange={handleChange}
            required
          >
            <option value="">Selecione um serviço</option>
            {servicos.map((servico) => (
              <option key={servico._id} value={servico.nome}>
                {servico.nome}
              </option>
            ))}
          </select>
        </div>
        </div>
        <div className="form-row">
        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="">Selecione</option>
            <option value="Agendado">Agendado</option>
            <option value="Em Pausa">Em Pausa</option>
            <option value="Cancelado">Cancelado</option>
            <option value="Concluido">Concluido</option>
          </select>
          </div>
          
        <div className="form-group">
          <label htmlFor="equipamento">Equipamento:</label>
          <select
            id="equipamento"
            name="equipamento"
            value={formData.equipamento}
            onChange={handleChange}
            required
          >
            <option value="">Selecione</option>
            <option value="Máquina de Lavar">Máquina de Lavar</option>
            <option value="Ar Condicionado">Ar Condicionado</option>
            <option value="Geladeira">Geladeira</option>
            <option value="Microondas">Microondas</option>
          </select>
        </div>
        </div>
        <div className="form-group">
          <label htmlFor="problema">Problema:</label>
          <textarea
            id="problema"
            name="problema"
            value={formData.problema}
            onChange={handleChange}
            placeholder="Descreva o problema"
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="detalhes">Detalhes:</label>
          <textarea
            id="detalhes"
            name="detalhes"
            value={formData.detalhes}
            onChange={handleChange}
            placeholder="Informações adicionais"
          ></textarea>
        </div>
        <div className="form-row">
        <div className="form-group">
          <label htmlFor="marca">Marca:</label>
          <input
            type="text"
            id="marca"
            name="marca"
            value={formData.marca}
            onChange={handleChange}
            placeholder="Marca do equipamento"
            
          />
        </div>
        <div className="form-group">
        
          <label htmlFor="prazo">Prazo:</label>
          <input
            type="text"
            id="prazo"
            name="prazo"
            value={formData.prazo}
            onChange={handleChange}
            placeholder="Prazo de entrega"
            
          />
         
          
        </div>
        </div>
        <div className="form-group">
      
          <label htmlFor="colaborador">Colaborador:</label>
          <input
            type="text"
            id="colaborador"
            name="colaborador"
            value={formData.colaborador}
            onChange={handleChange}
            placeholder="Nome do colaborador"
            required
          />
          
        </div>
        <div className="form-row">
        <div className="form-group">
          <label htmlFor="data">Data:</label>
          <input
            type="date"
            id="data"
            name="data"
            value={formData.data}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="hora">Hora:</label>
          <input
            type="time"
            id="hora"
            name="hora"
            value={formData.hora}
            onChange={handleChange}
            required
          />
        </div>
        </div>
        <div className="form-row">
        <div className="form-group">
          <label htmlFor="cep">CEP:</label>
          <input
            type="text"
            id="cep"
            name="cep"
            value={formData.cep}
            onChange={handleCEPChange}
            placeholder="Digite o CEP"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="bairro">Bairro:</label>
          <input
            type="text"
            id="bairro"
            name="bairro"
            value={formData.bairro}
            onChange={handleChange}
            placeholder="Bairro"
            
          />
        </div>
        <div className="form-group">
          <label htmlFor="rua">Rua:</label>
          <input
            type="text"
            id="rua"
            name="rua"
            value={formData.rua}
            onChange={handleChange}
            placeholder="Rua"
            
          />
        </div>
        </div>
        <button type="submit" className="btn-submit">
          Cadastrar OS
        </button>
      </form>
    </div>
  );
}

export default CadastrarOS;
