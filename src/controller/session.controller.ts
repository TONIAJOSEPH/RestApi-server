import { CookieOptions, Request, Response } from "express";
import {
  findAndUpdateUser,
  getGoogleOAuthTokens,
  getGoogleUser,
  validatePassword,
} from "../service/user.service";
import {
  createSession,
  findSessions,
  updateSession,
} from "../service/session.service";
import { signJwt } from "../utils/jwt.utils";
import config from "config";
import logger from "../utils/logger";

const accessTokenCookieOptions: CookieOptions = {
  maxAge: 900000, // 15 mins
  httpOnly: true,
  domain: "localhost",
  path: "/",
  sameSite: "lax",
  secure: false,
};

const refreshTokenCookieOptions: CookieOptions = {
  ...accessTokenCookieOptions,
  maxAge: 3.154e10, // 1 year
};

export async function createUserSessionHandler(req: Request, res: Response) {
  // Validate the user's password
  const user = await validatePassword(req.body);
  if (!user) {
    return res.status(401).send("Invalid email or password");
  }

  // create a session
  const session = await createSession(
    user._id.toString(),
    req.get("user-agent") || ""
  );
  // create an access token
  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get("accessTokenTtl") } // 15 minutes,
  );
  // create a refresh token
  const refreshToken = signJwt(
    { ...user, session: session._id },
    // "refreshTokenPrivateKey",
    { expiresIn: config.get("refreshTokenTtl") } // 15 minutes
  );
  // return access & refresh tokens

  res.cookie("accessToken", accessToken, accessTokenCookieOptions);

  res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

  return res.send({ accessToken, refreshToken });
}

export async function getUserSessionsHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;

  const sessions = await findSessions({ user: userId, valid: true });

  return res.send(sessions);
}

export async function deleteSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session;

  await updateSession({ _id: sessionId }, { valid: false });

  return res.send({
    accessToken: null,
    refreshToken: null,
  });
}

export async function googleOAuthHandler(req: Request, res: Response) {
  //get code from qs

  const code = req.query.code as string;
  console.log("code", code);
  try {
    //get id and accesstoken with the code
    const { id_token, access_token } = await getGoogleOAuthTokens({ code });
    console.log({ id_token, access_token });
    //get user with tokens

    // const googleUser = jwt.decode(id_token);
    const googleUser = await getGoogleUser({ id_token, access_token });

    if (!googleUser.verified_email) {
      return res.status(403).send("Google account is not verified");
    }
    //upsert user
    const user = await findAndUpdateUser(
      {
        email: googleUser.email,
      },
      {
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
      },
      {
        upsert: true,
        new: true,
      }
    );
    //create a session
    const session = await createSession(user?._id, req.get("user-agent") || "");
    //create access and refresh tokens
    const accessToken = signJwt(
      { ...user?.toJSON(), session: session._id },
      { expiresIn: config.get("accessTokenTtl") } // 15 minutes
    );

    // create a refresh token
    const refreshToken = signJwt(
      { ...user?.toJSON(), session: session._id },
      { expiresIn: config.get("refreshTokenTtl") } // 1 year
    );
    //set cookies and redirect back to client
    res.cookie("accessToken", accessToken, accessTokenCookieOptions);

    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    // redirect back to client
    res.redirect(config.get("origin"));
  } catch (error) {
    logger.error(error, "failed to authorize google user");
    return res.redirect(`${config.get("origin")}/oauth/error`);
  }
}
