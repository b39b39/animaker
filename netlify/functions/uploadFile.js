import fs from "fs";
import path from "path";

export async function handler(event, context) {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method not allowed" }),
        };
    }

    try {
        const { fileData, fileName, relativePath } = JSON.parse(event.body);

        if (!fileData || !fileName || !relativePath) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Invalid request data" }),
            };
        }

        // public 폴더 경로 설정
        const saveDir = path.join(process.cwd(), "public", relativePath);
        const savePath = path.join(saveDir, fileName);

        // 폴더 없으면 생성
        fs.mkdirSync(saveDir, { recursive: true });

        // base64 → 버퍼 변환
        const base64Data = fileData.replace(/^data:.+;base64,/, "");
        const fileBuffer = Buffer.from(base64Data, "base64");

        // 파일 저장
        fs.writeFileSync(savePath, fileBuffer);

        console.log(`✅ 파일 저장 완료: ${savePath}`);

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                path: `/${relativePath}/${fileName}`,
            }),
        };
    } catch (err) {
        console.error("❌ 파일 업로드 오류:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
        };
    }
}
