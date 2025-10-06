// src/lib/api.ts
import type { DataFile } from './types';
import { getIdentityToken } from './identity';

export async function fetchData(): Promise<DataFile> {
  const res = await fetch('/data/data.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('데이터 로드 실패');
  return res.json();
}

export async function saveData(nextData: DataFile) {
  const token = await getIdentityToken();
  if (!token) throw new Error('권한 없음');
  const res = await fetch('/.netlify/functions/saveData', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(nextData)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function uploadImage(file: File): Promise<{ path: string }> {
  const token = await getIdentityToken();
  if (!token) throw new Error('권한 없음');

  const b64 = await file.arrayBuffer().then(buf => 
    btoa(String.fromCharCode(...new Uint8Array(buf)))
  );

  const res = await fetch('/.netlify/functions/uploadImage', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify({ filename: file.name, contentBase64: b64 })
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
