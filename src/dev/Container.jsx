// Container.jsx
import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import {ItemWrapper} from "./ItemWrapper.jsx";

export default function Container({ id, label, color, items, setSelectedItem }) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <SortableContext id={id} items={items.map((i) => i.id)} strategy={horizontalListSortingStrategy}>
            <div className="flex border border-gray-700 last:border-b-0">
                {/* 왼쪽 티어 라벨 */}
                <div
                    className="w-24 flex items-center justify-center text-lg font-bold text-white"
                    style={{ backgroundColor: color }}
                >
                    {label}
                </div>

                {/* 오른쪽 아이템 영역 */}
                <div
                    ref={setNodeRef}
                    className="flex flex-wrap flex-1 bg-[#0f0f0f]"
                    style={{ minHeight: "100px" }}
                >
                    {items.length > 0 ? (
                        items.map((item) => (
                            <ItemWrapper key={item.id} item={item} setSelectedItem={setSelectedItem}>
                                <SortableItem id={item.id} item={item} />
                            </ItemWrapper>
                        ))
                    ) : (
                        <div></div>
                    )}
                </div>
            </div>
        </SortableContext>
    );
}
