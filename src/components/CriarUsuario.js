import React, { useState } from "react";
import axios from "axios";

function CriarUsuario() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("visualizar_os"); // Padrão: visualizar_os
  const [message, setMessage] = useState("");

  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/usuarios", {
        username,
        password,
        role,
      });

      // Resetar o formulário e exibir mensagem de sucesso
      setUsername("");
      setPassword("");
      setRole("visualizar_os");
      setMessage(response.data);
    } catch (error) {
      setMessage(
        error.response?.data || "Erro ao cadastrar usuário. Tente novamente."
      );
    }
  };

  return (
    <div className="cadastrar-cliente">
      <h2>Criar Novo Usuário</h2>
      <form onSubmit={handleCreateUser}>
        
          <label>Nome de Usuário:</label>
          <div className="form-group">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
        <div className="form-group">
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        
        </div>
        </div>
        <div>
        <div className="form-group">
          <label>Papel:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="visualizar_os">Visualizar OS</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        </div>
        <br></br>
        <button type="submit" className="btn-submit">Criar Usuário</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default CriarUsuario;
