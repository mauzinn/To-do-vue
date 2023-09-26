const mysql = require('./sequelize.js')

const Contas = mysql.sequelize.define('contas', {
    email: {
        type: mysql.Sequelize.TEXT
    },
    name: {
        type: mysql.Sequelize.TEXT
    },
    password: {
        type: mysql.Sequelize.TEXT
    }
})

const Listas = mysql.sequelize.define('listas', {
    message: {
        type: mysql.Sequelize.TEXT
    },
    user_id: {
        type: mysql.Sequelize.INTEGER
    },
    completed: {
        type: mysql.Sequelize.TEXT
    }
})

module.exports = {
    Contas: Contas,
    Listas: Listas
}