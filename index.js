const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();
const connection = require("./database/database");
const Pergunta = require("./database/models/Pergunta");
const Resposta = require("./database/models/Resposta");

connection.authenticate()
	.then(() => {
		console.log("Conectado ao banco de dados com sucesso!");
	})
	.catch((msgErro) => {
		console.log(msgErro);
	});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get("/", (req, res) => {
	Pergunta.findAll({
		raw: true,
		order: [["id", "DESC"]]
	}).then((perguntas) => {
		// console.log(perguntas);
		res.render("index", {
			perguntas: perguntas
		});
	}).catch((err) => {
		res.send(err.original.sqlMessage);
	});
});

app.get("/pergunta/:id", (req, res) => {
	const id = req.params.id;

	Pergunta.findOne({
		where: { id: id }
	}).then((pergunta) => {
		if( pergunta != undefined ) {
			
			Resposta.findAll({
				raw: true,
				where: { perguntaId: pergunta.id },
				order: [["id", "DESC"]]
			}).then((respostas) => {
				res.render("pergunta", {
					pergunta: pergunta,
					respostas: respostas
				});
			}).catch((err) => {
				res.send(err.original.sqlMessage);
			});

		} else {
			res.send("Pergunta não encontrada!")
		}
	}).catch((err) => {
		res.send(err.original.sqlMessage);
	});
});

app.get("/perguntar", (req, res) => {
	res.render("perguntar");
});

app.post("/salvar-pergunta", (req, res) => {
	const titulo = req.body.titulo;
	const descricao = req.body.descricao;

	Pergunta.create({
		titulo: titulo,
		descricao: descricao
	}).then(() => {
		res.json({ success: true });
	}).catch((err) => {
		res.json({
			success: false,
			msg: err.original.sqlMessage
		});
	});
});

app.post("/responder", (req, res) => {
	const resposta = req.body.resposta;
	const perguntaId = req.body.perguntaId;

	Resposta.create({
		corpo: resposta,
		perguntaId: perguntaId
	}).then(() => {
		res.json({ success: true });
	}).catch((err) => {
		res.json({
			success: false,
			msg: err.original.sqlMessage
		});
	});
});

app.listen(process.env.APP_PORT, () => {
	console.log("App rodando na porta "+process.env.APP_PORT);
});