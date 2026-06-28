export function getBaseUrl() {
//   if (window) {
//     console.log('window:', window);
//     return '';
//   }

  return process.env.NEXT_PUBLIC_BASE_URL;
}
