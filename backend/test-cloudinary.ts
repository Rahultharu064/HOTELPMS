import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config({ path: path.resolve(__dirname, '.env') });

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log('--- Cloudinary Test ---');
console.log('Cloud Name from ENV:', cloudName);
console.log('API Key from ENV:', apiKey);
console.log('API Secret exists:', !!apiSecret);

const tryCloud = (name: string) => {
    console.log(`\nTesting with name: [${name}]`);
    cloudinary.config({
        cloud_name: name,
        api_key: apiKey?.trim(),
        api_secret: apiSecret?.trim(),
    });
    return cloudinary.api.ping();
};

async function runTests() {
    try {
        const res = await tryCloud(cloudName?.trim() || '');
        console.log('✅ Success with original name!');
    } catch (err: any) {
        console.error('❌ Failed with original name:', err.error?.message || err.message);
        
        try {
            const res = await tryCloud('hpms');
            console.log('✅ Success with [hpms] name!');
        } catch (err3: any) {
            console.error('❌ Failed with [hpms] name:', err3.error?.message || err3.message);
        }
    }
}

runTests();
