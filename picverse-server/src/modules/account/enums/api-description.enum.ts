export enum AuthApiDescription {
  SIGN_IN_SUCCESS = "Successfully signed in.",
  SIGN_UP_SUCCESS = "Successfully signed up.",
  SIGN_OUT_SUCCESS = "Successfully signed out.",
  REFRESH_TOKEN_SUCCESS = "Successfully refreshed token.",
  FORGOT_PASSWORD_SUCCESS = "Successfully sent forgot password email. Return session id",
  RESET_PASSWORD_SUCCESS = "Successfully reset password. Return status",
  REQUEST_ACTIVATE_ACCOUNT_SUCCESS = "Successfully request activate account Return status",
  ACTIVATE_ACCOUNT_SUCCESS = "Successfully activate account Return status",
  LOCK_ACCOUNT_SUCCESS = "Successfully lock account. Return status",
  GET_ACCESS_RECORDS_SUCCESS = "Successfully lto get access records. Return pagination records",
}
