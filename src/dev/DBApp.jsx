import { useEffect, useState } from "react";

export default function DBApp() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadData() {
            try {
                const res = await fetch("/.netlify/functions/getSQL");
                const result = await res.json();
                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) return <p className="text-gray-400 p-4">불러오는 중...</p>;
    if (error) return <p className="text-red-500 p-4">에러 발생: {error}</p>;
    if (!data) return <p className="text-gray-500 p-4">데이터 없음</p>;

    return (
        <div className="p-6 text-gray-200">
            <h1 className="text-xl font-bold mb-4">📦 Netlify DB 데이터 확인</h1>

            <section className="mb-8">
                <h2 className="text-lg font-semibold mb-2">🎯 Tiers</h2>
                <pre className="bg-gray-800 p-3 rounded text-sm overflow-x-auto">
          {JSON.stringify(data.tiers, null, 2)}
        </pre>
            </section>

            <section className="mb-8">
                <h2 className="text-lg font-semibold mb-2">🧩 Items</h2>
                <pre className="bg-gray-800 p-3 rounded text-sm overflow-x-auto">
          {JSON.stringify(data.items, null, 2)}
        </pre>
            </section>

            <section>
                <h2 className="text-lg font-semibold mb-2">🏷️ Tags</h2>
                <pre className="bg-gray-800 p-3 rounded text-sm overflow-x-auto">
          {JSON.stringify(data.tags, null, 2)}
        </pre>
            </section>
        </div>
    );
}
