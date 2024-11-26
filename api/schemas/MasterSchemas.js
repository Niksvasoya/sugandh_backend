const CountrySchemas = {
  validator: {
    name: "required|string",
  },
  niceNames: {
    name: "Name",
  },
};

const CitySchemas = {
  validator: {
    name: "required|string",
    country_id: "required|integer",
    province_id: "required|integer",
  },
  niceNames: {
    name: "Name",
    country_id: "Country",
    province_id: "Province",
  },
};

const ProvinceSchemas = {
  validator: {
    name: "required|string",
    country_id: "required|integer",
  },
  niceNames: {
    name: "Name",
    country_id: "Country",
    province_id: "Province",
  },
};

const TimezoneSchemas = {
  validator: {
    zoneName: "required|string",
    // 'description': 'required|string'
  },
  niceNames: {
    zoneName: "TimeZone Name",
  },
};

const WeekDaySchemas = {
  validator: {
    name: "required|string|alphaspace|minLength:2|maxLength:10|isUnique:Master/WeekDay,name",
    description: "string|maxLength:255",
  },
  niceNames: {
    name: "Name",
  },
};
const LanguageSchemas = {
  validator: {
    name: "required|alphaspace|minLength:2|maxLength:50|isUnique:Master/Language,name",
    description: "string|maxLength:255",
  },
  niceNames: {
    name: "Name",
  },
};

const ZipCodeSchemas = {
  validator: {
    name: "required|minLength:2|maxLength:50|isUnique:Master/ZipCode,name",
    city_id: "required|integer|isExists:Master/City",
    country_id: "required|integer|isExists:Master/Country",
    province_id: "required|integer|isExists:Master/Province",
  },
  niceNames: {
    name: "ZipCode",
    city_id: "city",
  },
};

module.exports = {
  CitySchemas,
  CountrySchemas,
  ProvinceSchemas,
  TimezoneSchemas,
  WeekDaySchemas,
  ZipCodeSchemas,
  LanguageSchemas,
};
