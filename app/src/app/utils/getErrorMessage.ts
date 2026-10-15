const getErrorMessage = (error: unknown) => {
  const message = (error as { response?: { data?: { message?: string } } })
    ?.response?.data?.message;
  return message ?? 'Unable to proceed further at the moment.';
};

export default getErrorMessage