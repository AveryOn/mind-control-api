import router from '@adonisjs/core/services/router';
import TestsController from './controllers/tests_controller.js';

router.group(() => {
    router.post('/tests/create', [TestsController, 'store']);           // Создание нового теста
    router.get('/teacher/tests/', [TestsController, 'indexTeacher']);   // Получение списка тестов (ADMIN | TEACHER)
    router.get('/student/tests/', [TestsController, 'indexStudent']);   // Получение списка тестов (STUDENT)
    router.get('/student/test/:test_id', [TestsController, 'getTestByIdStudent']);   // Получение теста по ID (STUDENT)
}).prefix('api');
