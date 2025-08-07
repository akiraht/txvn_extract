export default function middleware(request) {
  const auth = request.headers.get('authorization');

  if (auth) {
    const [scheme, encoded] = auth.split(' ');
    if (scheme === 'Basic') {
      const decoded = atob(encoded);
      const [user, pass] = decoded.split(':');
      if (user === '@txvn.co.jp' && pass === '12345@okA') {
        return;
      }
    }
  }

  return new Response('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Protected"',
    },
  });
}
