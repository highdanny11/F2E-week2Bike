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
        <!-- 切換租車、還車量  -->
        <label class="switchBike d-none d-lg-block" for="switchbike">
          <div class="switchBike-text">
            <span class="d-flex align-items-center"
              ><i class="fas fa-biking me-3"></i>租 車</span
            >
            <span class="d-flex align-items-center"
              ><i class="fas fa-parking me-3"></i>還 車</span
            >
          </div>
          <input type="checkbox" id="switchbike" @click="switchRentReturn()" />
          <div class="switchBike-control text-primary">
            <span><i class="fas fa-biking me-3"></i>租 車</span>
            <span><i class="fas fa-parking me-3"></i>還 車</span>
          </div>
        </label>
        <!-- 切換顯示，車道 -->
        <label class="switchRoad" for="switchroad">
          <input type="checkbox" id="switchroad" @click="swicthBikeRoad()"/>
          <div class="switchRoad-text px-3">
            <span>顯示車道</span>
            <span>隱藏車道</span>
          </div>
        </label>
      </div>
    </div>
  </nav>
  <div class="position-relative">
    <!-- 尋找站點，暫時關閉 -->
    <div class="mt-3 w-25 d-none
    position-absolute start-50 top-10 translate-middle" style="z-index:1000;">
      <input
        type="text"
        class="form-control me-3"
        id="exampleFormControlInput1"
        placeholder="尋找站點"
      />
      <!-- search btn -->
      <a href="#" class="btn btn-dark"><i class="bi bi-search"></i></a>
    </div>
    <div id="map" class="map mapBike"></div>
    <!-- footer table開始出現 -->
    <footer class=
    "d-lg-none py-3
    d-flex bg-primary position-absolute bottom-0 w-100"
    style="z-index:1000;">
    <div class="w-50 text-center">
      <a href="#" @click.prevent="switchRentReturn()"
      class="footerBar-link text-decoration-none"><i class="fas fa-biking me-3"></i>租 車</a>
    </div>
    <div class="w-50 text-center">
      <a href="#" @click.prevent="switchRentReturn()"
      class="footerBar-link text-decoration-none"><i class="fas fa-parking me-3"></i>還 車</a>
    </div>
    </footer>
  </div>
</template>

<script>
import JsSHA from 'jssha';
import L from 'leaflet';
import Wkt from 'wicket';
import 'leaflet.markercluster/dist/leaflet.markercluster';

let map = {};
let myLayer = {};
const wkt = new Wkt.Wkt();
const markers = new L.MarkerClusterGroup();
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
      local: {},
      data: [],
      road: [],
      myLayers: [],
      latitude: NaN,
      longitude: NaN,
      areaKey: '',
      swichBikeStation: true,
      switchBikesRoad: true,
      currentCategory: {
        TXG: 'Taichung',
        KEE: 'Keelung',
        HSQ: 'HsinchuCounty',
        MIA: 'MiaoliCounty',
        CHA: 'ChanghuaCounty',
        NWT: 'NewTaipei',
        NAN: 'NantouCounty',
        YUN: 'YunlinCounty',
        CYQ: 'ChiayiCounty',
        CYI: 'Chiayi',
        PIF: 'PingtungCounty',
        ILA: 'YilanCounty',
        HUA: 'HualienCounty',
        TTT: 'TaitungCounty',
        KIN: 'KinmenCounty',
        PEN: 'PenghuCounty',
        TAO: 'Taoyuan',
        TPE: 'Taipei',
        KHH: 'Kaohsiung',
        TNN: 'Tainan',
      },
    };
  },
  methods: {
    getBikeRentPosition() { // 抓取bike station，必須兩種資料都傳進來否則會影響後面icon
      const url = `https://ptx.transportdata.tw/MOTC/v2/Bike/Station/NearBy?$top=30&$spatialFilter=nearby(${this.latitude},${this.longitude},800)`;
      this.$http.get(url, { headers: getAuthorizationeHader() })
        .then((res) => {
          const dataArry = res.data;
          dataArry.forEach((item) => {
            const data = {
              BikesCapacity: item.BikesCapacity,
              StationAddress: item.StationAddress,
              StationPosition: item.StationPosition,
              StationID: item.StationID,
              AuthorityID: item.AuthorityID,
            };
            this.data.push(data);
          });
          this.getBikeRentInfo();
        });
    },
    getBikeRentInfo() {
      const url = `https://ptx.transportdata.tw/MOTC/v2/Bike/Availability/NearBy?$top=30&$spatialFilter=nearby(${this.latitude},${this.longitude},800)`;
      this.$http.get(url, { headers: getAuthorizationeHader() })
        .then((res) => {
          const dataArry = res.data;
          dataArry.forEach((item) => {
            const indexData = this.data.find((el) => el.StationID === item.StationID);
            if (indexData) {
              indexData.StationUID = item.StationUID;
              indexData.AvailableRentBikes = item.AvailableRentBikes;
              indexData.AvailableReturnBikes = item.AvailableReturnBikes;
              indexData.ServiceStatus = item.ServiceStatus;
            }
          });
          this.areaKey = this.currentCategory[this.data[0].AuthorityID];
          this.renderMarker(); // 渲染站點
          this.getBikeRoad(); // 渲染腳踏車道
        });
    },
    getBikeRoad() { // 依據所在地縣市腳踏車路線
      const url = `https://ptx.transportdata.tw/MOTC/v2/Cycling/Shape/${this.areaKey}?$format=JSON`;
      this.$http.get(url, { headers: getAuthorizationeHader() })
        .then((res) => {
          this.road = res.data;
          this.road.forEach((item) => {
            item.Geometry = wkt.read(item.Geometry).toJson();
          });
          this.showBikeRoad(); // 顯示所在地所有較踏車路徑
        });
    },
    changeMapCenter(latitude, longitude) {
      map.panTo([latitude, longitude]);
      map.setZoom(16);
    },
    renderMap() { // 抓到自己座標後產生地圖
      map = L.map('map', { ...this.local });
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
      ).addTo(map);
      L.marker(this.local.center, { ...redIcon }).addTo(map);
      this.getBikeRentPosition(); // 抓取站點資料
    },
    renderMarker() { // 加入座標，放入座標群組(預設顯示可租車位的座標)
      this.data.forEach((item) => {
        const stationBike = L.divIcon({ // 預設icon黃色顯示為可租、黑色可還
          html: `<div class="Rentstation map-marker">
          ${item.AvailableRentBikes}</div>`,
          className: 'opactiy',
        });
        markers.addLayer(
          L.marker([item.StationPosition.PositionLat, item.StationPosition.PositionLon],
            { icon: stationBike }),
        );
      });
      map.addLayer(markers);
    },
    showRentMarker() { // 渲染可租用車位
      this.removeMarker();
      this.data.forEach((item) => {
        const stationBike = L.divIcon({ // 預設icon黃色顯示為可租、黑色可還
          html: `<div class="Rentstation map-marker">${item.AvailableRentBikes}</div>`,
          className: 'opactiy',
        });
        markers.addLayer(
          L.marker([item.StationPosition.PositionLat, item.StationPosition.PositionLon],
            { icon: stationBike }),
        );
      });
      map.addLayer(markers);
    },
    showReturnMarker() { // 渲染可還車位
      this.removeMarker(); // 清除icon
      this.data.forEach((item) => {
        const stationBike = L.divIcon({ // 預設icon黃色顯示為可租、黑色可還
          html: `<div class="Returnstation map-marker">${item.AvailableReturnBikes}</div>`,
          className: 'opactiy',
        });
        markers.addLayer(
          L.marker([item.StationPosition.PositionLat, item.StationPosition.PositionLon],
            { icon: stationBike }),
        );
      });
      map.addLayer(markers);
    },
    switchRentReturn() { // 切換租車和可還車位
      this.swichBikeStation = !this.swichBikeStation;
      if (this.swichBikeStation) {
        this.showRentMarker();
      } else {
        this.showReturnMarker();
      }
    },
    showBikeRoad() {
      const style = {
        color: 'red',
        weight: 3,
        opacity: 0.5,
      };
      this.road.forEach((obj) => {
        myLayer = L.geoJSON(obj.Geometry, {
          style,
        }).addTo(map);
        myLayer.addData(obj.Geometry);
        this.myLayers.push(myLayer);
        map.fitBounds(myLayer.getBounds());
        this.changeMapCenter(this.latitude, this.longitude);
      });
    },
    removeMarker() { // 刪除全部marker
      // console.log找markers 原生方法
      markers.eachLayer((layer) => {
        markers.removeLayer(layer);
      });
    },
    swicthBikeRoad() {
      this.switchBikesRoad = !this.switchBikesRoad;
      if (this.switchBikesRoad) {
        this.showBikeRoad();
      } else {
        this.removeBikeRoad();
      }
    },
    removeBikeRoad() { // 刪除腳踏車全部路線
      this.myLayers.forEach((item) => {
        map.removeLayer(item);
      });
      this.myLayers = [];
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
  },
  mounted() {
    this.getLocation(); // 讀取自己位置(非同步)
  },
};
</script>
