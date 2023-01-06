import { DateTime } from "luxon";
import { storage, db } from "./firebase";
import { Gif, Collections } from "./models";


export async function getSignedUrl(filePath: string, expiresIn: number) {
    const now = DateTime.utc();
    const expires = now.plus({ seconds: expiresIn });
    const file = storage.bucket().file(filePath);
    const url = await file.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: expires.toJSDate()
    });

    return {
        url: url[0],
        expires: expires.toISO()
    }
}

export async function computeFile(file: Gif) {
    const fileExpirationDate = (file.url?.expires && file.url.value) ? DateTime.fromISO(file.url.expires) : null;
    const now = DateTime.utc();
    const isExpired = fileExpirationDate?.diff(now).as("seconds") as number < 120;

    if ((fileExpirationDate && !isExpired) || !file.path) {
        return file;
    } else {
        const signedUrl = await getSignedUrl(file.path, 60 * 30);
        file.url = {
            value: signedUrl.url,
            expires: signedUrl.expires
        };
        await db.collection(Collections.Gifs).doc(file.id).set({
            url: file.url,
            updatedAt: DateTime.utc().toISO()
        }, { merge: true });
        return file;
    }
}