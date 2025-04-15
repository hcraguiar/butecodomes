export function validateOrigin(req: Request) {
  const allowedOrigin = process.env.NEXT_PUBLIC_URL;
  const origin = req.headers.get('origin');
  return origin === allowedOrigin;
}