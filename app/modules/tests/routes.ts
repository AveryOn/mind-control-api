import router from '@adonisjs/core/services/router';
import TestsController from './controllers/tests_controller.js';

// ##########################  AUTH  ##########################

router.group(() => {
    router.post('/tests/create', [TestsController, 'store']);         // Создание нового теста
    // router.get('/user/me', [TestsController, 'getOwnerUserData']);
}).prefix('api')
