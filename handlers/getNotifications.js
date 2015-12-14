module.exports = function factory(models) {
  return function getNotifications(req, res) {
    res.json(models);
  };
};
