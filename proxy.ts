import { clerkMiddleware } from '@clerk/nextjs/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// export default clerkMiddleware();
const intlMiddleware = createMiddleware(routing);

// export default function proxy(request: Request) {
export default clerkMiddleware(async (auth, req) => {
  // first let clerk run, then pass request to intl
  return intlMiddleware(req);
});
// }

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
