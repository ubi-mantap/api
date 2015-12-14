module.exports = function factory(models) {
  return function log(req, res) {
    res.json(models);
  };
};
