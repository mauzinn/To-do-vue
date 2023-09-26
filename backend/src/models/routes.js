const Express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Listas } = require('./tables.js')
const { Contas } = require('./tables.js')
const Router = Express.Router()
const SECRET = 'SECRET_KEY'

//Midleware
    function VerificarJWT(req, res, next) {
        let token = req.body.token
        let resposta = {}

        try {
            let tokenDecoded = jwt.verify(token, SECRET)

            if (tokenDecoded) {
                resposta = {
                    result: true,
                    id: tokenDecoded.id,
                    name: tokenDecoded.name
                }
            } else {
                resposta = {
                    result: false
                }
            }
        } catch {
            resposta = {
                result: false
            }
        }

        req.resposta = resposta

        next()
    }

//Routes
    //Registro
        Router.post('/account/create', async(req, res) => {
            let name = req.body.name
            let email = req.body.email
            let password = await bcrypt.hash(req.body.password, 10)
            let accountExists = await Contas.findOne({
                    where: {
                        name: name
                    }
                })

            if (name && email && password && !accountExists) {
                Contas.create({
                    name: name,
                    email: email,
                    password: password,
                    completed: "no_completed"
                }).then(() => {
                    res.json({
                        result: true
                    })

                    console.log(' --- Uma conta foi criada!')
                }).catch(() => {
                    res.json({
                        result: false
                    })

                    console.log(' --- Tentativa de criação de conta deu errado!')
                })
            } else {
                res.json({
                    result: false
                })

                console.log(' --- Tentativa de criação de conta deu errado!')
            }
        })

    //Login
        Router.post('/account/compare', async(req, res) => {
            let name = req.body.name
            let password = req.body.password
            let accountExists = await Contas.findOne({
                where: {
                    name: name
                }
            })

            if (accountExists) {
                if (bcrypt.compare(password, accountExists.password)) {
                    let token = jwt.sign({
                        id: accountExists.id,
                        name: accountExists.name
                    }, SECRET, { expiresIn: 86400 })

                    res.json({
                        result: true,
                        token: token
                    })
                } else {
                    res.json({
                        result: false
                    })
                }
            } else {
                res.json({
                    result: false
                })
            }
        })

    //Verificar JWT
        Router.post('/verify/token', VerificarJWT, async(req, res) => {
            let result = await req.resposta

            res.json(result)
        })

    //Criar list-item
        Router.post('/account/create/list/item', (req, res) => {
            let userId = req.body.userId
            let message = req.body.message

            Listas.create({
                message: message,
                user_id: userId
            }).then(() => {
                res.json({
                    result: true
                })
            }).catch(() => {
                res.json({
                    result: false
                })
            })        
        })

    //Puxar list-itens
        Router.post('/account/read/list/item', async(req, res) => {
            let userId = req.body.userId
            let messagesExists = await Listas.findAll({
                where: {
                    user_id: userId
                }
            })

            if (messagesExists) {
                res.json({
                    result: true,
                    messages: messagesExists
                })
            } else {
                res.json({
                    result: false
                })
            }
        })

    //Apagar list-itens
        Router.post('/account/delete/list/item', async(req, res) => {
            let id = req.body.id

            Listas.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.json({
                    result: true
                })
            }).catch(() => {
                res.json({
                    result: false
                }) 
            })
            })

    //Completar task
        Router.post('/account/complete/list/item', (req, res) => {
            let id = req.body.id

            Listas.update({
                completed: "Completed"
            },
            {
                where: {
                    id: id
                }
            }).then(() => {
                res.json({
                    result: true
                })
            }).catch(() => {
                res.json({
                    result: false
                })
            })
        })


module.exports = Router