export enum QueryKeys {
  AUTHORIZE_CLIENT = "get-account",
  CLIENT_SECRET = "get-client-secret",
  RESOURCES = "get-resources",
  EXTERNAL_LINK_STATUS = "get-external-link-status",
  PROFILE = "get-profile",
}

export enum MutationKeys {
  SIGN_UP = "sign-up",
  SIGN_IN = "sign-in",
  GOOGLE_SIGN_IN = "google-sign-in",
  SIGN_OUT = "sign-out",
  UPLOAD_FILE = "upload-file",
  CREATE_FOLDER = "create-folder",
  UPDATE_RESOURCE = "update-resource",
  DELETE_FILE = "delete-file",
  DELETE_FOLDER = "delete-folder",
  LINK_EXTERNAL_STORAGE = "link-external-storage",
}
