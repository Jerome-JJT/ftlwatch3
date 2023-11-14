/**
 * Describe your component here
 */
export const AxiosErrorText = (axiosError: any): string => {
  return axiosError?.response?.data?.detail ||
    axiosError?.response?.statusText ||
    axiosError?.message;
};
