// ItemWrapper.jsx
import React, { useState } from "react";
import { Info } from "lucide-react"; // lucide-react 아이콘 사용 (Tailwind 호환)

export function ItemWrapper({ children, item, setSelectedItem }) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* 내부 아이템 (SortableItem 등) */}
            {children}

            {/* Hover 시만 보이는 info 아이콘 */}
            {hovered && (
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // DnD 이벤트 방지
                        e.preventDefault();
                        setSelectedItem(item);
                    }}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full transition"
                >
                    <Info size={16} />
                </button>
            )}
        </div>
    );
}
