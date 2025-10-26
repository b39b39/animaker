import React, { useState } from "react";
import "./Table.css"; // 황 라벨 금속 질감 스타일

export function Table() {
    const tiers = [
        { label: "황", color: "#AA8B30"},
        { label: "S", color: "#9F7AEA" },
        { label: "A", color: "#F87171" },
        { label: "B", color: "#FB923C" },
        { label: "C", color: "#FACC15" },
        { label: "D", color: "#4ADE80" },
        { label: "F", color: "#60A5FA" },
    ];

    // 예시용 item 객체
    const items = [
        [
            {
                thumbnail: "/thumbnails/1.png",
                image: "/images/1.png",
                title: "봇치 더 록!",
                description: "애니빨 만화, 공짜 만화면 볼만 하다",
                strength: "딱히 없음, 슴슴함",
                weakness: "여캐보빔 안좋아하면 이렇게 재미없는 만화가 또 없음",
                types: ["4컷만화", "밴드"],
            },
            {
                thumbnail: "/thumbnails/2.png",
                image: "/images/2.png",
                title: "체인소 맨",
                description: "더 추해지기 전에 은퇴해야",
                strength: "디스토피아적 배경에 그림이 찰떡",
                weakness: "길을 잃은 스토리",
                types: ["액션"],
            },
        ],
        [], [], [], [], [], [], []
    ];

    const [selectedItem, setSelectedItem] = useState(null);

    return (
        <>
            <div className="w-full border border-gray-600 rounded-lg overflow-hidden">
                {tiers.map((tier, i) => (
                    <div
                        key={tier.label}
                        className="flex border-b border-gray-600 last:border-b-0"
                        style={{ minHeight: "100px" }}
                    >
                        {/* 왼쪽 Tier Label */}
                        <div
                            className="w-24 flex items-center justify-center text-lg font-bold"
                            style={{ color: "#fff", backgroundColor: tier.color }}
                        >
                            {tier.label}
                        </div>

                        {/* 오른쪽 아이템 영역 */}
                        <div className="flex-1 flex flex-wrap bg-[#0f0f0f] items-center">
                            {items[i].length > 0 ? (
                                items[i].map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="w-[100px] h-[100px] bg-gray-700 overflow-hidden flex items-center justify-center border border-gray-500 cursor-pointer"
                                        onClick={() => setSelectedItem(item)}
                                    >
                                        <img
                                            src={item.thumbnail}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-600 italic">No items</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
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
                        {/* 닫기 버튼 */}
                        <button
                            className="absolute top-4 right-4 text-white font-bold text-xl hover:text-gray-400"
                            onClick={() => setSelectedItem(null)}
                        >
                            ✕
                        </button>

                        {/* 왼쪽 이미지 영역 */}
                        <div className="flex-shrink-0 w-full md:w-1/2 flex justify-center items-center">
                            <img
                                src={selectedItem.image}
                                alt={selectedItem.title}
                                className="rounded-lg max-h-[500px] object-contain"
                            />
                        </div>

                        {/* 오른쪽 텍스트 영역 */}
                        <div className="flex flex-col w-full md:w-1/2 text-gray-100">
                            {/* 제목 */}
                            <h2 className="text-2xl font-bold mb-3">{selectedItem.title}</h2>

                            {/* 태그 */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {selectedItem.types.map((type, idx) => (
                                    <span
                                        key={idx}
                                        className="bg-gray-700 px-3 py-1 rounded-full text-sm text-gray-200 border border-gray-500"
                                    >
                    {type}
                  </span>
                                ))}
                            </div>

                            {/* 설명 */}
                            <p className="text-gray-300 mb-6 leading-relaxed">{selectedItem.description}</p>

                            {/* 구분선 + 강점 */}
                            <hr className="border-gray-700 mb-4" />
                            <h3 className="text-lg font-semibold text-green-400 mb-2">좋다</h3>
                            <p className="text-gray-300 mb-6 leading-relaxed">
                                {selectedItem.strength}
                            </p>

                            {/* 구분선 + 약점 */}
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
