import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/RentBike',
    name: 'RentBike',
    component: () => import('../views/RentBike.vue'),
  },
  {
    path: '/CategoryRoad',
    name: 'CategoryRoad',
    component: () => import('../views/CategoryRoad.vue'),
  },
  {
    path: '/FoodList',
    name: 'FoodList',
    component: () => import('../views/FoodList.vue'),
  },
  {
    path: '/FoodViewDetail/:id',
    name: 'FoodViewDetail',
    component: () => import('../views/FoodViewDetail.vue'),
  },
  {
    path: '/FoodViewMap/:id',
    name: 'FoodViewMap',
    component: () => import('../views/FoodViewMap.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
