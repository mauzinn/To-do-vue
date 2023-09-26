const Sequelize = require('sequelize')

const sequelize = new Sequelize('TODO', 'root', 'YOUR_PASSWORD', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}