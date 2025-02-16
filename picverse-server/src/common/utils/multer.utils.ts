export const multerToBlobUrl = (file: Express.Multer.File): string => {
  const blob = new Blob([file.buffer], { type: file.mimetype });
  return URL.createObjectURL(blob);
};
