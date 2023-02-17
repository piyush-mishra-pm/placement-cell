import * as KEYS from '../config/envKeys';

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(KEYS.SENDGRID_API_KEY);

export default sgMail;