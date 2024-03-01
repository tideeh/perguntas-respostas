const Sequelize = require("sequelize");
const connection = require("../database");
// const Resposta = require("./Resposta");

const Pergunta = connection.define("perguntas", {
	titulo: {
		type: Sequelize.STRING,
		allowNull: false
	},
	descricao: {
		type: Sequelize.TEXT,
		allowNull: false
	}
});

// Pergunta.hasMany(Resposta);

Pergunta.sync({force: false}).then(() => {});

module.exports = Pergunta;