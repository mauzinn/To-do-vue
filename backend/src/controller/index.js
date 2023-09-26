const Express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Routes = require('../models/routes.js')
const App = Express()

//Configuration
    //Body parser
        App.use(bodyParser.urlencoded({extended: true}))
        App.use(bodyParser.json())

    //Cors
        App.use(cors({origin: 'http://localhost:8080'}))

//Routes
    App.use(Routes)








//Server
    App.listen(1243, () => {
        console.log(' - Server rodando!')
    })