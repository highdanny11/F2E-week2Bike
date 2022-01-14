<template>
  <div id="mapid" class="map mapBike"></div>
</template>

<script>
import L from 'leaflet';
import { antPath } from 'leaflet-ant-path';

export default {
  props: ['roadData'],
  data() {
    return {
      map: {},
      myLayer: {},
      markerStartEnd: [],
      markersGroup: L.layerGroup(),
      data: {},
      latitude: NaN,
      longitude: NaN,
    };
  },
  methods: {
    renderMap() {
      const position = [...this.data.Geometry.coordinates[0][0]];
      this.latitude = position[0];
      this.longitude = position[1];
      const local = {
        center: [this.latitude, this.longitude],
        zoom: 16,
      };
      this.map = L.map('mapid', { ...local });
      L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        },
      ).addTo(this.map);
      this.showBikeRoad();
    },
    showBikeRoad() {
      const options = {
        paused: false,
        reverse: false,
        delay: 2000,
        dashArray: [20, 20],
        weight: 6,
        opacity: 1,
        color: 'transparent',
        pulseColor: '#000',
      };
      const arry = JSON.parse(JSON.stringify(this.data.Geometry.coordinates[0]));
      const reverseLatings = arry.map((item) => item.reverse());
      this.myLayer = antPath(reverseLatings, options);
      this.myLayer.addTo(this.map);
      this.map.fitBounds(this.myLayer.getBounds());
      this.markerStartEnd = [
        {
          name: this.data.RoadSectionStart,
          PositionLat: reverseLatings[0][0],
          PositionLon: reverseLatings[0][1],
        },
        {
          name: this.data.RoadSectionEnd,
          PositionLat: reverseLatings[reverseLatings.length - 1][0],
          PositionLon: reverseLatings[reverseLatings.length - 1][1],
        },
      ];
      if (this.markerStartEnd[0].name) {
        this.showMarks();
      }
    },
    showMarks() {
      this.markerStartEnd.forEach((item, i) => {
        const stationBike = L.divIcon({ // 預設icon黃色顯示為可租、黑色可還
          html: `<div class="Rentstation map-marker" style="font-size:14px;">${i === 0 ? '起點' : '終點'}</div>`,
          className: 'opactiy',
        });
        this.markersGroup.addLayer(
          L.marker([item.PositionLat, item.PositionLon], { icon: stationBike })
            .bindPopup(`<h5 class="mb-0">${item.name}</h5>`),
        );
      });
      this.map.addLayer(this.markersGroup);
    },
  },
  mounted() {
    this.data = { ...this.roadData };
    this.renderMap();
  },
};
</script>
