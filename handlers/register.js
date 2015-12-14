module.exports = function factory(models) {
  return function register(req, res) {
    res.json(models);
  };
};
