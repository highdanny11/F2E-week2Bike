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
        <p class="mb-0">{{name}}</p>
        <div class="invisible d-lg-none"></div>
      </div>
    </div>
  </nav>
  <div id="map" class="map mapBike"></div>
</template>

<script>
import L from 'leaflet';

let map = {};
export default {
  data() {
    return {
      name: '',
      PositionLat: '',
      PositionLon: '',
    };
  },
  methods: {
    renderMap() { // 抓到自己座標後產生地圖
      const local = {
        center: [this.PositionLat, this.PositionLon],
        zoom: 16,
      };
      map = L.map('map', { ...local });
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
      L.marker([...local.center], { icon: redIcon }).addTo(map);
    },
    go() {
      // 操作歷史紀錄
      // 回上一頁，-1，下一頁1，依此類推
      this.$router.go(-1);
    },
  },
  mounted() {
    const data = this.$route.params.id.split(',');
    console.log(data);
    this.PositionLat = Number(data[0]);
    this.PositionLon = Number(data[1]);
    this.name = data[2];
    this.renderMap();
  },
};
</script>
