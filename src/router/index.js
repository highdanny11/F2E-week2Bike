import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
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
    path: '/CategoryRoadMap/:id',
    name: 'CategoryRoadMap',
    component: () => import('../views/CategoryRoadMap.vue'),
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
