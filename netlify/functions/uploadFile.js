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

        // ✅ Netlify Node18+ 에는 FormData와 fetch가 기본 탑재되어 있음
        const formData = new FormData();
        formData.append("file", fileData);
        formData.append("upload_preset", uploadPreset);
        if (folder) formData.append("folder", folder);
        if (public_id) formData.append("public_id", public_id);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: formData,
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
