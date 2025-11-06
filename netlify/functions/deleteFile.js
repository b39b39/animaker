// netlify/functions/deleteFile.js
import crypto from "crypto";

export async function handler(event) {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method not allowed" }),
        };
    }

    try {
        const { public_id } = JSON.parse(event.body);

        if (!public_id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing public_id" }),
            };
        }

        // ⚙️ Cloudinary 인증 정보 (환경 변수로 관리 권장)
        const cloudName process.env.CLOUDINARY_CLOUD_NAME
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        if (!apiKey || !apiSecret) {
            throw new Error("Cloudinary API credentials are missing");
        }

        // ✅ Cloudinary는 삭제 시 반드시 서명(signature)이 필요
        const timestamp = Math.round(Date.now() / 1000);
        const stringToSign = `public_id=${public_id}&timestamp=${timestamp}${apiSecret}`;
        const signature = crypto.createHash("sha1").update(stringToSign).digest("hex");

        // ✅ Cloudinary image destroy API 호출
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                public_id,
                api_key: apiKey,
                timestamp,
                signature,
            }),
        });

        const result = await res.json();

        if (result.result !== "ok") {
            throw new Error(result.error?.message || "Cloudinary deletion failed");
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                result,
            }),
        };
    } catch (err) {
        console.error("❌ Cloudinary 삭제 실패:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
        };
    }
}
