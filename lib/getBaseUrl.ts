export const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // کلاینت
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'; // سرور
};
