import router from '@adonisjs/core/services/router';
import GroupsController from './controllers/groups_controller.js';

// ##########################  AUTH  ##########################

router.group(() => {
    router.post('/groups/create', [GroupsController, 'store']);         // Создание новой группы
}).prefix('api')
