<template>
  <div
    class="
      bg-primary
      vh-100
      position-relative
      d-flex
      justify-content-center
      align-items-center
    "
  >
    <div class="banner-wrap">
      <img
        class="bikeImg mb-n3"
        :src="require('@/assets/img/bike.gif')"
        alt=""
      />
      <h1 class="mb-2 textReplaceImg banner-logo"></h1>
      <p class="letterSp-lg-13 letterSp-md-15 letterSp-10">
        微笑單車．暢遊城市
      </p>
      <ul class="list-unstyled">
        <li class="mb-4">
          <router-link
            to="/RentBike"
            class="btn btn-outline-dark py-3 w-100 border-2 rounded-10"
            >尋找 Youbike</router-link
          >
        </li>
        <li class="mb-4">
          <router-link
            to="/CategoryRoad"
            class="btn btn-outline-dark py-3 w-100 border-2 rounded-10"
            >查詢自行車道</router-link
          >
        </li>
        <li>
          <router-link
            to="/FoodList"
            class="btn btn-outline-dark py-3 w-100 border-2 rounded-10"
            >附近景點、美食</router-link
          >
        </li>
      </ul>
    </div>
    <p class="banner-footer position-absolute bottom-0">
      Where’s YouBike © Code: Sam / Design: KT
    </p>
  </div>
</template>
