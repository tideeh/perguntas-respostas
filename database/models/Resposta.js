const Sequelize = require("sequelize");
const connection = require("../database");
const Pergunta = require("./Pergunta");

const Resposta = connection.define("respostas", {
	corpo: {
		type: Sequelize.TEXT,
		allowNull: false
	}
});

Resposta.belongsTo(Pergunta);

Resposta.sync({force: false}).then(() => {});

module.exports = Resposta;