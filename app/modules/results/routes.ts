import router from '@adonisjs/core/services/router';
import ResultsController from './controllers/results_controller.js';

router.group(() => {
    router.post('/student/test/:test_id/results/create', [ResultsController, 'store']);                     // Создание нового результата для теста (STUDENT)
    router.get('/teahcer/test/:test_id/results/', [ResultsController, 'indexTeacher']);                     // Получение результатов теста (ADMIN | TEACHER)
    router.get('/teahcer/test/:test_id/results/:result_id/', [ResultsController, 'getResultByIdTeacher']);  // Получение результата по ID (ADMIN | TEACHER)
}).prefix('api');
