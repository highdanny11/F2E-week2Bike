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
        <label class="switchBike d-none d-lg-block" for="switchbike">
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
  <div class="container foodMain mt-lg-10 mt-6">
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
                  <p class="text-primary mb-1 text-end">5km內</p>
                  <h5 class="card-title">
                    {{item.RestaurantName === undefined ? item.Name : item.RestaurantName}}
                  </h5>
                </div>
                <p class="card-text text-info text-overflow">
                  <router-link
                  :to="`/FoodViewDetail/${item.ID},${item.RestaurantName === undefined
                  ? '景點' : '美食'}`"
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
    class="d-lg-none py-3 d-flex bg-primary position-fixed bottom-0 w-100"
    style="z-index: 1000"
  >
    <div class="w-50 text-center">
      <a href="#" @click.prevent="selectview()"
      class="footerBar-link text-decoration-none"
        ><i class="fas fa-mountain me-3"></i>景 點</a
      >
    </div>
    <div class="w-50 text-center">
      <a href="#" @click.prevent="selectfood()"
      class="footerBar-link text-decoration-none"
        ><i class="fas fa-hamburger me-3"></i>美 食</a
      >
    </div>
  </footer>
</template>

<script>
import JsSHA from 'jssha';

const getAuthorizationeHader = () => {
  const AppID = process.env.VUE_APP_TRX_ID;
  const AppKey = process.env.VUE_APP_TRX_KEY;
  const GMTString = new Date().toUTCString();
  const ShaObj = new JsSHA('SHA-1', 'TEXT');
  ShaObj.setHMACKey(AppKey, 'TEXT');
  ShaObj.update(`x-date: ${GMTString}`);
  const HMAC = ShaObj.getHMAC('B64');
  const Authorization = `hmac username="${AppID}", algorithm="hmac-sha1", headers="x-date", signature="${HMAC}"`;
  return { Authorization, 'X-Date': GMTString };
};
export default {
  data() {
    return {
      latitude: '',
      longitude: '',
      data: [],
      datafood: [],
      dataview: [],
      switchFoodView: true,
    };
  },
  methods: {
    getnearbyfoodinfo() {
      const url = `https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant?$top=30&$spatialFilter=nearby(${this.latitude},${this.longitude}, 5000)&$format=JSON`;
      this.$http.get(url, { headers: getAuthorizationeHader() })
        .then((res) => {
          this.datafood = res.data;
        });
    },
    getnearbyviewinfo() {
      const url = `https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?$top=30&$spatialFilter=nearby(${this.latitude},${this.longitude}, 5000)&$format=JSON`;
      this.$http.get(url, { headers: getAuthorizationeHader() })
        .then((res) => {
          this.dataview = res.data;
          this.data = res.data;
        });
    },
    selectfood() { // 給footer切換
      this.switchFoodView = false;
      this.data = this.datafood;
    },
    selectview() {
      this.switchFoodView = true;
      this.data = this.dataview;
    },
    selectfoodview() { // 給footer切換
      this.switchFoodView = !this.switchFoodView;
      if (this.switchFoodView) {
        this.data = this.dataview;
      } else {
        this.data = this.datafood;
      }
    },
    getLocation() { // 抓取自己位置
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition); // 有拿到位置就呼叫 showPosition 函式
      }
    },
    showPosition(position) {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.getnearbyfoodinfo(); // 進入頁面就把兩種資料抓下來
      this.getnearbyviewinfo();
    },
  },
  mounted() {
    this.getLocation();
  },
};
</script>
