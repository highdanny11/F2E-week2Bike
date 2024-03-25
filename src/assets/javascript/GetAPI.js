import axios from 'axios';
import qs from 'qs';

export const getToken = async () => {
  const url = 'https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token';
  const parameter = {
    grant_type: 'client_credentials',
    client_id: process.env.VUE_APP_TRX_ID,
    client_secret: process.env.VUE_APP_TRX_KEY,
  };
  const res = await axios({
    method: 'post',
    url,
    data: qs.stringify(parameter),
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  });
  localStorage.setItem('token', res.data.access_token);
};

export const getNearbygetBikeRentInfo = (lat, long) => {
  const url = `https://tdx.transportdata.tw/api/advanced/v2/Bike/Availability/NearBy?$top=30&$spatialFilter=nearby(${lat},${long},800)`;
  return axios.get(url, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
};
export const getCityPositionStation = (category) => {
  const url = `https://tdx.transportdata.tw/api/basic/v2/Bike/Station/City/${category}?%24select=StationName,StationPosition&$format=JSON`;
  return axios.get(url, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
};
export const getNearStation = ((latitude, longitude) => {
  const getNearbyPositionStation = (lat, long) => {
    const url = 'https://tdx.transportdata.tw/api/advanced/v2/Bike/Station/NearBy';
    return axios.get(url,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        params: {
          $top: 30,
          $spatialFilter: `nearby(${lat},${long},800)`,
        },
      });
  };
  return Promise.all([
    getNearbyPositionStation(latitude, longitude),
    getNearbygetBikeRentInfo(latitude, longitude),
  ]);
});
