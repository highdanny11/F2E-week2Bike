<template>
  <nav class="bg-primary navHeader py-6">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center">
        <!-- a 連結到首頁 -->
        <router-link to="/CategoryRoad"
          ><img
            class="navHeader-logo d-none d-lg-block"
            :src="require('@/assets/img/logo.png')"
            alt=""
          />
          <i class="bi bi-chevron-left d-block d-lg-none text-dark"></i>
        </router-link>
        <p class="mb-0">{{name}}</p>
        <div class="invisible d-lg-none"></div>
      </div>
    </div>
  </nav>
  <div id="mapid" class="map mapBike"></div>
</template>

<script>
import JsSHA from 'jssha';
import L from 'leaflet';
import Wkt from 'wicket';

let map = {};
let myLayer = {};
const wkt = new Wkt.Wkt();
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
      keys: [],
      name: '',
      data: [],
      latitude: NaN,
      longitude: NaN,
    };
  },
  methods: {
    getdata() {
      const url = `https://ptx.transportdata.tw/MOTC/v2/Cycling/Shape/${this.keys[0]}?$filter=contains(RouteName,'${this.keys[1]}')&$top=30&$format=JSON`;
      this.$http.get(url, { headers: getAuthorizationeHader() })
        .then((res) => {
          this.data = res.data;
          this.data[0].Geometry = wkt.read(this.data[0].Geometry).toJson();
          this.latitude = this.data[0].Geometry.coordinates[0][0][1];
          this.longitude = this.data[0].Geometry.coordinates[0][0][0];
          this.name = this.data[0].RouteName;
          this.renderMap();
        });
    },
    renderMap() {
      const local = {
        center: [this.latitude, this.longitude],
        zoom: 16,
      };
      map = L.map('mapid', { ...local });
      L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        },
      ).addTo(map);
      this.showBikeRoad();
    },
    showBikeRoad() {
      const style = {
        color: 'black',
        weight: 3,
        opacity: 0.5,
      };
      myLayer = L.geoJSON(this.data[0].Geometry, {
        style,
      }).addTo(map);
      myLayer.addData(this.data[0].Geometry);
      map.fitBounds(myLayer.getBounds());
    },
  },
  mounted() {
    this.keys = this.$route.params.id.split(',');
    this.getdata();
  },
};
</script>
