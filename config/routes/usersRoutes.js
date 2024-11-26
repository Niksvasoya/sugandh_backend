const usersRoutes = {
  // creating routes for user_role
  "GET /user-role/get": "UserRoleApi.get",
  "POST /user-role/save": "UserRoleApi.save",
  "POST /user-role/delete": "UserRoleApi.destroy",

  // creating routes for user account status
  "GET /user-account-status/get": "UserAccountStatusApi.get",
  "POST /user-account-status/save": "UserAccountStatusApi.save",
  "POST /user-account-status/delete": "UserAccountStatusApi.destroy",

  // // creating routes for user
  "GET /user/get": "UserApi.get",
  "POST /user/save": "UserApi.signup",
  "POST /user/login": "UserApi.login",
  "POST /user/login/validate": "UserApi.loginIsAvailable",
  "POST /user/delete": "UserApi.destroy",
  "GET /user/sms/send/otp": "UserApi.sendSmsOtp",
  "GET /user/sms/verify/otp": "UserApi.verifySmsOtp",
  "GET /user/email/send/otp": "UserApi.sendEmailOtp",
  "GET /user/email/verify/otp": "UserApi.verifyEmailOtp",
  "POST /user/password/reset": "UserApi.resetPassword",
  "POST /user/password/forgot": "UserApi.sendEmail",
  "POST /user/password/resetV2": "UserApi.resetPasswordV2",

  "GET /user/employee/get": "UserApi.getNotAssignUser",

  // // creating routes for user
  "GET /user/location-detail/get": "UserLocationDetailsApi.get",
  "POST /user/location-detail/save": "UserLocationDetailsApi.save",
  "POST /user/location-detail/delete": "UserLocationDetailsApi.destroy",
};

module.exports = usersRoutes;
