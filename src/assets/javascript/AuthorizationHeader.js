import JsSHA from 'jssha';
// 驗證API用
export default function getAuthorizationHeader() {
  const AppID = process.env.VUE_APP_TRX_ID;
  const AppKey = process.env.VUE_APP_TRX_KEY;
  const GMTString = new Date().toGMTString();
  const ShaObj = new JsSHA('SHA-1', 'TEXT');
  ShaObj.setHMACKey(AppKey, 'TEXT');
  ShaObj.update(`x-date: ${GMTString}`);
  const HMAC = ShaObj.getHMAC('B64');
  const Authorization = `hmac username="${AppID}", algorithm="hmac-sha1", headers="x-date", signature="${HMAC}"`;
  return { Authorization, 'X-Date': GMTString };
}
