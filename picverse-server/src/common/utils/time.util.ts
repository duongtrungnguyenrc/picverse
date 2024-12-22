export const getExpiredTime = (time: number): Date => {
  return new Date(Date.now() + time * 1000);
};
