import router from '@adonisjs/core/services/router';
import AuthController from './controllers/auth_controllers.js';
import UserController from './controllers/user_controllers.js';

// ##########################  AUTH  ##########################

router.group(() => {
    // AUTH
    router.post('/auth/login', [AuthController, 'login']);
    router.post('/auth/logup', [AuthController, 'logup']);
    // USERS
    router.get('/users', [UserController, 'getUsers']);
}).prefix('api')
