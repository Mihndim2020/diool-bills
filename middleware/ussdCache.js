const Cache = require("node-cache");
const ussdCache = new Cache({ stdTTL: 60, deleteOnExpire: true, checkperiod: 30 });

const ussdCacheMiddleware = (req, res, next) => {
  try {
    if (ussdCache.has("crypto-list")) {
      return res.send(ussdCache.get("crypto-list")).status(200);
    }
    return next();
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = {
  ussdCacheMiddleware,
  ussdCache,
};