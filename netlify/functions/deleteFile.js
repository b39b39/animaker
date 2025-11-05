// netlify/functions/deleteFile.js
import fs from "fs";
import path from "path";

export async function handler(event) {
    try {
        const { filePath } = JSON.parse(event.body);
        if (!filePath) return { statusCode: 400, body: "filePath is required" };

        const fullPath = path.join(process.cwd(), "public", filePath);

        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log(`🗑️ Deleted file: ${fullPath}`);
        }

        return { statusCode: 200, body: JSON.stringify({ success: true }) };
    } catch (err) {
        console.error("파일 삭제 오류:", err);
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
}
