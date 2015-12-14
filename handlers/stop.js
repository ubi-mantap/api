module.exports = function factory(models) {
  return function stop(req, res) {
    res.json(models);
  };
};
