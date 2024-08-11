import router from '@adonisjs/core/services/router';
import AuthController from './controllers/auth_controllers.js';

// ##########################  AUTH  ##########################

router.group(() => {
    router.post('/auth/login', [AuthController, 'login']);
    router.post('/auth/logup', [AuthController, 'logup']);
}).prefix('api')
