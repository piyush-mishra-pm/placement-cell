import * as redis from 'redis';
import { promisify } from 'util';

import envKeys from '../config/envKeys';

const client = redis.createClient({
    url: envKeys.REDIS_URL,
});

const setAsyncExPromise = promisify(client.setex).bind(client);
const getAsyncPromise = promisify(client.get).bind(client);
const delAsyncPromise = promisify(client.del).bind(client);

client.on('error', err => {
    console.log('Error in redis client: ' + err);
});

export async function redisSaveWithTtl(key: string, value: any, ttlSeconds: number = 60) {
    return await setAsyncExPromise(key, ttlSeconds, JSON.stringify(value));
}

export async function redisDeleteKey(key: string) {
    return await delAsyncPromise(key);
}

export async function redisGet(key: string) {

    const jsonString = await getAsyncPromise(key);
    return jsonString ?? null;
}