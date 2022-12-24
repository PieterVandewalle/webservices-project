module.exports = {
  port: '9000',
  log: {
    level: 'info',
    disabled: false,
  },
  cors: {
    origins: ['https://frontendweb-tweedehandstech.onrender.com'],
    maxAge: 3 * 60 * 60,
  },
  azure: {
    imageContainer: "productionimages",
  }
};
