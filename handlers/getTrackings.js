module.exports = function factory(models) {
  return function getTrackings(req, res) {
    res.json(models);
  };
};
