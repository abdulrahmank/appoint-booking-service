const ProvidersControllerApi = require('./app/controllers/api/v1/providers_controller')
const ProvidersController = require('./app/controllers/providers_controller')
const SlotsController = require('./app/controllers/api/v1/slots_controller')
const bodyParser = require('body-parser')
const express = require('express');

const app = express();

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))

app.listen(3000, function() {
    console.log('listening on 3000')
});

app.get('/api/v1/providers', ProvidersControllerApi.index)
app.get('/api/v1/providers/:providerId', ProvidersControllerApi.show)
app.post('/api/v1/providers/:providerId/slots', SlotsController.create)

app.get('/providers/:providerId', ProvidersController.index)