module.exports = function factory(models) {
  return function start(req, res) {
    res.json(models);
  };
};
