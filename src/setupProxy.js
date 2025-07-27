const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://51249a54ab10.ngrok-free.app/',
      changeOrigin: true,
      credentials: true
    })
  );
};
