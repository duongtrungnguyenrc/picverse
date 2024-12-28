import toast from "react-hot-toast";

export const getAxiosErrorMessage = (error: AxiosError): string => {
  const messages: string | Array<string> = error.response?.data.message || "Unknow error";

  return Array.isArray(messages) ? messages.reduce((prev, message) => `${prev}, \n ${message}`, "") : messages;
};

export const isErrorField = (error: AxiosError, fieldName: string) => {
  const message = getAxiosErrorMessage(error);

  return message.includes(fieldName);
};

export const showAxiosToastError = (error: AxiosError) => {
  toast.error(getAxiosErrorMessage(error));
};
