// 파일: Table.jsx
import React from 'react';

/**
 * Table.jsx
 * - 왼쪽에 라벨 칸, 오른쪽에 items가 들어가는 테이블.
 * - 테두리 선이 분명하고 다크모드에서 흰색 선으로 보이도록 스타일링.
 * - items는 문자열 또는 문자열 배열을 허용합니다.
 */

export function Table({ rows = [] }) {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="overflow-x-auto">
        <table
          className="min-w-full border-collapse rounded-lg"
          aria-label="Label Items Table"
        >
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={idx}
                className="align-top"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
              >
                {/* 라벨 셀 */}
                <th
                  scope="row"
                  className="w-36 px-4 py-4 text-left align-top whitespace-nowrap text-sm font-semibold"
                  style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="text-white/90">{row.label}</div>
                </th>

                {/* 아이템 셀 */}
                <td className="px-4 py-4 align-top">
                  {Array.isArray(row.items) ? (
                    <div className="flex flex-wrap gap-2">
                      {row.items.map((it, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium border"
                          style={{ borderColor: 'rgba(255,255,255,0.12)', background: 'transparent' }}
                        >
                          <span className="text-white/90">{it}</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-white/90 text-sm">{row.items}</div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 사용법
// 1. 위 두 파일(Table.jsx, App.jsx)을 src/에 저장
// 2. main.jsx에서 <App />을 렌더링
//    import React from 'react'
//    import { createRoot } from 'react-dom/client'
//    import App from './App'
//    import './index.css' // Tailwind 포함
//    createRoot(document.getElementById('root')).render(<App />)

// Tailwind: 다크 배경에서 선을 더 선명하게 보이게하려면 index.css나 전역 스타일에서 다음을 조정하세요:
// .table-border { border-color: rgba(255,255,255,0.08); }
