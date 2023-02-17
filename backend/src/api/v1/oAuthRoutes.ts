import { Request, Router } from 'express';
import { sign } from 'jsonwebtoken';
import passport from 'passport';

import * as KEYS from '../../config/envKeys';

const oAuthRouter = Router();

oAuthRouter.get(
    '/auth/google',
    passport.authenticate("google", {
        scope: ['profile', 'email'],
    })
);

oAuthRouter.get(
    '/auth/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    async (req: any, res) => {
        console.log('>> Post passport_authenticate: ');
        const token = sign({ _id: req.user._id }, KEYS.JWT_SECRET || 'secret_key');
        res.cookie('jwt', token, { sameSite: KEYS.NODE_ENV === 'production' ? 'none' : 'lax', secure: KEYS.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 }); // 1day expiry
        res.redirect(KEYS.AUTH_SUCCESS_REDIRECT + '/' + token || '/');
    }
);

// todo: Not currently used:
oAuthRouter.get('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/login');
});


oAuthRouter.get(
    '/profile',
    passport.authenticate('jwt', { session: false, failureRedirect: '/login' }),
    (req: any, res) => {
        res.render('profile', { user: req.user });
    }
);

export default oAuthRouter;