<template>
  <nav class="bg-primary navHeader py-6">
    <div class="container">
      <div class="d-flex justify-content-center align-items-center justify-content-md-between">
        <!-- a 連結到首頁 -->
        <router-link to="/"
          ><img
            class="navHeader-logo"
            :src="require('@/assets/img/logo.png')"
            alt=""
          />
        </router-link>
        <!-- 切換租車、還車量  -->
        <label class="switchBike d-none d-md-block" for="switchbike">
          <div class="switchBike-text">
            <span class="d-flex align-items-center"
              ><i class="fas fa-biking me-3"></i>租 車</span
            >
            <span class="d-flex align-items-center"
              ><i class="fas fa-parking me-3"></i>還 車</span
            >
          </div>
          <input type="checkbox" id="switchbike"
          v-model="swichBikeStation"
          @click="swichBikeStation = !swichBikeStation" />
          <div class="switchBike-control text-primary">
            <span><i class="fas fa-biking me-3"></i>租 車</span>
            <span><i class="fas fa-parking me-3"></i>還 車</span>
          </div>
        </label>
        <div class="invisible d-none d-lg-block" style="width:75px;">...</div>
      </div>
    </div>
  </nav>
  <div class="position-relative">
    <!-- 尋找站點，暫時關閉 -->
    <div class="w-md-50 w-75 w-lg-25 d-flex input-group d-flex
    position-absolute start-50 top-10 translate-middle"
    style="z-index:1000;">
      <select class="form-select me-1"
      @change="getCitysStations"
      v-model="category"
      aria-label="select CityName">
        <option selected value="">選擇縣市</option>
        <option
        :value="placeItem.City"
        v-for="placeItem in place"
        :key="placeItem.City">
        {{placeItem.CityName}}
        </option>
      </select>
      <select class="form-select"
      v-show="cityStations[0]"
      v-model="stationName"
      @change="searchStation()"
      aria-label="select station">
        <option selected value="">選擇站點</option>
        <option :value="stationData.StationName.Zh_tw"
        v-for="stationData in cityStations"
        :key="stationData.StationName.Zh_tw">
        {{stationData.StationName.Zh_tw}}
        </option>
      </select>
    </div>
    <button type="button" @click.prevent="backToMylocal"
    v-show="localIconShowHiden"
    class="position-absolute rounded-circle positionIcon
    justify-content-center align-items-center
    flex-column btn btn-dark">
      <img class="d-block" style="width:25px;" :src="require('@/assets/img/Vector.png')" alt="">
      <p class="mb-0 d-none d-md-block">所在地</p>
    </button>
    <div id="map" class="map mapBike"></div>
    <footer class=
    "d-md-none py-3
    d-flex bg-primary position-absolute bottom-0 w-100"
    style="z-index:1000;">
    <div class="w-50 text-center">
      <a href="#" @click.prevent="swichBikeStation = false"
      :class="{'text-white' : !swichBikeStation}"
      class="footerBar-link text-decoration-none"><i class="fas fa-biking me-3"></i>租 車</a>
    </div>
    <div class="w-50 text-center">
      <a href="#" @click.prevent="swichBikeStation = true"
      :class="{'text-white' : swichBikeStation}"
      class="footerBar-link text-decoration-none"><i class="fas fa-parking me-3"></i>還 車</a>
    </div>
    </footer>
  </div>
</template>

<script>
import L from 'leaflet';
import 'leaflet.markercluster/dist/leaflet.markercluster';
import {
  getNearStation,
  getNearbygetBikeRentInfo,
  getCityPositionStation,
} from '@/assets/javascript/GetAPI';
import place from '@/assets/json/place.json';

export default {
  data() {
    return {
      map: {},
      markers: new L.MarkerClusterGroup(),
      myLayer: null,
      mapCenter: {},
      local: {},
      data: [],
      stationData: [],
      latitude: NaN,
      longitude: NaN,
      swichBikeStation: false,
      place,
      category: '',
      stationName: '',
      cityStations: [],
      isFly: 0,
      countHandler: null,
      count: 0,
    };
  },
  methods: {
    getNearStation,
    getNearbygetBikeRentInfo,
    getCityPositionStation,
    backToMylocal() {
      this.mapCenter = {};
      this.count = 0;
      this.map.flyTo([this.latitude, this.longitude]);
    },
    renderMap() { // 抓到自己座標後產生地圖
      this.map = L.map('map', {
        ...this.local,
        zoomControl: false,
        fadeAnimation: true,
        zoomAnimation: false,
      });
      const redIcon = new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        },
      ).addTo(this.map);
      L.marker(this.local.center, { icon: redIcon }).addTo(this.map);
      this.getNearStation(this.latitude, this.longitude)
        .then(([res1, res2]) => {
          res1.data.forEach((resData1) => {
            res2.data.forEach((resData2) => {
              if (resData1.StationUID === resData2.StationUID) {
                const data = {
                  ...resData1,
                  ...resData2,
                };
                this.data.push(data);
              }
            });
          });
          this.stationData = [...this.data];
        })
        .catch((err) => {
          console.log(err);
        });
      this.map.on('movestart', () => {
        this.localIconShowHiden = 1;
      });
      this.map.on('moveend ', () => {
        this.localIconShowHiden = 0;
        this.mapCenter = { ...this.map.getCenter() };
      });
    },
    showRentMarker() { // 渲染可租用車位
      this.removeMarker();
      this.stationData.forEach((item) => {
        const stationBike = L.divIcon({ // 預設icon黃色顯示為可租、黑色可還
          html: `<div class="Rentstation map-marker">${item.AvailableRentBikes}</div>`,
          className: 'opactiy',
        });
        this.markers.addLayer(
          L.marker([item.StationPosition.PositionLat, item.StationPosition.PositionLon],
            { icon: stationBike })
            .bindPopup(
              `<div class="card">
                <div class="card-header">
                  <h5 class="card-title mb-0">${item.StationName.Zh_tw} ${item.StationAddress.Zh_tw}</h5>
                </div>
                <div class="card-body">
                  <p class="card-text my-0 fs-5">${this.changServiceStatusInfo(item.ServiceStatus)}</p>
                  <p class="card-text my-0 fs-5">可借車輛:${item.AvailableRentBikes}</p>
                  <p class="card-text my-0 fs-5">可停空位:${item.AvailableReturnBikes}</p>
                </div>
              </div>`,
            ),
        );
      });
      this.map.addLayer(this.markers);
    },
    showReturnMarker() { // 渲染可還車位
      this.removeMarker(); // 清除icon
      this.stationData.forEach((item) => {
        const stationBike = L.divIcon({ // 預設icon黃色顯示為可租、黑色可還
          html: `<div class="Returnstation map-marker">${item.AvailableReturnBikes}</div>`,
          className: 'opactiy',
        });
        this.markers.addLayer(
          L.marker([item.StationPosition.PositionLat, item.StationPosition.PositionLon],
            { icon: stationBike })
            .bindPopup(
              `<div class="card">
                <div class="card-header">
                  <h5 class="card-title mb-0">${item.StationName.Zh_tw} ${item.StationAddress.Zh_tw}</h5>
                </div>
                <div class="card-body">
                  <p class="card-text my-0 fs-5">${this.changServiceStatusInfo(item.ServiceStatus)}</p>
                  <p class="card-text my-0 fs-5">可借車輛:${item.AvailableRentBikes}</p>
                  <p class="card-text my-0 fs-5">可停空位:${item.AvailableReturnBikes}</p>
                </div>
              </div>`,
            ),
        );
      });
      this.map.addLayer(this.markers);
    },
    removeMarker() { // 刪除全部marker
      this.markers.eachLayer((layer) => {
        this.markers.removeLayer(layer);
      });
    },
    getLocation() { // 抓取自己位置
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition); // 有拿到位置就呼叫 showPosition 函式
      }
    },
    showPosition(position) {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.local = {
        center: [position.coords.latitude, position.coords.longitude],
        zoom: 16,
      };
      this.renderMap();
    },
    changServiceStatusInfo(ServiceStatus) {
      let str;
      if (ServiceStatus === 0) {
        str = '停止營運';
      } else if (ServiceStatus === 1) {
        str = '正常營運';
      } else {
        str = '暫停營運';
      }
      return str;
    },
    getCitysStations() { // 抓取縣市站點名稱和座標
      this.stationName = '';
      if (this.category) {
        this.getCityPositionStation(this.category)
          .then((res) => {
            this.cityStations = res.data;
          })
          .catch((err) => {
            console.log(err);
          });
      }
      this.cityStations = [];
    },
    searchStation() { // 移動到站點
      this.count = 0;
      const position = this.cityStations
        .find((item) => item.StationName.Zh_tw === this.stationName).StationPosition;
      this.map.flyTo([position.PositionLat, position.PositionLon]);
    },
    Updata() {
      if (this.mapCenter.lat) {
        this.getNearStation(this.mapCenter.lat, this.mapCenter.lng)
          .then(([res1, res2]) => {
            this.data = [];
            res1.data.forEach((resData1) => {
              res2.data.forEach((resData2) => {
                if (resData1.StationUID === resData2.StationUID) {
                  const data = {
                    ...resData1,
                    ...resData2,
                  };
                  this.data.push(data);
                }
              });
            });
            this.stationData = [...this.data];
          })
          .catch((err) => {
            console.log(err);
          });
        return;
      }
      this.getNearStation(this.latitude, this.longitude)
        .then(([res1, res2]) => {
          this.data = [];
          res1.data.forEach((resData1) => {
            res2.data.forEach((resData2) => {
              if (resData1.StationUID === resData2.StationUID) {
                const data = {
                  ...resData1,
                  ...resData2,
                };
                this.data.push(data);
              }
            });
          });
          this.stationData = [...this.data];
        })
        .catch((err) => {
          console.log(err);
        });
    },
    countTime() { // 3分鐘更新資料
      this.count = 0;
      clearInterval(this.countHandler);
      this.countHandler = setInterval(() => {
        this.count += 1;
        if (this.count === 180) {
          this.Updata();
          this.countTime();
        }
      }, 1000);
    },
  },
  computed: {
    localIconShowHiden: {
      get() {
        if (this.mapCenter.lat) {
          const lat = Math.abs(this.mapCenter.lat - this.latitude);
          const long = Math.abs(this.mapCenter.lng - this.longitude);
          if (lat > 0.002 || long > 0.002) {
            if (this.isFly) {
              return false;
            }
            return true;
          }
          return false;
        }
        return false;
      },
      set(val) {
        this.isFly = val;
      },
    },
  },
  watch: {
    swichBikeStation() {
      if (this.swichBikeStation) {
        this.showReturnMarker();
      } else {
        this.showRentMarker();
      }
    },
    stationData() {
      if (this.swichBikeStation) {
        this.showReturnMarker();
      } else {
        this.showRentMarker();
      }
    },
    async mapCenter() {
      if (this.mapCenter.lat) {
        await this.getNearStation(this.mapCenter.lat, this.mapCenter.lng)
          .then(([res1, res2]) => {
            this.data = [];
            res1.data.forEach((resData1) => {
              res2.data.forEach((resData2) => {
                if (resData1.StationUID === resData2.StationUID) {
                  const data = {
                    ...resData1,
                    ...resData2,
                  };
                  this.data.push(data);
                }
              });
            });
            this.stationData = [...this.data];
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
  mounted() {
    this.getLocation(); // 讀取自己位置(非同步)
    this.countTime();
  },
};
</script>
