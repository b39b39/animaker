import React from "react";
import Layout from "./Layout";
import { Table } from "./Table";
import Header from "./Header";

export default function App() {
  const rows = [
    { label: "최상위 티어", items: ["S+", "S", "S-"] },
    { label: "기술 스택", items: ["React", "Vite", "Tailwind CSS", "JavaScript"] },
    { label: "한줄소개", items: "인터랙티브한 포d트폴리오" },
    { label: "연락처", items: "ohsj@example.com" },
  ];

  return (
    <Layout>
      <div className="max-w-5xl w-full p-4">
        <Header />
        <div className="rounded-xl p-1">
          <Table rows={rows} />
        </div>
      </div>
    </Layout>
  );
}
