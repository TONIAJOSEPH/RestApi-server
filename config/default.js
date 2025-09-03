module.exports = {
  port: process.env.PORT,
  origin: process.env.ORIGIN,
  dbUri: process.env.DBURI,
  saltWorkFactor: process.env.SALTWORKFACTOR,
  accessTokenTtl: process.env.ACCESSTOKENTTL,
  refreshTokenTtl: process.env.REFRESHTOKENTTL,
  googleClientId: process.env.GOOGLECLIENTID,
  googleClientSecret: process.env.GOOGLECLIENTSECRET,
  googleOAuthRedirectUrl:
    "https://restapi-server-i4ry.onrender.com/api/sessions/oauth/google",
};
