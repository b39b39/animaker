import React, { useState, useEffect } from "react";
import "./Table.css";

export function Table() {
    const [tiers, setTiers] = useState([]);
    const [items, setItems] = useState({});
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🔹 DB에서 tierlist 데이터 가져오기
    const getData = async () => {
        try {
            const res = await fetch("/.netlify/functions/getData");
            if (!res.ok) throw new Error("데이터 요청 실패");
            const data = await res.json();

            setTiers(data.tiers || []);
            setItems(data.items || {});
        } catch (err) {
            console.error("❌ getData error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    if (loading) return <div className="text-gray-400 text-center mt-10">Loading...</div>;

    return (
        <>
            <div className="w-full border border-gray-600 overflow-hidden">
                {tiers.map((tier) => (
                    <div
                        key={tier.id}
                        className="flex border-b border-gray-600 last:border-b-0"
                        style={{ minHeight: "100px" }}
                    >
                        {/* 왼쪽 Tier Label */}
                        <div
                            className="w-24 flex items-center justify-center text-lg font-bold"
                            style={{ color: "#fff", backgroundColor: tier.color }}
                        >
                            {tier.id}
                        </div>

                        {/* 오른쪽 아이템 영역 */}
                        <div className="flex-1 flex flex-wrap bg-[#0f0f0f] items-center">
                            {items[tier.id] && items[tier.id].length > 0 ? (
                                items[tier.id].map((item) => (
                                    <div
                                        key={item.id}
                                        className="relative w-[100px] h-[100px] bg-gray-700 overflow-hidden flex items-center justify-center border border-gray-500 cursor-pointer group"
                                        onClick={() => setSelectedItem(item)}
                                    >
                                        <img
                                            src={item.thumbnail}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition duration-300 group-hover:brightness-50"
                                        />

                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <span className="text-white text-sm font-semibold text-center px-2 leading-tight drop-shadow-md">
                                                {item.title}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-600 italic px-3">No items</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {selectedItem && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 overflow-auto p-4"
                    onClick={() => setSelectedItem(null)}
                >
                    <div
                        className="bg-[#1a1a1a] rounded-lg max-w-5xl w-full p-6 relative flex flex-col md:flex-row gap-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-4 right-4 text-white font-bold text-xl hover:text-gray-400"
                            onClick={() => setSelectedItem(null)}
                        >
                            ✕
                        </button>

                        {/* 이미지 영역 */}
                        <div className="flex-shrink-0 w-full md:w-1/2 flex justify-center items-center">
                            <img
                                src={selectedItem.image}
                                alt={selectedItem.title}
                                className="rounded-lg max-h-[500px] object-contain"
                            />
                        </div>

                        {/* 텍스트 영역 */}
                        <div className="flex flex-col w-full md:w-1/2 text-gray-100">
                            <h2 className="text-2xl font-bold mb-3">{selectedItem.title}</h2>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {selectedItem.types?.map((type, idx) => (
                                    <span
                                        key={idx}
                                        className="bg-gray-700 px-3 py-1 rounded-full text-sm text-gray-200 border border-gray-500"
                                    >
                                        {type}
                                    </span>
                                ))}
                            </div>

                            <p className="text-gray-300 mb-6 leading-relaxed">{selectedItem.description}</p>

                            <hr className="border-gray-700 mb-4" />
                            <h3 className="text-lg font-semibold text-green-400 mb-2">좋다</h3>
                            <p className="text-gray-300 mb-6 leading-relaxed">
                                {selectedItem.strength}
                            </p>

                            <hr className="border-gray-700 mb-4" />
                            <h3 className="text-lg font-semibold text-red-400 mb-2">아쉽다</h3>
                            <p className="text-gray-300 leading-relaxed">{selectedItem.weakness}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Table;
