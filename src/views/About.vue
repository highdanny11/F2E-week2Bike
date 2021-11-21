<template>
  <div class="position-relative">
  <div class="position-absolute bg-dark w-50 h-50" style="z-index:1000;"></div>
  <div id="map" class="map" style="height:500px;"></div>
  </div>
</template>

<script>
import L from 'leaflet';
import 'leaflet.markercluster/dist/leaflet.markercluster';

let map = {};
export default {
  mounted() {
    map = L.map('map', {
      center: [22.604964, 120.300476],
      zoom: 16,
    });
    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
    ).addTo(map);
  },
};
</script>
