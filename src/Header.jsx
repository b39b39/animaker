import React from "react";

function Header() {
    return (
        <header className="w-full bg-[#1a1a1a] border-b border-gray-700 text-white py-4 px-6 flex justify-between items-center fixed top-0 left-0 z-50">
            <h1 className="text-xl font-semibold tracking-wide">만알못티어리스트</h1>
            <nav className="flex gap-4">
                <a href="#" className="hover:text-gray-300">표지 사진을 클릭해서 상세한 리뷰를 확인해보세요</a>
            </nav>
        </header>
    );
}

export default Header;
