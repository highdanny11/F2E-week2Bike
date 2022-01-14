<template>
  <nav class="bg-primary foodHeader-detaiil py-6">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center">
        <!-- a 連結到首頁 -->
        <a href="#" @click.prevent="go()"
          ><img
            class="navHeader-logo d-none d-lg-block"
            :src="require('@/assets/img/logo.png')"
            alt=""
          />
          <i class="bi bi-chevron-left d-block d-lg-none text-dark"></i>
        </a>
        <p class="mb-0">{{data.name}}</p>
        <div class="invisible d-lg-none"></div>
      </div>
    </div>
  </nav>
  <div class="container mt-7">
    <div class="row justify-content-center">
      <div class="col-lg-8 col-md-10">
        <img
          :src="data.Picture?.PictureUrl1 === undefined
          ? require('@/assets/img/notfound.jpg') : data.Picture.PictureUrl1"
          class="img-fluid w-100 img-thumbnail p-5 mb-4"
          alt="..."
        />
        <p class="d-flex">
          <i class="bi bi-clock-fill text-primary me-2"></i>
          {{data.OpenTime}}
        </p>
        <p class="d-flex align-items-center">
          <i class="bi bi-telephone-fill text-primary me-2"></i>
          {{data.Phone}}</p>
        <h5 class="d-flex align-items-center fs-6">
          <i class="bi bi-geo-alt-fill text-primary me-2"></i>
          {{data.Address}}
          <router-link
          :to="`/FoodViewMap/${toMapData}`"
          class="btn btn-primary px-2 py-1 rounded-50 ms-2">地圖</router-link>
        </h5>
        <p class="text-info">
          {{data.DescriptionDetail}}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import getAuthorizationeHader from '@/assets/javascript/AuthorizationHeader';

export default {
  data() {
    return {
      name: '',
      id: '',
      data: {},
      toMapData: null,
    };
  },
  methods: {
    getData() {
      if (this.name === '景點') {
        const url = `https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?$filter=contains(ScenicSpotID,'${this.id}')&$top=30&$format=JSON`;
        this.$http.get(url, { headers: getAuthorizationeHader() })
          .then((res) => {
            this.updata(res.data[0]);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        const url = `https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant?$filter=contains(RestaurantID,'${this.id}')&$top=30&$format=JSON`;
        this.$http.get(url, { headers: getAuthorizationeHader() })
          .then((res) => {
            this.updata(res.data[0]);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    updata(data) {
      this.data = {
        ID: data.ScenicSpotID || data.RestaurantID,
        name: data.ScenicSpotName || data.RestaurantName,
        Picture: { ...data.Picture },
        Position: { ...data.Position },
        Phone: data.Phone,
        DescriptionDetail: data.Description || data.DescriptionDetail,
        OpenTime: data.OpenTime,
        Address: data.Address,
      };
      this.toMapData = `${this.data.Position.PositionLat},${this.data.Position.PositionLon},${this.data.name}`;
    },
    go() {
      this.$router.go(-1);
    },
  },
  mounted() {
    const data = this.$route.params.id.split(',');
    this.name = data[1];
    this.id = data[0];
    this.getData();
  },
};
</script>
