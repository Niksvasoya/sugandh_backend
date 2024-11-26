const blogRoutes = {
  // creating routes for Blog
  "GET /blog/get": "BlogApi.get",
  "POST /blog/save": "BlogApi.save",
  "POST /blog/delete": "BlogApi.destroy",
};

module.exports = blogRoutes;
