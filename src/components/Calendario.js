import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";


function Calendario() {
  const [ordensDeServico, setOrdensDeServico] = useState([]);
  const [highlightedDates, setHighlightedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [clientesForDate, setClientesForDate] = useState([]);
  

  // Função para buscar as ordens de serviço
  const fetchOrdensDeServico = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/os"); // Ajuste conforme necessário
      const ordens = response.data;

      // Mapeia as ordens para obter as datas e nomes dos clientes
      const ordensPorData = ordens.reduce((acc, os) => {
        const data = os.data ? new Date(os.data) : null; // Verifica se existe data e a converte

        // Se a data for válida, formata ela corretamente
        if (data && !isNaN(data)) {
          const dataString = data.toISOString().split("T")[0]; // 'YYYY-MM-DD'

          // Adiciona a ordem de serviço na data correspondente
          if (!acc[dataString]) {
            acc[dataString] = [];
          }
          acc[dataString].push(os.cliente); // Salva o nome do cliente
        }

        return acc;
      }, {});

      // Atualiza o estado com as ordens agrupadas por data
      setHighlightedDates(ordensPorData);
    } catch (error) {
      console.error("Erro ao buscar ordens de serviço:", error);
    }
  };

  useEffect(() => {
    fetchOrdensDeServico();
  }, []); // Executa uma vez após o componente ser montado

  const handleDateClick = (date) => {
    const dateString = date.toISOString().split("T")[0]; // Normalizar a data selecionada
    setSelectedDate(dateString);

    // Filtrar os clientes para a data selecionada
    const clientes = highlightedDates[dateString] || [];
    setClientesForDate(clientes);
  };


  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const dateString = date.toISOString().split("T")[0]; // Normaliza a data no formato YYYY-MM-DD
      if (highlightedDates[dateString]) {
        return "highlight"; // Marca os dias com ordens de serviço
      }
    }
    return null;
  };

  return (
    <div className="calendario-container">
      <h1>Calendário de OS</h1>

      {/* Calendário */}
      <Calendar
        onClickDay={handleDateClick}
        tileClassName={tileClassName}
      
      />

      

      {/* Exibição dos clientes */}
      {selectedDate && (
        <div className="clientes-list">
          <h2>Clientes para {selectedDate}:</h2>
          {clientesForDate.length > 0 ? (
            <ul>
              {clientesForDate.map((cliente, index) => (
                <li key={index}>{cliente}</li>
              ))}
            </ul>
          ) : (
            <p>Não há clientes marcados para esta data.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Calendario;
