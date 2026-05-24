const { OAuth2Client } = require('google-auth-library');

const clientId = process.env.GOOGLE_CLIENT_ID;
if (!clientId) {
  console.warn('Google OAuth disabled — GOOGLE_CLIENT_ID missing.');
}

const client = clientId ? new OAuth2Client(clientId) : null;

async function verifyGoogleIdToken(idToken) {
  if (!client) {
    const err = new Error('Google sign-in is not configured on this server.');
    err.status = 503;
    throw err;
  }
  const ticket = await client.verifyIdToken({ idToken, audience: clientId });
  const payload = ticket.getPayload();
  return {
    sub: payload.sub,
    email: payload.email,
    emailVerified: payload.email_verified,
    name: payload.name,
    picture: payload.picture,
    givenName: payload.given_name,
    familyName: payload.family_name,
  };
}

module.exports = { verifyGoogleIdToken };
