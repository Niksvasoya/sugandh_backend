const BlogSchemas = {
  validator: {
    name: "required|minLength:2|maxLength:100|isUnique:Blog/Blog,name|alphaspace",
    description: `string|maxLength:4000`,
    image: "array",
    thumbnail_image: "string",
  },
  niceNames: {
    name: `Name`,
  },
};

module.exports = {
  BlogSchemas,
};
