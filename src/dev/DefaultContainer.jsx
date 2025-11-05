import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import { ItemWrapper } from "./ItemWrapper.jsx";

export default function DefaultContainer({ id, items, setSelectedItem, setItems, handleSave, tiers }) {
    const { setNodeRef } = useDroppable({ id });

    // ✅ 새 아이템 추가 함수
    const handleAddItem = async () => {
        setItems((prev) => {
            // 모든 tier의 item id를 숫자로 수집
            const allIds = Object.values(prev)
                .flat()
                .map((i) => Number(i.id))
                .filter((n) => !isNaN(n));

            const lastId = allIds.length ? Math.max(...allIds) : 0;

            const newItem = {
                id: `${lastId + 1}`,
                title: "",
                description: "",
                image: "",
                thumbnail: "",
                strength: "",
                weakness: "",
                types: [],
            };

            const updated = {
                ...prev,
                uncategorized: [...(prev.uncategorized || []), newItem],
            };

            // 서버 저장도 여기서 async로 호출
            handleSave(tiers, updated).then(() => {
                console.log("🆕 새 아이템 추가 완료:", newItem);
            });

            return updated;
        });
    };

    return (
        <>
            {/* 제목 + 추가 버튼 */}
            <div className="flex justify-between items-center mt-10 mb-2">
                <p className="text-xs">uncategorized</p>
                <button
                    onClick={handleAddItem}
                    className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    + Add
                </button>
            </div>

            <SortableContext id={id} items={items.map((i) => i.id)} strategy={horizontalListSortingStrategy}>
                <div className="flex border border-gray-700 last:border-b-0">
                    <div
                        ref={setNodeRef}
                        className="flex flex-wrap flex-1 bg-[#0f0f0f]"
                        style={{ minHeight: "300px", maxWidth: "100%" }}
                    >
                        {items.length > 0 ? (
                            items.map((item) => (
                                <ItemWrapper key={item.id} item={item} setSelectedItem={setSelectedItem}>
                                    <SortableItem id={item.id} item={item} />
                                </ItemWrapper>
                            ))
                        ) : (
                            <div className="w-full text-center text-gray-500 p-5 text-sm">
                                항목이 없습니다.
                            </div>
                        )}
                    </div>
                </div>
            </SortableContext>
        </>
    );
}
