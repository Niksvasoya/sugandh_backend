const masterRoutes = {
  // creating routes for country
  "GET /country/get": "CountryApi.get",
  "POST /country/save": "CountryApi.save",
  "POST /country/delete": "CountryApi.destroy",
  "GET /country": "CountryApi.data",

  // creating routes for province
  "GET /province/get": "ProvinceApi.get",
  "POST /province/save": "ProvinceApi.save",
  "POST /province/delete": "ProvinceApi.destroy",

  // creating routes for city
  "GET /city/get": "CityApi.get",
  "POST /city/save": "CityApi.save",
  "POST /city/delete": "CityApi.destroy",

  // creating routes for zipcode
  "GET /zipcode/get": "ZipCodeApi.get",
  "POST /zipcode/save": "ZipCodeApi.save",
  "POST /zipcode/delete": "ZipCodeApi.destroy",
  "GET /zipcode/data/get": "ZipCodeApi.getZipCodeData",

  // creating routes for timezone
  "GET /timezone/get": "TimezoneApi.get",
  "POST /timezone/save": "TimezoneApi.save",
  "POST /timezone/delete": "TimezoneApi.destroy",

  // creating routes for weekday
  "GET /week-day/get": "WeekDayApi.get",
  "POST /week-day/save": "WeekDayApi.save",
  "POST /week-day/delete": "WeekDayApi.destroy",

  // creating routes for Language
  "GET /language/get": "LanguageApi.get",
  "POST /language/save": "LanguageApi.save",
  "POST /language/delete": "LanguageApi.destroy",

  "POST /import/data": "ImportApi.convertID",
  // "POST /import/variants/data": "ImportApi.importVariants",

  // "POST /import/data": "ProductImportBulkApi.importData",
};

module.exports = masterRoutes;

