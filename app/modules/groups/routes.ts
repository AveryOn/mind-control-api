import router from '@adonisjs/core/services/router';
import GroupsController from './controllers/groups_controller.js';

// ##########################  AUTH  ##########################

router.group(() => {
    router.get('/groups', [GroupsController, 'index']);                 // Извлечение списка групп с БД
    router.post('/groups/create', [GroupsController, 'store']);         // Создание новой группы
}).prefix('api')
