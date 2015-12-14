module.exports = function factory(models) {
  return function getTrackers(req, res) {
    res.json(models);
  };
};
