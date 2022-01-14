<template>
  <nav class="bg-primary foodHeader py-6">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center">
        <!-- a 連結到首頁 -->
        <router-link to="/"
          ><img
            class="foodHeader-logo d-none d-lg-block"
            :src="require('@/assets/img/logo.png')"
            alt=""
          />
          <i class="bi bi-chevron-left d-block d-lg-none text-dark"></i>
        </router-link>
        <!-- 切換租車、還車量  -->
        <label class="switchBike d-none d-md-block" for="switchbike">
          <div class="switchBike-text">
            <span class="d-flex align-items-center"
              ><i class="fas fa-mountain me-3"></i>景 點</span
            >
            <span class="d-flex align-items-center"
              ><i class="fas fa-hamburger me-3"></i>美 食</span
            >
          </div>
          <input type="checkbox" id="switchbike" @click="selectfoodview()"/>
          <div class="switchBike-control text-primary">
            <span><i class="fas fa-mountain me-3"></i>景 點</span>
            <span><i class="fas fa-hamburger me-3"></i>美 食</span>
          </div>
        </label>
        <div class="invisible"></div>
      </div>
    </div>
  </nav>
  <div class="container foodMain mt-lg-10 my-6">
    <div class="row row-cols-lg-3 row-cols-md-2 row-cols-1 gx-lg-2 gx-md-3 gy-lg-2 gy-md-3 gy-2">
      <div class="col" v-for="item in data" :key="item.ID">
        <div class="card">
          <div class="row g-0">
            <div class="col-5">
              <img
              :src="item.Picture.PictureUrl1 === undefined
              ? require('@/assets/img/notfound.jpg') : item.Picture.PictureUrl1"
              class="img-fluid rounded-start" alt="..." />
            </div>
            <div class="col-7">
              <div class="card-body h-100 d-flex flex-column justify-content-between">
                <div>
                  <p class="text-primary mb-1 text-end">
                    {{countDistance(item.Position.PositionLat, item.Position.PositionLon)}}</p>
                  <h5 class="card-title text-overflow">
                    {{item.name}}
                  </h5>
                </div>
                <p class="card-text text-info text-overflow">
                  <router-link
                  :to="`/FoodViewDetail/${item.ID},${item.key}`"
                  class="stretched-link"></router-link>
                  <i class="bi bi-telephone-fill me-1 text-primary me-2"></i>{{item.Phone}}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <footer
    class="d-md-none py-3 d-flex bg-primary position-fixed bottom-0 w-100"
    style="z-index: 1000"
  >
    <div class="w-50 text-center">
      <a href="#" :class="{'text-white':switchFoodView}"
      @click.prevent="switchFoodView = true;"
      class="footerBar-link text-decoration-none"
        ><i class="fas fa-mountain me-3"></i>景 點</a
      >
    </div>
    <div class="w-50 text-center">
      <a href="#" :class="{'text-white': !switchFoodView}"
      @click.prevent="switchFoodView = false;"
      class="footerBar-link text-decoration-none"
        ><i class="fas fa-hamburger me-3"></i>美 食</a
      >
    </div>
  </footer>
</template>

<script>
import getAuthorizationeHader from '@/assets/javascript/AuthorizationHeader';

export default {
  data() {
    return {
      latitude: '',
      longitude: '',
      datafood: [],
      dataview: [],
      switchFoodView: true,
    };
  },
  methods: {
    getnearAllInfo() {
      const ScenicSpoturl = `https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?$top=30&$spatialFilter=nearby(${this.latitude},${this.longitude}, 5000)&$format=JSON`;
      const Foodurl = `https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant?$top=30&$spatialFilter=nearby(${this.latitude},${this.longitude}, 5000)&$format=JSON`;
      const getnearbyviewinfo = (() => this.$http.get(ScenicSpoturl,
        { headers: getAuthorizationeHader() })
      );
      const getnearbyfoodinfo = (() => this.$http.get(Foodurl,
        { headers: getAuthorizationeHader() })
      );
      Promise.all([getnearbyviewinfo(), getnearbyfoodinfo()])
        .then(([res1, res2]) => {
          this.dataview = res1.data;
          this.datafood = res2.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    updata(arry) {
      const ary = [];
      arry.forEach((item) => {
        const data = {
          key: item.ScenicSpotID ? '景點' : '美食',
          ID: item.ScenicSpotID || item.RestaurantID,
          name: item.ScenicSpotName || item.RestaurantName,
          Picture: { ...item.Picture },
          Position: { ...item.Position },
          Phone: item.Phone,
        };
        ary.push(data);
      });
      return ary;
    },
    countDistance(lat1, lon1) {
      if ((lat1 === this.latitude) && (lon1 === this.longitude)) {
        return 0;
      }
      const radlat1 = (Math.PI * lat1) / 180;
      const radlat2 = (Math.PI * this.latitude) / 180;
      const theta = lon1 - this.longitude;
      const radtheta = (Math.PI * theta) / 180;
      let dist = (Math.sin(radlat1) * Math.sin(radlat2))
        + (Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta));
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      dist *= 1.609344;
      dist = dist.toFixed(3);
      if (dist < 1) {
        return ` ${dist * 1000} 公尺`;
      }
      return `${dist}公里`;
    },
    selectfoodview() { // 給footer切換
      this.switchFoodView = !this.switchFoodView;
    },
    getLocation() { // 抓取自己位置
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition); // 有拿到位置就呼叫 showPosition 函式
      }
    },
    showPosition(position) {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.getnearAllInfo();
    },
  },
  computed: {
    data() {
      if (this.switchFoodView) {
        return this.updata(this.dataview);
      }
      return this.updata(this.datafood);
    },
  },
  mounted() {
    this.getLocation();
  },
};
</script>
