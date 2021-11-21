<template>
  <nav class="bg-primary navHeader py-6">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center">
        <!-- a 連結到首頁 -->
        <router-link to="/"
          ><img
            class="navHeader-logo d-none d-lg-block"
            :src="require('@/assets/img/logo.png')"
            alt=""
          />
          <i class="bi bi-chevron-left d-block d-lg-none text-dark"></i>
        </router-link>
        <!-- 切換顯示，車道 -->
        <select
          v-model="currentCategory"
          @change="getCategoryRoad()"
          class="form-select w-auto rounded-31"
          aria-label="Default select example"
        >
          <option value="all" selected disabled>選擇縣市</option>
          <option value="Taipei">臺 北 市</option>
          <option value="NewTaipei">新 北 市</option>
          <option value="Taoyuan">桃 園 市</option>
          <option value="Taichung">台 中 市</option>
          <option value="Tainan">台 南 市</option>
          <option value="Kaohsiung">高 雄 市</option>
          <option value="Keelung">基 隆 市</option>
          <option value="HsinchuCounty">新 竹 縣</option>
          <option value="MiaoliCounty">苗 栗 縣</option>
          <option value="ChanghuaCounty">彰 化 縣</option>
          <option value="NantouCounty">南 投 縣</option>
          <option value="YunlinCounty">雲 林 縣</option>
          <option value="ChiayiCounty">嘉 義 縣</option>
          <option value="Chiayi">嘉 義 市</option>
          <option value="PingtungCounty">屏 東 縣</option>
          <option value="YilanCounty">宜 蘭 縣</option>
          <option value="HualienCounty">花 蓮 縣</option>
          <option value="TaitungCounty">台 東 縣</option>
          <option value="KinmenCounty">金 門 縣</option>
          <option value="PenghuCounty">澎 湖 縣</option>
        </select>
      </div>
    </div>
  </nav>
  <div class="container CategoryRoad pt-10">
    <p class="text-info" v-if="!switchContent">尚未選擇任何縣市</p>
    <ul v-if="switchContent"
    class="row row-cols-lg-3 row-cols-md-2 row-cols-1
    gx-md-3 gx-lg-2 gy-3 list-unstyled">
      <li
      v-for="item in data" :key="item.Geometry"
      class="col">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title text-overflow">{{item.RouteName}}</h5>
            <!-- 跳轉連結 -->
            <router-link
            :to="`/CategoryRoadMap/${this.currentCategory},${changeString(item.RouteName)}`"
            class="stretched-link"
            ></router-link>
            <div class="d-flex justify-content-between
            align-items-center text-info">
              <p>{{item.CyclingLength / 1000}}公里</p>
              <p class="d-flex align-items-center text-info text-overflow w-50">
                <i class="bi bi-geo-alt-fill text-primary me-2"></i>
                {{item.City}}  {{item.Town}}
              </p>
            </div>
          </div>
        </div>
      </li>
    </ul>
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
      currentCategory: 'all',
      data: [],
      switchContent: false,
    };
  },
  methods: {
    getCategoryRoad() {
      const url = `https://ptx.transportdata.tw/MOTC/v2/Cycling/Shape/${this.currentCategory}?$top=30&$format=JSON`;
      this.$http.get(url, { headers: getAuthorizationeHader() })
        .then((res) => {
          this.switchContent = true;
          this.data = res.data;
        });
    },
    changeString(str) {
      const changeStr = str.replace('/', '');
      return changeStr;
    },
  },
};
</script>
