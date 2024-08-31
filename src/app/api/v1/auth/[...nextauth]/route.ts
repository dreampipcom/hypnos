// [...nextauth].ts// auth.ts TS-Doc?
import { handlers } from '@auth';
export const fetchCache = 'force-no-store';
export const revalidate = 0;
export const dynamic = 'force-dynamic';
export const { GET, POST } = handlers;
