const getErrorMessage = (error: unknown) => {
  const res = (error as { response?: { status?:number; data?: { message?: string } } }).response
  if (res?.status === 429) return 'Too many attempts. Please wait a moment and try again.';
  return res?.data?.message ?? 'Unable to proceed further at the moment.';
};

export default getErrorMessage