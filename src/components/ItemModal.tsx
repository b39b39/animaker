import { useState } from 'react';
import { uploadImage } from '../lib/api';
import type { Item } from '../lib/types';

export default function ItemModal({
  item, onClose, editable, onUpdate
}: {
  item: Item; onClose: () => void; editable: boolean; onUpdate: (i: Item) => void;
}) {
  const [draft, setDraft] = useState(item);
  const change = (k: keyof Item, v: any) => setDraft({ ...draft, [k]: v });

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const { path } = await uploadImage(e.target.files[0]);
    change('image', path);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <img src={draft.image} alt={draft.title} style={{ width: '100%', borderRadius: 8 }} />
        <h2>{editable
          ? <input value={draft.title} onChange={e => change('title', e.target.value)} />
          : draft.title}</h2>
        <p><strong>요약</strong></p>
        {editable
          ? <textarea value={draft.summary} onChange={e => change('summary', e.target.value)} />
          : <p>{draft.summary}</p>}

        <p><strong>장점</strong></p>
        {editable
          ? <textarea value={draft.pros.join('\n')} onChange={e => change('pros', e.target.value.split('\n'))} />
          : <ul>{draft.pros.map((p,i)=><li key={i}>+ {p}</li>)}</ul>}

        <p><strong>단점</strong></p>
        {editable
          ? <textarea value={draft.cons.join('\n')} onChange={e => change('cons', e.target.value.split('\n'))} />
          : <ul>{draft.cons.map((p,i)=><li key={i}>– {p}</li>)}</ul>}

        {editable && (
          <>
            <label>이미지 변경: <input type="file" onChange={upload} /></label>
            <button className="primary" onClick={() => { onUpdate(draft); onClose(); }}>변경 적용</button>
          </>
        )}
        <button className="ghost" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}
