import { useEffect, useMemo, useState } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import TierColumn from './TierColumn';
import ItemModal from './ItemModal';
import AdminBar from './AdminBar';
import { fetchData, saveData } from '../lib/api';
import { isAdmin } from '../lib/identity';
import type { DataFile, Item } from '../lib/types';

export default function Board() {
  const sensors = useSensors(useSensor(PointerSensor));
  const [data, setData] = useState<DataFile | null>(null);
  const [selected, setSelected] = useState<Item | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchData()
      .then(setData)
      .catch(() => console.error('데이터 로드 실패'));
  }, []);

  useEffect(() => {
    setEditMode(isAdmin());
  }, []);

  const tiers = data?.tiers ?? [];
  const items = data?.items ?? [];

  const itemsByTier = useMemo(() => {
    const map: Record<string, Item[]> = {};
    for (const t of tiers) map[t.id] = [];
    for (const it of items) {
      if (it.tierId && map[it.tierId]) map[it.tierId].push(it);
    }
    return map;
  }, [tiers, items]);

  const handleDragEnd = (event: DragEndEvent) => { /* ... */ };
  const handleSave = async () => { /* ... */ };

  return (
    <div className="app">
      {!data ? (
        <p style={{ padding: 40 }}>Loading...</p>
      ) : (
        <>
          <AdminBar editMode={editMode} onSave={handleSave} />
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="board">
              <SortableContext
                items={tiers.map(t => t.id)}
                strategy={rectSortingStrategy}
              >
                {tiers
                  .sort((a, b) => a.order - b.order)
                  .map(tier => (
                    <TierColumn
                      key={tier.id}
                      tier={tier}
                      items={itemsByTier[tier.id] || []}
                      editable={editMode}
                      onOpen={setSelected}
                    />
                  ))}
              </SortableContext>
            </div>
          </DndContext>
          {selected && (
            <ItemModal
              item={selected}
              editable={editMode}
              onClose={() => setSelected(null)}
              onUpdate={next =>
                setData(prev =>
                  prev
                    ? {
                        ...prev,
                        items: prev.items.map(i =>
                          i.id === next.id ? next : i
                        ),
                      }
                    : prev
                )
              }
            />
          )}
        </>
      )}
    </div>
  );
}
