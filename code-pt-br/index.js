import dotenv from "dotenv"; // permite acessar process.env via .env
import { Client, mapping } from "cassandra-driver"; // 🤩 a estrela de hoje

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

// *****************************************************************************************
/* PARTE 1 */
/* Essa é a função principal da aplicação neste workshop */
const consultarBancoDeDados = async () => {
  await clienteCassandra.connect(); // aguarda a conexão ao banco
  const consultaCQL = `SELECT * FROM system.local`; // 1a consulta CQL do dia
  // const consultaCQL = `SELECT * FROM system_schema.keyspaces`; // 2a consulta CQL do dia
  // const consultaCQL = `DESCRIBE demo`; // 3a consulta CQL do dia - NAO FUNCIONA
  // const consultaCQL = `SELECT * FROM demo.workshopdemojogadores`; // 4a
  // a próxima linha aguarda a execução da consulta
  const respostaConsulta = await clienteCassandra.execute(consultaCQL);
  await clienteCassandra.shutdown(); // desconecta ao banco
  return respostaConsulta;
};

const resultadoFinal = await consultarBancoDeDados();
console.log(resultadoFinal);
// *****************************************************************************************
/* PARTE 2 */
// const consultarBancoDeDados = async () => {
//   await clienteCassandra.connect(); // aguarda a conexão ao banco
//   const consultaCQL = `SELECT * FROM demo.workshopdemojogadores`; // 5a
//   const respostaConsulta = await clienteCassandra.execute(consultaCQL);
//   respostaConsulta.rows.forEach((resultado, i) =>
//     console.log(i, resultado.values())
//   );
//   await clienteCassandra.shutdown(); // desconecta ao banco
//   return respostaConsulta;
// };
// await consultarBancoDeDados();
// *****************************************************************************************
/* PARTE 3 */
// const consultarBancoDeDados = async () => {
//   await clienteCassandra.connect(); // aguarda a conexão ao banco
//   const consultaCQL = `SELECT * FROM demo.workshopdemojogadores`; // 6a
//   const respostaConsulta = await clienteCassandra.execute(consultaCQL);
//   console.log(respostaConsulta.first().values());
//   await clienteCassandra.shutdown(); // desconecta ao banco
//   return respostaConsulta;
// };
// await consultarBancoDeDados();
// *****************************************************************************************
/* PARTE 4 */
// const consultarBancoDeDados = async () => {
//   await clienteCassandra.connect(); // aguarda a conexão ao banco
//   /* PREPARED STATEMENTS */
//   // const consultaCQL = `SELECT nome, camisa FROM demo.workshopdemojogadores WHERE posicao=?`; // 7a
//   // const respostaConsulta = await clienteCassandra.execute(
//   //   consultaCQL,
//   //   ["atacante"],
//   //   { prepare: true }
//   // );
//   // console.log(respostaConsulta.first().values());
//   const consultaCQL = `INSERT INTO demo.workshopdemojogadores (nome, camisa, posicao) VALUES (?,?,?)`; // 8a
//   const respostaConsulta = await clienteCassandra.execute(
//     consultaCQL,
//     [
//       `workshop brasil ${Date.now().toLocaleString("pt-br")}`,
//       Math.round(Date.now() / 1_000),
//       "perna de pau",
//     ],
//     {
//       prepare: true,
//     }
//   );
//   const consultaCQL2 = `SELECT * FROM demo.workshopdemojogadores`; // 5a
//   const respostaConsulta2 = await clienteCassandra.execute(consultaCQL2);
//   respostaConsulta2.rows.forEach((resultado, i) =>
//     console.log(i, resultado.values())
//   );
//   await clienteCassandra.shutdown(); // desconecta ao banco
//   return respostaConsulta;
// };
// await consultarBancoDeDados();
/*******************************************************/
/*PARTE 5
 * https://docs.datastax.com/en/developer/nodejs-driver/4.6/features/mapper/defining-mappings/
 * https://docs.datastax.com/en/developer/nodejs-driver/4.6/features/mapper/queries/
 * https://docs.datastax.com/en/developer/nodejs-driver/4.6/features/mapper/getting-started/
 */
/* Lembrete do shape da tabela
* CREATE TABLE demo.workshopdemojogadores (
    posicao text,
    nome text,
    camisa int,
    PRIMARY KEY (posicao, nome)
)
* */
/*******************************************************/
// const mapper = new mapping.Mapper(clienteCassandra, {
//   models: {
//     jogadores: { tables: ["workshopdemojogadores"] },
//   },
// });
// const jogadores = mapper.forModel("jogadores");
// const consultarBancoDeDados = async () => {
//   // const todosOsJogadores = await jogadores.findAll();
//   const todosOsJogadores = await jogadores.find({
//     posicao: "atacante",
//     nome: "gabi gol",
//     // camisa: 9,
//   });
//   // const todosOsJogadores = await jogadores.get({
//   //   posicao: "atacante",
//   //   nome: "gabi gol",
//   // });
//   console.log(todosOsJogadores);
//   await clienteCassandra.shutdown(); // desconecta ao banco
// };
// await consultarBancoDeDados();
