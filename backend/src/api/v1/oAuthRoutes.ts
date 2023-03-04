import { Router } from 'express';
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
        res.redirect(KEYS.AUTH_SUCCESS_REDIRECT + '/' + token || '/');
    }
);

// todo: Not currently used:
oAuthRouter.get('/logout', (req, res) => {
    res.redirect('/login');
});

oAuthRouter.get(
    '/profile',
    passport.authenticate('jwt', { session: false, failureRedirect: '/login' }),
    (req: any, res) => {
        console.error('Why Came here!');
        res.render('profile', { user: req.user });
    }
);

export default oAuthRouter;