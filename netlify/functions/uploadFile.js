export async function handler(event) {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method not allowed" }),
        };
    }

    try {
        const { fileData, folder, public_id } = JSON.parse(event.body);

        if (!fileData) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing file data" }),
            };
        }

        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

        // ✅ Cloudinary JSON API로 업로드 (FormData 대신)
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                file: fileData, // base64 문자열
                upload_preset: uploadPreset,
                folder,
                public_id,
            }),
        });

        const result = await res.json();

        if (result.error) {
            throw new Error(result.error.message);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                path: result.secure_url,
                public_id: result.public_id,
            }),
        };
    } catch (err) {
        console.error("❌ Cloudinary 업로드 실패:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
        };
    }
}
