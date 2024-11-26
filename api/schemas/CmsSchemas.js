const LogoSchemas = {
  validator: {
    name: "required|string|minLength:2|maxLength:50|isUnique:Cms/Logo,name",
    url: "string",
  },
  niceNames: {
    name: "Name",
  },
};
const HomeSliderSchemas = {
  validator: {
    title:
      "required|string|minLength:2|maxLength:50|isUnique:Cms/HomeSlider,title",
    image: "array",
  },
  niceNames: {
    name: "Name",
  },
};

const HomeSliderSchemasDesktop = {
  validator: {
    title:
      "required|string|minLength:2|maxLength:50|isUnique:Cms/HomeSliderDesktop,title",
    image: "string",
    collection_id: "integer|isExists:Product/Collection",
  },
  niceNames: {
    name: "Name",
    collection_id: "Collection",
  },
};

const HomeSliderSchemasMobile = {
  validator: {
    title:
      "required|string|minLength:2|maxLength:50|isUnique:Cms/HomeSliderMobile,title",
    image: "string",

    collection_id: "integer|isExists:Product/Collection",
  },
  niceNames: {
    name: "Name",
    collection_id: "Collection",
  },
};

const HomeSectionThree = {
  validator: {
    // name: "required|minLength:2|maxLength:100|isUnique:Accounting/PaymentStatus,name|alphaspace",
    name: "required|string|minLength:2|maxLength:50|isUnique:Cms/HomeSectionThree,name",
    description: `string|maxLength:255`,
    image: "string",
    // product_id: "integer|required|isExists:Product/Product",
    product_id: "integer|isExists:Product/Product",
  },
  niceNames: {
    name: "Name",
    product_id: "Product",
  },
};

const HomeCultureSection = {

  validator: {
    name: "required|string|minLength:2|maxLength:50|isUnique:Cms/HomeCultureSection,name",
    description: `string|maxLength:255`,
    image: "string",
    product_id: "integer|isExists:Product/Product",
    collection_id: "integer|isExists:Product/Collection",
  },
  niceNames: {
    name: "Name",
    product_id: "Product",
    collection_id: "Collection",
  },
};

const HomeLookBookSection = {
  validator: {
    name: "required|string|minLength:2|maxLength:50|isUnique:Cms/HomeLookBookSection,name",
    // description: `string|maxLength:4000`,
    description: "string|maxLength:255",
    image: "string",
    collection_id: "integer|isExists:Product/Collection",
  },
  niceNames: {
    name: "Name",
    collection_id: "Collection",
  },
};

const HomeSectionFiveLeftSideSchemas = {
  validator: {
    image: "array",
    product_id: "integer|isExists:Product/Product",
  },
  niceNames: {
    product_id: "Product",
  },
};

const HomeSectionFiveRightSideSchemas = {
  validator: {
    image: "array",
    product_id: "integer|isExists:Product/Product",
  },
  niceNames: {
    product_id: "Product",
  },
};

const HomeSectionFiveCenterSchemas = {
  validator: {
    // image: "string",
    collection_id: "integer|isExists:Product/Collection",
  },
  niceNames: {
    collection_id: "Collection",
  },
};

const HomeCelebrityChoiceSchemas = {
  validator: {
    // image: "array",
    image: "required|string",
  },
};


module.exports = {
  LogoSchemas,
  HomeSliderSchemas,
  HomeSliderSchemasDesktop,
  HomeSliderSchemasMobile,
  HomeSectionThree,
  HomeLookBookSection,
  HomeCultureSection,
  HomeCelebrityChoiceSchemas,
  HomeSectionFiveLeftSideSchemas,
  HomeSectionFiveRightSideSchemas,
  HomeSectionFiveCenterSchemas,
};
