import { randomBytes } from 'crypto';

export const generateRandomString = (length: number) => new Promise((resolve, reject) => {
    randomBytes(length, (err, buf) => {
        if (err) {
            reject(err);
        } else {
            resolve(buf.toString('hex'));
        }
    });
});