function indexController(req, res) {
  res.render("index", { title: "welcome to members only message board" });
}

module.exports = indexController;
