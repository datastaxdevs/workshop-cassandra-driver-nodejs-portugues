import dotenv from "dotenv"; // permite acessar process.env via .env
import { Client } from "cassandra-driver"; // 🤩 a estrela de hoje

dotenv.config(); // inicializa o pacote

/* Configurações do banco de dados na nuvem, AstraDB */
const cassandraConfig = {
  cloud: {
    secureConnectBundle: process.env.SECURE_CONNECT_BUNDLE,
  },
  credentials: {
    username: process.env.ASTRA_DB_CLIENT_ID,
    password: process.env.ASTRA_DB_CLIENT_SECRET,
  },
  keyspace: "demo",
};

const clienteCassandra = new Client(cassandraConfig); // inicializa o cliente

/* Essa é a função principal da aplicação neste workshop */
const consultarBancoDeDados = async () => {
  await clienteCassandra.connect(); // aguarda a conexão ao banco
  const consultaCQL = `SELECT * FROM system.local`; // 1a consulta CQL do dia
  // a próxima linha aguarda a execução da consulta
  const respostaConsulta = await clienteCassandra.execute(consultaCQL);
  await clienteCassandra.shutdown(); // desconecta ao banco
  return respostaConsulta;
};

const resultadoFinal = await consultarBancoDeDados();
console.log(resultadoFinal);
