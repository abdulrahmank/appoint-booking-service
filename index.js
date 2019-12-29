const ProvidersControllerApi = require('./app/controllers/api/v1/providers_controller')
const BookingRequestsController = require('./app/controllers/api/v1/booking_requests_controller')
const ProvidersController = require('./app/controllers/providers_controller')
const SlotsController = require('./app/controllers/api/v1/slots_controller')
const AccessTokensController = require('./app/controllers/api/v1/fcm/access_tokens_controller')

const credentialsAuthorizer = require('./app/middleware/credentials_authorizer')
const initiateCookie = require('./app/middleware/initiate_cookie_middleware')

const bodyParser = require('body-parser')
const express = require('express');
const basicAuth = require('express-basic-auth')

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));

const auth = basicAuth({
    authorizer: credentialsAuthorizer,
    challenge: true,
    authorizeAsync: true
});

app.listen(3000, function() {
    console.log('listening on 3000')
});

app.get('/api/v1/providers', ProvidersControllerApi.index);
app.get('/api/v1/providers/:providerId', ProvidersControllerApi.show);
app.post('/api/v1/providers/:providerId/slots', SlotsController.create);
app.post('/api/v1/users/:userId/access_token', AccessTokensController.create);
app.post('/api/v1/requests/create', BookingRequestsController.create);

app.get('/providers/:providerId', [auth, initiateCookie], ProvidersController.index);