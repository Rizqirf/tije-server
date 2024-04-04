const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

async function verifyGoogleToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();

    return payload;
  } catch (error) {
    throw { name: "GOOGLE_AUTH_FAILED" };
  }
}

module.exports = { verifyGoogleToken };
