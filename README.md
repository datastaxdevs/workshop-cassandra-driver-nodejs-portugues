# Versão em Português do workshop Cassandra driver javascript node.js

Olá e bem-vindo!

Este é o repositório complementar para a apresentação prática dos drivers Cassandra em Javascript / Node.js.

Neste repositório você encontrará todos os trechos de código para você praticar e acompanhar.

> Além disso também disponibilizamos instruções para repetir a prática por conta própria!

Você concluirá esta prática com uma boa compreensão do que pode fazer,
e como, com os drivers Node.js para Apache Cassandra™.

## Documentação oficial
Node.js driver
- [https://docs.datastax.com/en/developer/nodejs-driver/4.6/](https://docs.datastax.com/en/developer/nodejs-driver/4.6/)

## Requisitos
Para praticar você precisa:

- internet (*o banco de dados Apache Cassandra usado aqui está na nuvem*)
-  o Node.js LTS (ou superior) https://nodejs.org/en/

**Nota**: crie sua instância do Apache Cassandra chamado **AstraDB** 
de graça. https://astra.datastax.com/
> Você ganha $25 todo mês em créditos (isso dá até 80GB por mês **na faixa**)

## 1. Configurando o ambiente

> Sugestão: use o Linux, Mac ou WSL/Windows

Começamos com a instalação básica dos componentes:

```shell
mkdir code-pt-br
```
```shell
cd code-pt-br
```
```shell
npm init -y
```
```shell
npm i cassandra-driver dotenv
```
```shell
touch index.js
```
```shell
echo "console.log('Vamos começar')" > index.js
```
```shell
node index.js
```

> Se o terminal mostrou **Vamos começar** você está pronta para continuar!

Nota: vamos usar a versão `"type": "module"` no package.json

## 2. Passo a passo para criar a infraestrutura

O AstraDB é a maneira mais simples de executar o Cassandra com zero instalações - basta apertar o botão e obter seu cluster. 
Não é necessário cartão de crédito, e você ganha crédito de US$ 25,00 todos os meses. Isso é aproximadamente:
- 5 milhões de gravações, 
- 30 milhões de leituras, 
- 40 GB de armazenamento mensal

### Site
✅ Acesse o seu banco de dados em [https://astra.datastax.com](https://astra.datastax.com/)

- Você pode logar com seu `Github`, `Google` ao invés de criar mais uma combinação `email e senha`.

<details>
    <summary>Se for sua primeira vez acessando o site, clique aqui</summary>
    <img src="images-pt-br/Screen Shot 2022-03-15 at 13.20.01.png" />
    <img src="images-pt-br/Screen Shot 2022-03-15 at 13.20.09.png" />
    <img src="images-pt-br/Screen Shot 2022-03-15 at 13.20.59.png" />
</details>

### O banco
> **A interface em https://astra.datastax.com está em Inglês**. Vamos lá:

<img src="images-pt-br/Screen Shot 2022-03-15 at 13.21.07.png" />

- ✅ Clique em um dos botões que com **CREATE DATABASE** ou **CREATE SERVERLESS DATABASE** (ambos são equivalentes)
- ✅ Vamos dar nomes
  - DATABASE NAME: `workshop` 
  - KEYSPACE NAME: `demo`
> Sugiro escolher `NORTH AMERICA` e depois `MONCKS CORNER (us-east1)`
  - ✅ Clique no botão bem a direita **CREATE DATABASE**

<img src="images-pt-br/Screen Shot 2022-03-15 at 13.22.43.png" />

#### Nota
⚠️ Como usuário do plano FREE, você pode usar **GCP** e **qualquer Area ou Região que esteja destravada**

- Se você quiser **GCP** > `SOUTH AMERICA` > `SAO PAULO (southamerica-east1)`, sugiro cadastrar o cartão de crédito
- Se você quiser **AWS** ou **AZURE** > `*qualquer região*` > `*qualquer área*`, sugiro cadastrar o cartão de crédito

### O banco de dados já está ativo?
Você verá seu novo banco de dados pendente no Painel.

O status mudará para Ativo quando o banco de dados estiver pronto.

Você também receberá um e-mail com essa notificação.

<img src="images-pt-br/Screen Shot 2022-03-15 at 14.03.00.png" />

## 🥳 Credenciais para conectar ao banco de dados

Vamos agora expor variaveis de ambiente para conectar ao banco de dados.

### ✅ Clique em "CONNECT" no canto superior direito (imagem)

<img src="images-pt-br/Screen Shot 2022-03-15 at 14.48.34.png" />

### 🚧 Selecione Node.JS no menu lateral

Aqui é um momento chave onde você precisa ir para a página de criação de token e download das credenciais.

- Primeiro clique em **DOWNLOAD BUNDLE**
- Em seguida clique no link com a palavra **HERE** (indicado na imagem)
<img src="images-pt-br/Screen Shot 2022-03-15 at 15.35.42.png" />

### Gere um token como Administrador

<img src="images-pt-br/Screen Shot 2022-03-15 at 14.52.45.png" />

### ✅ Clique em "DOWNLOAD TOKEN DETAILS"

<img src="images-pt-br/Screen Shot 2022-03-15 at 14.53.29.png" />

# 🇧🇷 Conectar ao banco de dados com Javascript

Insira os segredos e credenciais baixados até agora no seu `.env`. 

Sugestão de como inserir (esses valores são exemplos):
 
```shell
touch .env
echo "SECURE_CONNECT_BUNDLE=secure-connect-workshop.zip" >> .env
echo "ASTRA_DB_CLIENT_ID=RAwfLeZORZoPnSUYQSgbnhEX" >> .env
echo "ASTRA_DB_CLIENT_SECRET=XjvJawKpp2iyRZJGDmGFLCc+jvDpRi,MNAs4se5Glj0qhhDm4TBsl7x71vMcexNm8aubaND0pj,zCLOP59JZ2FPh1gT+mIJzCtOx6ZB0ocgSZJ-9bbZfvn-yP5ht85b0" >> .env
```

Vamos testar?

```shell
echo "require('dotenv').config(); \n console.log(process.env.SECURE_CONNECT_BUNDLE)" >> index.js
node index.js
```

O resultado deve ser

```
Vamos começar
secure-connect-workshop.zip
```

# Criar a primeira tabela

Recaptitulando, nosso `package.json` deve estar assim:
````json
{
  "name": "workshop-cassandra-pt-br",
  "version": "1.0.0",
  "description": "Apresentação sobre Cassandra usando drivers",
  "main": "index.js",
  "type": "module",
  "keywords": [],
  "author": "Daniel S<iam@w-b.dev>",
  "license": "Apache",
  "dependencies": {
    "cassandra-driver": "^4.6.3",
    "dotenv": "^16.0.0",
    "express": "^4.17.3"
  },
  "devDependencies": {
    "prettier": "^2.5.1"
  }
}
````

Vamos apagar tudo do `ìndex.js` e substituir com

```js
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
```

Vamos testar?
````shell
node index.js
````
O resultado dever ser
````
ResultSet {
  info: {
    queriedHost: '172.25.140.4:9042',
    triedHosts: { '172.25.140.4:9042': null },
...
````

### Criando dados para o nosso dominio

Os dados aqui são meramente ilustrativos do melhor time de futebol do mundo, e servem somente para ressaltar que o banco de dados Apache Cassandra é altamente distribuído, democrático, aceita falhas muito bem, e é superescalável. Para acessar a planilha, esse é o [link](https://docs.google.com/spreadsheets/d/1ly3WbZQmZigBavp0T6-Hm9ySTJjwmHWTIQrjsi1QiQI/edit?usp=sharing)

> copie esses dados dentro de um arquivo `selecao.csv`

```
nome,camisa,posicao
diego alves,1,goleiro
hugo souza,45,goleiro
matheus cunha,51,goleiro
rodrigo caio,3,zagueiro
gustavo henrique,2,zagueiro
leo pereira,4,zagueiro
david luiz,23,zagueiro
noga,41,zagueiro
cleiton,33,zagueiro
fabricio bruno,15,zagueiro
pablo,30,zagueiro
rodinei,22,laterais direito
isla,44,laterais direito
matheuzinho,34,laterais direito
rene,6,laterais esquerdo
filipe luis,16,laterais esquerdo
ramon,36,laterais esquerdo
willian arao,5,volante
andreas,18,volante
thiago maia,8,volante
joao gomes,35,volante
everton ribeiro,7,meias
diego,10,meias
de arrascaeta,14,meias
lazaro,13,meias
matheus franca,42,meias
gabi gol,9,atacante
vitinho,11,atacante
bruno henrique,27,atacante
pedro,21,atacante
marinho,31,atacante
```

### Data Loader

Vamos usar a functionalidade do AstraDB para carregar os dados acima.

<img src="images-pt-br/Screen Shot 2022-03-15 at 23.14.27.png" />

Com isso:

- a tabela foi criada automaticamente
- os dados foram carregados

Nota: você poderia criar e inserir elementos manualmente também.

```
CREATE TABLE demo.workshopdemojogadores (
    posicao text,
    nome text,
    camisa int,
    PRIMARY KEY (posicao, nome)
)
```

# Pratica com Javascript/Node.js

> Vamos agora para o arquivo `index.js`, e vamos analisar os diversos trechos de codigo comentados la

> The DataStax Developers
