module.exports = {
  port: 9000,
  log: {
    level: 'silly',
    disabled: true,
  },
  cors: {
    origins: ['http://localhost:3000'],
    maxAge: 3 * 60 * 60,
  },
  azure: {
    imageContainer: "testimages",
  }
};