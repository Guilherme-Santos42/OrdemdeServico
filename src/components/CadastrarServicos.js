import React, { useState } from "react";
import axios from "axios";

function CadastrarServicos() {
  const [formData, setFormData] = useState({
    nome: "",
    duracao: "",
    valor: "",
  });

  const [mensagem, setMensagem] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/servicos", formData);
      setMensagem("Serviço cadastrado com sucesso!");
      setFormData({ nome: "", duracao: "", valor: "" });
    } catch (error) {
      setMensagem("Erro ao cadastrar serviço.");
    }
  };

  return (
    <div className="cadastrar-servicos">
      <h1>Cadastrar Serviços</h1>
      {mensagem && <p className="mensagem">{mensagem}</p>}
      <form onSubmit={handleSubmit} className="form-cadastrar-servicos">
        <div className="form-group">
          <label htmlFor="nome">Nome do Serviço:</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="duracao">Duração (em horas):</label>
          <input
            type="number"
            id="duracao"
            name="duracao"
            value={formData.duracao}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="valor">Valor Aproximado (R$):</label>
          <input
            type="number"
            id="valor"
            name="valor"
            value={formData.valor}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn-submit">Cadastrar</button>
      </form>
    </div>
  );
}

export default CadastrarServicos;
