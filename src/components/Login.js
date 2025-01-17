import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        username,
        password,
      });

      // Salvar o papel do usuário no localStorage
      localStorage.setItem("userRole", response.data.role);

      // Redirecionar para o dashboard
      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data || "Erro ao fazer login. Verifique suas credenciais."
      );
    }
  };

  return (
    <div className="login-container">
      <div className="logo">
        <img src="/novo.png" alt="Logo" className="logo-img" />
      </div>
      <br />
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <br />
        <button type="submit">Entrar</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default Login;
