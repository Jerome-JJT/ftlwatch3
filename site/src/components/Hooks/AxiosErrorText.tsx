
/**
 * Describe your component here
 */
export const AxiosErrorText = (axiosError: any) => {
  return (axiosError.response && axiosError.response.data && axiosError.response.data.detail)
    || (axiosError.response && axiosError.response.statusText)
    || axiosError.message;
}

