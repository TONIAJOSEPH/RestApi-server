import jwt from "jsonwebtoken";
// import config from "config";

// const privateKey = config.get<string>("privateKey").replace(/\\n/g, "\n");
// const publicKey = config.get<string>("publicKey").replace(/\\n/g, "\n");
export function signJwt(
  object: Object,
  // keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
  options?: jwt.SignOptions | undefined
) {
  // const signingKey = Buffer.from(
  //   config.get<string>(keyName),
  //   "base64"
  // ).toString("ascii");

  return jwt.sign(object, "yourSecretKey", {
    ...(options && options),
    // algorithm: "RS256",
  });
}

export function verifyJwt(
  token: string
  // keyName: "accessTokenPublicKey" | "refreshTokenPublicKey"
) {
  // const publicKey = Buffer.from(config.get<string>(keyName), "base64").toString(
  //   "ascii"
  // );
  console.log("in verify jwt");
  try {
    const decoded = jwt.verify(token, "yourSecretKey");
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: any) {
    console.error(e);
    return {
      valid: false,
      expired: e.message === "jwt expired",
      decoded: null,
    };
  }
}
