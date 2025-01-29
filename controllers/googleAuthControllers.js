// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth2";
// import {
//   createUser,
//   findUser,
//   findUserById,
// } from "../services/userServices.js";
// import { setTokens } from "../services/authServices.js";
// import ctrlWrapper from "../decorators/ctrlWrapper.js";
// import jwt from "jsonwebtoken";

// const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, JWT_SECRET } = process.env;

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: GOOGLE_CLIENT_ID,
//       clientSecret: GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:5000/v1/auth/register/google/callback",
//     },
//     async (request, accessToken, refreshToken, profile, cb) => {
//       try {
//         // console.log("profile: ", profile);
//         let user = await findUser({ googleId: profile.id });
//         if (!user) {
//           user = await createUser({
//             googleId: profile.id,
//             email: profile.email,
//             name: profile.displayName,
//             password: null,
//           });
//         }
//         cb(null, user);
//       } catch (error) {
//         cb(error, null);
//       }
//     }
//   )
// );

// passport.serializeUser((user, cb) => {
//   cb(null, user.id);
//   console.log("serializeUser user.id: ", user.id);
// });

// passport.deserializeUser(async (data, cb) => {
//   try {
//     const user = await findUser({ googleId: data.id });
//     cb(null, user);
//   } catch (err) {
//     cb(err, null);
//   }
// });

// const passportAuth = passport.authenticate("google", {
//   scope: ["email", "profile"],
// });
// const passportAuthCallback = passport.authenticate("google", {
//   session: false,
// });

// const generateTokens = async (req, res) => {
//   const payload = { id: req.user.id, email: req.user.email };
//   console.log("payload: ", payload);
//   const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

//   const refreshToken = jwt.sign(payload, JWT_SECRET, {
//     expiresIn: "7d",
//   });
//   const tokens = { accessToken, refreshToken };
//   req.user.tokens = tokens;
//   console.log("req.user.tokens: ", req.user);
//   await req.user.save();
//   //   const { _id } = await findUser({ googleId: req.user.id });

//   //   const tokens = await setTokens(_id, accessToken, refreshToken);
//   //   console.log(tokens);
//   //   const authenticatedUser = await findUserById(_id, "-password");
//   res.json({
//     message: "Authentication successful",
//     tokens,
//     user: {
//       id: req.user.id,
//       email: req.user.email,
//       name: req.user.name,
//     },
//   });
// };

// export default {
//   passportAuth,
//   passportAuthCallback,
//   generateTokens: ctrlWrapper(generateTokens),
// };
