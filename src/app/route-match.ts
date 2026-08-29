export const matchesRoute = (pathname: string, route: string) => pathname === route || pathname.startsWith(`${route}/`)
