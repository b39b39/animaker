import React, { useState, useEffect } from "react";
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    rectIntersection,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import Container from "./Container";
import DefaultContainer from "./DefaultContainer";
import { Item } from "./SortableItem";
import ImageCropModal from "./ImageCropModal";

export default function DevApp() {
    const [authorized, setAuthorized] = useState(false);
    const [inputPassword, setInputPassword] = useState("");
    const [tiers, setTiers] = useState([]);
    const [items, setItems] = useState({});
    const [activeItem, setActiveItem] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [cropImage, setCropImage] = useState(null); // crop 모달용 상태
    const [isSaving, setIsSaving] = useState(false);


    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // ✅ 비밀번호 검증 함수 (서버로 전달해서 검증)
    async function handlePasswordSubmit(e) {
        e.preventDefault();

        try {
            const res = await fetch("/.netlify/functions/verifyKey", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: inputPassword }), // 사용자가 입력한 비밀번호
            });

            const data = await res.json();

            if (data.valid) {
                setAuthorized(true);
            } else {
                alert("비밀번호가 올바르지 않습니다.");
            }
        } catch (err) {
            console.error("비밀번호 검증 실패:", err);
            alert("서버 오류가 발생했습니다.");
        }
    }


    // ✅ Hook은 무조건 최상단에서만 실행
    useEffect(() => {
        if (!authorized) return; // 인증 안되면 fetch 실행 안함

        async function fetchData() {
            try {
                const res = await fetch("/.netlify/functions/getData");
                const data = await res.json();
                setTiers(data.tiers || []);
                setItems(data.items || {});
            } catch (err) {
                console.error("데이터 불러오기 실패:", err);
            }
        }
        fetchData();
    }, [authorized]);

    // 특정 item ID가 어느 container에 속하는지 찾기
    function findContainer(id) {
        if (id in items) return id;
        return Object.keys(items).find((key) =>
            items[key].some((item) => item.id === id)
        );
    }

    // ✅ 변경사항 저장 함수 분리
    async function handleSave(updatedTiers = tiers, updatedItems = items) {
        try {
            const res = await fetch("/.netlify/functions/setData", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tiers: updatedTiers, items: updatedItems }),
            });

            if (!res.ok) throw new Error(`서버 응답 오류: ${res.status}`);
            console.log("✅ 데이터 저장 완료");
        } catch (err) {
            console.error("❌ 데이터 저장 실패:", err);
        }
    }

    function handleDragStart(event) {
        const { active } = event;
        const { id } = active;

        const containerId = findContainer(id);
        const item = items[containerId]?.find((i) => i.id === id);
        setActiveItem(item);
    }

    function handleDragOver(event) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        const activeContainer = findContainer(activeId);
        const overContainer = findContainer(overId);

        if (!activeContainer || !overContainer || activeContainer === overContainer)
            return;

        setItems((prev) => {
            const activeItems = prev[activeContainer];
            const overItems = prev[overContainer];

            const activeIndex = activeItems.findIndex((i) => i.id === activeId);
            const overIndex = overItems.findIndex((i) => i.id === overId);

            const newActive = [...activeItems];
            const newOver = [...overItems];

            const [movedItem] = newActive.splice(activeIndex, 1);
            if (overIndex >= 0) newOver.splice(overIndex + 1, 0, movedItem);
            else newOver.push(movedItem);

            return {
                ...prev,
                [activeContainer]: newActive,
                [overContainer]: newOver,
            };
        });
    }

    async function handleDragEnd(event) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        const activeContainer = findContainer(activeId);
        const overContainer = findContainer(overId);

        if (!activeContainer || !overContainer) return;

        let updatedItems = { ...items };

        if (activeContainer === overContainer) {
            const oldIndex = items[activeContainer].findIndex((i) => i.id === activeId);
            const newIndex = items[overContainer].findIndex((i) => i.id === overId);

            if (oldIndex !== newIndex) {
                updatedItems = {
                    ...items,
                    [overContainer]: arrayMove(items[overContainer], oldIndex, newIndex),
                };
                setItems(updatedItems);
            }
        } else {
            setItems((prev) => {
                const activeItems = prev[activeContainer];
                const overItems = prev[overContainer];

                const activeIndex = activeItems.findIndex((i) => i.id === activeId);
                const overIndex = overItems.findIndex((i) => i.id === overId);

                const newActive = [...activeItems];
                const newOver = [...overItems];
                const [movedItem] = newActive.splice(activeIndex, 1);

                if (overIndex >= 0) newOver.splice(overIndex + 1, 0, movedItem);
                else newOver.push(movedItem);

                updatedItems = {
                    ...prev,
                    [activeContainer]: newActive,
                    [overContainer]: newOver,
                };
                return updatedItems;
            });
        }

        setActiveItem(null);
        await handleSave(tiers, updatedItems);
    }

    // ✅ Cloudinary 업로드 처리 함수
    async function handleFileUpload(file, type, itemId) {
        const reader = new FileReader();

        return new Promise((resolve, reject) => {
            reader.onload = async (event) => {
                const base64Data = event.target.result; // base64 인코딩된 파일 데이터
                const relativePath = type === "image" ? "images" : "thumbnails";

                try {
                    // ✅ Netlify Function 호출 (Cloudinary 업로드 담당)
                    const res = await fetch("/.netlify/functions/uploadFile", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            fileData: base64Data,
                            folder: relativePath, // Cloudinary 폴더로 전달
                            public_id: `${itemId}`, // 선택사항: 고유 ID로 저장
                        }),
                    });

                    if (!res.ok) throw new Error("업로드 실패");

                    const data = await res.json();
                    resolve(data.path); // ✅ Cloudinary URL 반환
                } catch (err) {
                    console.error("업로드 실패:", err);
                    reject(err);
                }
            };

            reader.onerror = (err) => reject(err);
            reader.readAsDataURL(file); // ✅ 파일을 base64로 읽음
        });
    }

    function handleModalCloseWithoutSave() {
        setSelectedItem(null);
    }

    async function handleModalClose() {
        if (!selectedItem || isSaving) return; // 이미 저장 중이면 중복 클릭 방지
        setIsSaving(true);
        if (selectedItem) {
            const containerId = findContainer(selectedItem.id);
            const updated = { ...items };
            updated[containerId] = updated[containerId].map((i) =>
                i.id === selectedItem.id ? selectedItem : i
            );
            setItems(updated);
            await handleSave(tiers, updated);
        }
        setSelectedItem(null);
        setIsSaving(false);
    }

    // ✅ 인증 전 화면 (비밀번호 입력)
    if (!authorized) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-white bg-[#0f0f0f]">
                <h1 className="text-xl mb-4">개발 페이지 접근</h1>
                <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-3">
                    <input
                        type="password"
                        placeholder="비밀번호를 입력하세요"
                        value={inputPassword}
                        onChange={(e) => setInputPassword(e.target.value)}
                        className="px-3 py-2 rounded bg-gray-800 border border-gray-600 text-center"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                    >
                        확인
                    </button>
                </form>
            </div>
        );
    }

    // ✅ 인증 후 로딩 중
    if (tiers.length === 0 || Object.keys(items).length === 0)
        return <div className="text-gray-300 text-center p-10">로딩 중...</div>;


    return (
        <div className="max-w-5xl w-full mx-auto">
            <DndContext
                sensors={sensors}
                collisionDetection={rectIntersection}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                {tiers.map((tier) => (
                    <Container
                        key={tier.id}
                        id={tier.id}
                        label={tier.id}
                        color={tier.color}
                        items={items[tier.id]}
                        setSelectedItem={setSelectedItem}
                    />
                ))}

                <DefaultContainer
                    key={"uncategorized"}
                    id={"uncategorized"}
                    items={items["uncategorized"]}
                    setSelectedItem={setSelectedItem}
                    setItems={setItems}
                    handleSave={handleSave}
                    tiers={tiers}
                />

                <DragOverlay>
                    {activeItem ? <Item id={activeItem.id} item={activeItem} /> : null}
                </DragOverlay>
            </DndContext>

            {/* ✅ 수정 가능한 Modal */}
            {selectedItem && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 overflow-auto p-4"
                    onClick={handleModalClose}
                >
                    <div
                        className="bg-[#1a1a1a] rounded-lg max-w-5xl w-full p-6 relative flex flex-col gap-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* ✅ 상단: 이미지/정보 반반 영역 */}
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* 왼쪽 - 이미지, 업로드 */}
                            <div className="flex-shrink-0 w-full md:w-1/2 flex flex-col justify-center items-center gap-3">
                                <img
                                    src={selectedItem.image || selectedItem.thumbnail}
                                    alt={selectedItem.title}
                                    className="rounded-lg max-h-[400px] object-contain"
                                />

                                <label className="text-gray-400 text-sm">
                                    이미지 업로드:
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="ml-2"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;
                                            const url = await handleFileUpload(file, "image", selectedItem.id);
                                            if (url) setSelectedItem((prev) => ({ ...prev, image: url }));
                                        }}
                                    />
                                </label>

                                <label className="text-gray-400 text-sm">
                                    썸네일 업로드:
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="ml-2"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;
                                            const reader = new FileReader();
                                            reader.onload = () => setCropImage(reader.result);
                                            reader.readAsDataURL(file);
                                        }}
                                    />
                                </label>

                                {cropImage && (
                                    <ImageCropModal
                                        image={cropImage}
                                        onClose={() => setCropImage(null)}
                                        onCropComplete={async (croppedBlob) => {
                                            // ✅ Blob → File 변환
                                            const croppedFile = new File([croppedBlob], `${selectedItem.id}_thumb.png`, {
                                                type: "image/png",
                                            });

                                            const url = await handleFileUpload(croppedFile, "thumbnail", selectedItem.id);
                                            if (url) setSelectedItem((prev) => ({ ...prev, thumbnail: url }));
                                        }}
                                    />
                                )}
                            </div>

                            {/* 오른쪽 - 텍스트 정보 */}
                            <div className="flex flex-col w-full md:w-1/2 text-gray-100">
                                <input
                                    type="text"
                                    className="bg-gray-800 p-2 rounded mb-3 w-full"
                                    value={selectedItem.title || ""}
                                    onChange={(e) =>
                                        setSelectedItem({ ...selectedItem, title: e.target.value })
                                    }
                                />

                                {/* ✅ types 수정 섹션 */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {(selectedItem.types || []).map((type, idx) => (
                                        <div key={idx} className="flex items-center bg-gray-700 rounded px-2 py-1">
                                            <input
                                                type="text"
                                                value={type}
                                                onChange={(e) => {
                                                    const newTypes = [...(selectedItem.types || [])];
                                                    newTypes[idx] = e.target.value;
                                                    setSelectedItem({ ...selectedItem, types: newTypes });
                                                }}
                                                className="bg-transparent text-gray-100 focus:outline-none px-1"
                                            />
                                            <button
                                                onClick={() => {
                                                    const newTypes = (selectedItem.types || []).filter((_, i) => i !== idx);
                                                    setSelectedItem({ ...selectedItem, types: newTypes });
                                                }}
                                                className="ml-1 text-red-400 hover:text-red-500 font-bold"
                                                type="button"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}

                                    {/* ➕ 새 type 추가 버튼 */}
                                    <button
                                        onClick={() => {
                                            const newTypes = [...(selectedItem.types || []), ""];
                                            setSelectedItem({ ...selectedItem, types: newTypes });
                                        }}
                                        className="bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-500"
                                        type="button"
                                    >
                                        ＋
                                    </button>
                                </div>

                                <h3 className="text-sm font-semibold text-white mb-1">느낀 점</h3>
                                <textarea
                                    className="bg-gray-800 p-2 rounded mb-3 w-full h-24"
                                    value={selectedItem.description || ""}
                                    onChange={(e) =>
                                        setSelectedItem({ ...selectedItem, description: e.target.value })
                                    }
                                />

                                <h3 className="text-sm font-semibold text-green-400 mb-1">좋은 점</h3>
                                <textarea
                                    className="bg-gray-800 p-2 rounded mb-3 w-full h-20"
                                    value={selectedItem.strength || ""}
                                    onChange={(e) =>
                                        setSelectedItem({ ...selectedItem, strength: e.target.value })
                                    }
                                />

                                <h3 className="text-sm font-semibold text-red-400 mb-1">아쉬운 점</h3>
                                <textarea
                                    className="bg-gray-800 p-2 rounded w-full h-20"
                                    value={selectedItem.weakness || ""}
                                    onChange={(e) =>
                                        setSelectedItem({ ...selectedItem, weakness: e.target.value })
                                    }
                                />
                            </div>
                        </div>

                        {/* ✅ 하단 버튼 영역 (별도) */}
                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={async () => {
                                    if (!window.confirm("정말 삭제하시겠습니까?")) return;

                                    const containerId = findContainer(selectedItem.id);
                                    const pathsToDelete = [selectedItem.image, selectedItem.thumbnail].filter(Boolean);

                                    for (const filePath of pathsToDelete) {
                                        try {
                                            await fetch("/.netlify/functions/deleteFile", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({ filePath }),
                                            });
                                            console.log(`🗑️ Deleted: ${filePath}`);
                                        } catch (err) {
                                            console.error("파일 삭제 실패:", err);
                                        }
                                    }

                                    const updatedItems = {
                                        ...items,
                                        [containerId]: items[containerId].filter((i) => i.id !== selectedItem.id),
                                    };

                                    setItems(updatedItems);
                                    await handleSave(tiers, updatedItems);
                                    setSelectedItem(null);
                                }}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                삭제
                            </button>

                            <button
                                onClick={handleModalCloseWithoutSave}
                                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
                            >
                                취소
                            </button>

                            <button
                                onClick={handleModalClose}
                                disabled={isSaving}
                                className={`px-4 py-2 rounded text-white transition ${isSaving ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                            >
                                {isSaving ? "저장 중..." : "확인"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
