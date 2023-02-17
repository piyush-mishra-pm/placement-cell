import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import { UserModel } from '../models/UserModel';
import ErrorObject from '../utils/ErrorObject';
import * as KEYS from '../config/envKeys';

passport.use(
    new GoogleStrategy.Strategy(
        {
            clientID: KEYS.GOOGLE_OAUTH_CLIENT_ID || '', // stored in env variables.
            clientSecret: KEYS.GOOGLE_OAUTH_CLIENT_SECRET || '', // stored in env variables.
            callbackURL: '/api/v1/auth/google/callback',
        },
        async (_accessToken, _refreshToken, profile, done) => {
            // is Existing user?
            console.log('>> In Profile: ');
            const existingUser = await UserModel.findOne({ $or: [{ 'googleId': profile._json.sub }, { 'email': profile._json.email }] });
            if (existingUser) {
                return done(null, existingUser);
            }
            console.log('>> A new user.');
            // is New User?
            try {
                const user = await new UserModel({ first_name: profile._json.given_name, last_name: profile._json.family_name, googleId: profile.id, email: profile._json.email }).save();
                done(null, user);
            } catch (e) {
                console.log('Error during google-oAuth user registration.', e);
                done(new ErrorObject(500, 'Something went wrong while creating user from Google-OAuth.'));
            }
        }
    )
);

passport.serializeUser((user: any, done) => {
    console.log('>> In Serialise User: ');
    done(null, user._id);
});

passport.deserializeUser((id: any, done) => {
    console.log('>> In Deserialise User: ');
    UserModel.findById(id).then(user => {
        done(null, user);
    }).catch(e => {
        console.log('Error in deserializing user', e);
        done(new ErrorObject(500))
    });
}); 