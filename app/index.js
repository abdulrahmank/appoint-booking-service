const ProvidersController = require('./controllers/api/v1/providers_controller')
const bodyParser = require('body-parser')
const express = require('express');
const app = express();

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))

app.listen(3000, function() {
    console.log('listening on 3000')
});

app.get('/api/v1/providers', ProvidersController.index)
app.get('/api/v1/providers/:provider_id', ProvidersController.show)