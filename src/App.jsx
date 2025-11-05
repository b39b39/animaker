import React from "react";
import Layout from "./Layout";
import { Table } from "./Table";
import Header from "./Header";

export default function App() {

  return (
    <Layout>
      <div className="max-w-5xl w-full p-4">
        <Header />
        <div className="rounded-xl p-1">
          <Table />
        </div>
      </div>
    </Layout>
  );
}
