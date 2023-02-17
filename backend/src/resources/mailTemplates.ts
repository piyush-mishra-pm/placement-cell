import { text } from "express";
import { mailTransporter } from "../services/mailer";

import sgMail from "../services/sendGrid";
import KEYS from "../config/envKeys";

const USE_SENDGRID = true;

export interface mailerProps {
    toMail: string;
    fromMail?: string;
    subject?: string;
    text?: string;
    html?: string;
}

export const defaultMailTemplate = USE_SENDGRID ? async (mailProps: mailerProps) => {
    try {
        await sgMail.send({ to: mailProps.toMail, from: mailProps.fromMail || KEYS.ADMIN_EMAIL_ID, subject: mailProps.subject || 'Auth-Node-React Email', text: mailProps.text || 'random text', html: mailProps.html || '' });
    } catch (e) {
        throw e;
    }
} : async function (mailProps: mailerProps) {
    try {
        await mailTransporter.sendMail({
            from: mailProps.fromMail || KEYS.ADMIN_EMAIL_ID,
            to: mailProps.toMail,
            subject: mailProps.subject || 'Auth-Node-React Email',
            html: mailProps.html || '',
            text: mailProps.text || ''
        });
    } catch (e) {
        throw e;
    }
}