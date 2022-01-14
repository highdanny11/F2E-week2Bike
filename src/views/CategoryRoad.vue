<template>
  <nav class="bg-primary navHeader py-6">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center">
        <!-- a 連結到首頁 -->
        <a href="#" @click.prevent="toList"
          ><img
            class="navHeader-logo d-none d-lg-block"
            :src="require('@/assets/img/logo.png')"
            alt=""
          />
          <i class="bi bi-chevron-left d-block d-lg-none text-dark"></i>
        </a>
        <h3 class="mb-0" v-show="roadName">{{roadName}}</h3>
        <select
          v-if="changeMap"
          v-model="currentCategory"
          @change="getCategoryRoad()"
          class="form-select w-auto rounded-31"
          aria-label="select Category"
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
  <div v-if="changeMap"
  class="container CategoryRoad py-10 position-relative">
    <p class="text-info" v-if="!switchContent">尚未選擇任何縣市</p>
    <ul v-if="switchContent"
    class="row row-cols-lg-3 row-cols-md-2 row-cols-1
    gx-md-3 gx-lg-2 gy-3 list-unstyled pb-5">
      <li
      v-for="item in roadList" :key="item.Geometry.coordinates[0][0]"
      class="col">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title text-overflow">{{item.RouteName}}</h5>
            <!-- 跳轉連結 -->
            <a href="#" @click.prevent="toMap(item)"
            class="stretched-link"></a>
            <div class="d-flex justify-content-between
            align-items-center text-info">
              <p>{{item.CyclingLength ? `${item.CyclingLength}公尺` : '暫不提供'}}</p>
              <p class="d-flex align-items-center text-info text-overflow w-50">
                <i class="bi bi-geo-alt-fill text-primary me-2"></i>
                {{item.City}}  {{item.Town}}
              </p>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <ul v-if="switchContent"
    class="
    list-unstyled d-flex justify-content-center
    align-items-center position-absolute start-50 bottom-0 translate-middle-x">
      <li>
        <button type="button" @click="frontPage"
        :class="{'disabled' : currentPage === 1}"
        class="carouselBtnLeft btn">
          <i class="bi bi-caret-left-fill"></i>
        </button>
      </li>
      <li class="mx-3">
        <p class="mb-0 fs-4 text-bold">{{currentPage}}</p>
      </li>
      <li>
        <button type="button" @click="nextPage"
        :class="{'disabled' : currentPage === data.length}"
        class="carouselBtnRight btn">
          <i class="bi bi-caret-right-fill"></i>
        </button>
      </li>
    </ul>
  </div>
  <RoadMap
  :road-data="roadDate"
  v-if="!changeMap"></RoadMap>
</template>

<script>
import Wkt from 'wicket';
import getAuthorizationeHader from '@/assets/javascript/AuthorizationHeader';
import RoadMap from '@/components/RoadMap.vue';

const wkt = new Wkt.Wkt();

export default {
  components: {
    RoadMap,
  },
  data() {
    return {
      currentCategory: 'all',
      data: [],
      switchContent: false,
      currentPage: 1,
      changeMap: true,
      roadName: '',
      roadDate: null,
    };
  },
  methods: {
    getCategoryRoad() {
      this.changeMap = true;
      const url = `https://ptx.transportdata.tw/MOTC/v2/Cycling/Shape/${this.currentCategory}?&$format=JSON`;
      this.$http.get(url, { headers: getAuthorizationeHader() })
        .then((res) => {
          this.switchContent = true;
          let arry = [];
          this.data = [];
          res.data.forEach((item, i) => {
            item.Geometry = wkt.read(item.Geometry).toJson();
            arry.push(item);
            if (arry.length === 20) {
              this.data.push(arry);
              arry = [];
              return;
            }
            if (i === res.data.length - 1) {
              this.data.push(arry);
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    frontPage() {
      this.currentPage -= 1;
      window.scrollTo(0, 100);
    },
    nextPage() {
      this.currentPage += 1;
      window.scrollTo(0, 100);
    },
    toMap(item) {
      this.changeMap = false;
      this.roadName = item.RouteName;
      const data = JSON.parse(JSON.stringify(item));
      this.roadDate = data;
    },
    toList() {
      if (this.changeMap) {
        this.$router.push({
          name: 'Home',
        });
      }
      this.roadName = '';
      this.changeMap = true;
      this.roadDate = null;
    },
  },
  computed: {
    roadList() {
      if (this.currentPage >= this.data.length) {
        return this.data[this.data.length - 1];
      }
      return this.data[this.currentPage - 1];
    },
  },
};
</script>
