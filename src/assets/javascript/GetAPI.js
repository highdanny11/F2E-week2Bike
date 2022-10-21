import axios from 'axios';
import getAuthorizationeHader from '@/assets/javascript/AuthorizationHeader';

export const getNearbygetBikeRentInfo = (lat, long) => {
  const url = `https://ptx.transportdata.tw/MOTC/v2/Bike/Availability/NearBy?$top=30&$spatialFilter=nearby(${lat},${long},800)`;
  return axios.get(url, { headers: getAuthorizationeHader() });
};
export const getCityPositionStation = (category) => {
  // const url = `https://ptx.transportdata.tw/MOTC/v2/Bike/Station/${category}?%24select=StationName,StationPosition&$format=JSON`;
  const url = `https://tdx.transportdata.tw/api/basic/v2/Bike/Station/City/${category}?%24select=StationName,StationPosition&$format=JSON`;
  return axios.get(url, { headers: getAuthorizationeHader() });
};
export const getNearStation = ((latitude, longitude) => {
  const getNearbyPositionStation = (lat, long) => {
    const url = `https://ptx.transportdata.tw/MOTC/v2/Bike/Station/NearBy?$top=30&$spatialFilter=nearby(${lat},${long},800)`;
    return axios.get(url, { headers: getAuthorizationeHader() });
  };
  return Promise.all([
    getNearbyPositionStation(latitude, longitude),
    getNearbygetBikeRentInfo(latitude, longitude),
  ]);
});
