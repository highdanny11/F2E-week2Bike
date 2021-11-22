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
        <p class="mb-0">國立故宮博物院</p>
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
          :to="`/FoodViewMap/${data.Position?.PositionLat},${data.Position?.PositionLon}`"
          class="btn btn-primary px-2 py-1 rounded-50 ms-2">地圖</router-link>
        </h5>
        <p class="text-info">
          {{data.DescriptionDetail === undefined ? data.Description : data.DescriptionDetail}}
        </p>
      </div>
    </div>
  </div>
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
      name: '',
      id: '',
      data: {},
    };
  },
  methods: {
    getData() {
      if (this.name === '景點') {
        const url = `https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?$filter=contains(ID,'${this.id}')&$top=30&$format=JSON`;
        this.$http.get(url, { headers: getAuthorizationeHader() })
          .then((res) => {
            this.data = res.data[0];
          });
      } else {
        const url = `https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant?$filter=contains(ID,'${this.id}')&$top=30&$format=JSON`;
        this.$http.get(url, { headers: getAuthorizationeHader() })
          .then((res) => {
            this.data = res.data[0];
          });
      }
    },
    go() {
      // 操作歷史紀錄
      // 回上一頁，-1，下一頁1，依此類推
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
