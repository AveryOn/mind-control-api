import router from '@adonisjs/core/services/router';
import QuestionsController from './controllers/questions_controller.js';

router.group(() => {
    router.get('/student/tests/:test_id/questions', [QuestionsController, 'indexStudent']);   // Получение списка вопросов теста (STUDENT)
}).prefix('api');
