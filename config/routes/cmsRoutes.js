const cmsRoutes = {
  // creating routes for video logo
  "GET /logo/get": "LogoApi.get",
  "POST /logo/save": "LogoApi.save",
  "POST /logo/delete": "LogoApi.destroy",

  "POST /firebase/image/save": "ImageApi.save",
  "POST /firebase/image/delete": "ImageApi.destroy",

  // 'POST /assets/save': 'LogoApi.saveAssets',

  // creating routes for home page slider
  "GET /home-slider/get": "HomeSliderApi.get",
  "POST /home-slider/save": "HomeSliderApi.save",
  "POST /home-slider/delete": "HomeSliderApi.destroy",

  // creating routes for home page slider desktop
  "GET /home-slider-desktop/get": "HomeSliderDesktopApi.get",
  "POST /home-slider-desktop/save": "HomeSliderDesktopApi.save",
  "POST /home-slider-desktop/delete": "HomeSliderDesktopApi.destroy",

  // creating routes for home page slider mobile
  "GET /home-slider-mobile/get": "HomeSliderMobileApi.get",
  "POST /home-slider-mobile/save": "HomeSliderMobileApi.save",
  "POST /home-slider-mobile/delete": "HomeSliderMobileApi.destroy",

  // creating routes for section 3 DB - cms_section_three_product
  "GET /home-section-three/get": "HomeSectionThreeApi.get",
  "POST /home-section-three/save": "HomeSectionThreeApi.save",
  "POST /home-section-three/delete": "HomeSectionThreeApi.destroy",

  // creating routes for Look Book DB - cms_look_book_product
  "GET /home-look-book-section/get": "HomeLookBookSectionApi.get",
  "POST /home-look-book-section/save": "HomeLookBookSectionApi.save",
  "POST /home-look-book-section/delete": "HomeLookBookSectionApi.destroy",

  // creating routes for Look Book DB - cms_look_book_product
  "GET /home-culture-section/get": "HomeCultureSectionApi.get",
  "POST /home-culture-section/save": "HomeCultureSectionApi.save",
  "POST /home-culture-section/delete": "HomeCultureSectionApi.destroy",

  // creating routes for Section Five right side image in Home Page
  "GET /home-section-five-right/get": "HomeSectionFiveRightSideApi.get",
  "POST /home-section-five-right/save": "HomeSectionFiveRightSideApi.save",
  "POST /home-section-five-right/delete": "HomeSectionFiveRightSideApi.destroy",

  // creating routes for Section Five left side image in Home Page
  "GET /home-section-five-left/get": "HomeSectionFiveLeftSideApi.get",
  "POST /home-section-five-left/save": "HomeSectionFiveLeftSideApi.save",
  "POST /home-section-five-left/delete": "HomeSectionFiveLeftSideApi.destroy",

  // creating routes for Section Five left side image in Home Page
  "GET /home-section-five-center/get": "HomeSectionFiveCenterApi.get",
  "POST /home-section-five-center/save": "HomeSectionFiveCenterApi.save",
  "POST /home-section-five-center/delete": "HomeSectionFiveCenterApi.destroy",

  // creating routes for Section Home Celebrity Choice
  "GET /home-celebrity-choice/get": "HomeCelebrityChoiceApi.get",
  "POST /home-celebrity-choice/save": "HomeCelebrityChoiceApi.save",
  "POST /home-celebrity-choice/delete": "HomeCelebrityChoiceApi.destroy",
};

module.exports = cmsRoutes;

