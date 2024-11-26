//const Regex = require('regex');
const reOnlyAlpha = /^[A-Za-z ]+$/;
const reOnlyInteger = /^\d+$/;
const reAlphaNumeric = /^[A-Za-z0-9- ]+$/;
const reAlphaNumeriSpace = /^[a-zA-Z][A-Za-z0-9- ]*$/; // Alphabet, space, - and numbers
const reVariant = /^[a-zA-Z0-9][A-Za-z0-9-. ]*$/; // Alphabet, space, - and numbers
const reColorCode = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
const reName = /^[A-Za-z \']*$/; //Alphabet, space & single Quote
const reAddress = /^[a-zA-Z][A-Za-z0-9- \',\/\\]*$/;
const reUserName = /^[A-Za-z]+$/; // Only alphabets
const reADHS = /^[A-Za-z0-9][A-Za-z0-9 \-]*$/; // Only alphabets, digits, hyphen(-) and space allow
const reADS = /^[A-Za-z0-9][A-Za-z0-9 \-]*$/; // Only alphabets, digits and space allow
const reNotNumber = /^(?!^\d+$)^.+$/;
const reOnlyIntegerHyphen = /[\d/-]+$/;
const reOnlyIntegerSpace = /[\d ]+$/;
const reEmail =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
module.exports = {
  reOnlyAlpha,
  reOnlyInteger,
  reAlphaNumeric,
  reAlphaNumeriSpace,
  reColorCode,
  reName,
  reAddress,
  reUserName,
  reVariant,
  reADHS,
  reNotNumber,
  reOnlyIntegerHyphen,
  reADS,
  reEmail,
  reOnlyIntegerSpace,
};
