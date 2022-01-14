module.exports = {
  publicPath: './',
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      const [obj] = args;
      obj.title = '微笑Ubike網';
      obj.meta = {
        keywords: '台灣Ubike網',
        description: '快速搜索附近站點、美食、景點，聰明旅遊輕鬆樂活。'
      };
      obj.icon = 'bikeIcon.png';
      return args;
    });
  }
}