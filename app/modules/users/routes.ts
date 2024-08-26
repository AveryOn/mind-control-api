import router from '@adonisjs/core/services/router';
import AuthController from './controllers/auth_controllers.js';
import UserController from './controllers/user_controllers.js';

// ##########################  AUTH  ##########################

router.group(() => {
    // AUTH
    router.post('/auth/login', [AuthController, 'login']);
    router.post('/auth/logup', [AuthController, 'logup']);
    router.delete('/auth/logout', [AuthController, 'logout']);
    router.get('/auth/check', [AuthController, 'checkAccess']);
    // USERS
    router.get('/users', [UserController, 'getUsers']);
    router.get('/user/me', [UserController, 'getOwnerUserData']);
}).prefix('api')
