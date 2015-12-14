module.exports = function factory(models) {
  return function init(req, res) {
    res.json(models);
  };
};
