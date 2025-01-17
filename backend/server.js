/* CONFIG EXPRESS */
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

// Configuração do servidor
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexão com o MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/dashboard", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Erro na conexão com o MongoDB:"));
db.once("open", () => {
  console.log("Conectado ao MongoDB");
});



// Modelo do Serviço
const servicoSchema = new mongoose.Schema({
  nome: String,
  duracao: Number,
  valor: Number,
});

const Servico = mongoose.model("Servico", servicoSchema);

// Modelo da Visualização OS
const osSchema = new mongoose.Schema({
  cliente: { type: String, required: true },
  servicos: [{ type: String, required: true }],
  equipamento: { type: String, required: true },
  problema: { type: String, required: true },
  detalhes: { type: String },
  marca: { type: String },
  prazo: { type: String },
  colaborador: { type: String },
  data: { type: Date },
  hora: { type: String },
  cep: { type: String },
  bairro: { type: String },
  rua: { type: String },
  status: { type: String },
});



const OS = mongoose.model("OS", osSchema);

// Modelo do Cliente
const clienteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  telefoneCelular: { type: String, required: true },
  telefoneFixo: { type: String },
  bairro: { type: String, required: true },
  rua: { type: String, required: true },
  numeroResidencia: { type: String, required: true },
});

const Cliente = mongoose.model("Cliente", clienteSchema);

// Rotas
app.post("/api/servicos", async (req, res) => {
  try {
    const novoServico = new Servico(req.body);
    await novoServico.save();
    res.status(201).send("Serviço cadastrado com sucesso");
  } catch (error) {
    res.status(500).send("Erro ao cadastrar serviço");
  }
});

app.get("/api/servicos", async (req, res) => {
  try {
    const servicos = await Servico.find();
    res.json(servicos);
  } catch (error) {
    res.status(500).send("Erro ao buscar serviços");
  }
});

// Rota para buscar todos os serviços
app.get("/api/servicos", async (req, res) => {
  try {
    const servicos = await Servico.find();
    res.json(servicos);
  } catch (error) {
    res.status(500).send("Erro ao buscar serviços");
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


// Rota Atualizar OS dentro de VisualizarOS
app.put("/api/os/:id", async (req, res) => {
  try {
    const { id } = req.params; // Captura o ID da URL
    console.log("ID recebido no backend:", id);
    console.log("Dados recebidos no body:", req.body);

    const osAtualizada = await OS.findByIdAndUpdate(id, req.body, { new: true });
    if (!osAtualizada) {
      return res.status(404).send("OS não encontrada");
    }

    res.status(200).send(osAtualizada); // Retorna a OS atualizada
  } catch (error) {
    console.error("Erro ao atualizar OS:", error);
    res.status(500).send("Erro ao atualizar OS");
  }
});



// ROTAS CLIENTE
// Rota para cadastrar cliente
  app.post("/api/clientes", async (req, res) => {
    try {
      const novoCliente = new Cliente(req.body);
      await novoCliente.save();
      res.status(201).send("Cliente cadastrado com sucesso");
    } catch (error) {
      res.status(500).send("Erro ao cadastrar cliente");
    }
  });
  
  // Rota para listar clientes 
  app.get("/api/clientes", async (req, res) => {
    try {
      const clientes = await Cliente.find();
      res.json(clientes);
    } catch (error) {
      res.status(500).send("Erro ao buscar clientes");
    }
  });

  // Rota para buscar todos os clientes
app.get("/api/clientes", async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.json(clientes);
  } catch (error) {
    res.status(500).send("Erro ao buscar clientes");
  }
});

// Rota para cadastrar uma OS
app.post("/api/os", async (req, res) => {
  try {
    const novaOS = new OS(req.body);
    await novaOS.save();
    res.status(201).send("OS cadastrada com sucesso");
  } catch (error) {
    res.status(500).send("Erro ao cadastrar OS");
  }
});

// Rota para listar e filtrar OS
app.get("/api/os", async (req, res) => {
  try {
    const { cliente, status, dataInicio, dataFim } = req.query;

    // Inicializar a query
    const query = {};

    // Filtro por cliente (case-insensitive)
    if (cliente) {
      query.cliente = { $regex: cliente, $options: "i" };
    }

    // Filtro por status (exato)
    if (status) {
      query.status = status; // Caso o status seja um campo exato (não regex)
    }

    // Filtro por data (intervalo)
    if (dataInicio || dataFim) {
      query.data = {};
      if (dataInicio) {
        query.data.$gte = new Date(dataInicio); // Data maior ou igual a dataInicio
      }
      if (dataFim) {
        query.data.$lte = new Date(dataFim); // Data menor ou igual a dataFim
      }
    }

    // Executar a consulta no MongoDB
    const osList = await OS.find(query);
    res.json(osList);
  } catch (error) {
    console.error("Erro ao buscar ordens de serviço:", error);
    res.status(500).send("Erro ao buscar ordens de serviço");
  }
});


//Criação de usuários

// Modelo de Usuário
const usuarioSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "visualizar_os"], default: "visualizar_os" },
});

const Usuario = mongoose.model("Usuario", usuarioSchema);

//ROTA
const bcrypt = require("bcrypt");

app.post("/api/usuarios", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Verificar se o usuário já existe
    const usuarioExistente = await Usuario.findOne({ username });
    if (usuarioExistente) {
      return res.status(400).send("Usuário já existe");
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar novo usuário
    const novoUsuario = new Usuario({ username, password: hashedPassword, role });
    await novoUsuario.save();

    res.status(201).send("Usuário cadastrado com sucesso");
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    res.status(500).send("Erro ao cadastrar usuário");
  }
});

// Rota de autenticação
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Buscar o usuário pelo username
    const usuario = await Usuario.findOne({ username });
    if (!usuario) {
      return res.status(400).send("Usuário ou senha inválidos");
    }

    // Comparar a senha com o hash armazenado
    const senhaValida = await bcrypt.compare(password, usuario.password);
    if (!senhaValida) {
      return res.status(400).send("Usuário ou senha inválidos");
    }

    // Retornar sucesso e o papel do usuário
    res.status(200).json({ role: usuario.role });
  } catch (error) {
    console.error("Erro ao autenticar usuário:", error);
    res.status(500).send("Erro ao autenticar usuário");
  }
});
