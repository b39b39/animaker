// SortableItem.jsx
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function Item({ id, item }) {
    return (
        <div
            className="relative w-[100px] h-[100px] bg-gray-700 overflow-hidden flex items-center justify-center border border-gray-500 cursor-pointer group"
        >
            {/* 썸네일 이미지 */}
            <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover transition duration-300 group-hover:brightness-50"
            />

            {/* Hover 시 제목 오버레이 */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-sm font-semibold text-center px-2 leading-tight drop-shadow-md">
                    {item.title}
                </span>
            </div>
        </div>
    );
}

export default function SortableItem({ id, item }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: "none",
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Item id={id} item={item} />
        </div>
    );
}
