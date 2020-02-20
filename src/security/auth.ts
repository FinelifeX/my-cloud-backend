import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'models';

// TODO
// const auth = passport;

// auth.use(
//   new Strategy(
//     {
//       jwtFromRequest: ExtractJwt.fromAuthHeader(),
//       secretOrKey: process.env.JWT_SECRET,
//     },
//     async (payload, done) => {
//       const { id } = payload;
//       const user = await User.findById(id);
//     }
//   )
// );
