import router from '@adonisjs/core/services/router';
import ResultsController from './controllers/results_controller.js';

router.group(() => {
    // STUDENT
    router.post('/student/test/:test_id/results/create', [ResultsController, 'store']);                     // Создание нового результата для теста (STUDENT)
    router.get('/student/test/:test_id/results/', [ResultsController, 'indexStudent']);                     // Получение результатов теста (STUDENT)
    router.get('/student/test/:test_id/results/:result_id/', [ResultsController, 'getResultByIdStudent']);  // Получение результата по ID (STUDENT)
    // ADMIN | TEACHER
    router.get('/teahcer/test/:test_id/results/', [ResultsController, 'indexTeacher']);                     // Получение результатов теста (ADMIN | TEACHER)
    router.get('/teahcer/test/:test_id/results/:result_id/', [ResultsController, 'getResultByIdTeacher']);  // Получение результата по ID (ADMIN | TEACHER)
    router.post('/teahcer/test/:test_id/results/:result_id/check', [ResultsController, 'checkResultTchr']); // Подтверждение проверки результата (ADMIN | TEACHER)
}).prefix('api');
