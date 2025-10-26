import React from "react";
import Layout from "./Layout";
import { Table } from "./Table";

export default function App() {
  const rows = [
    { label: "최상위 티어", items: ["S+", "S", "S-"] },
    { label: "기술 스택", items: ["React", "Vite", "Tailwind CSS", "JavaScript"] },
    { label: "한줄소개", items: "인터랙티브한 포d트폴리오" },
    { label: "연락처", items: "ohsj@example.com" },
  ];

  return (
    <Layout>
      <div className="max-w-5xl w-full p-4 start-center">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Tiermaker 스타일 테이블
        </h1>
        <div
          className="rounded-xl p-1"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
            boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
          }}
        >
          <div
            className="rounded-lg bg-transparent"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <Table rows={rows} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
