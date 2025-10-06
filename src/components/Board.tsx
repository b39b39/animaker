import { useEffect, useMemo, useState } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import TierColumn from './TierColumn';
import ItemModal from './ItemModal';
import AdminBar from './AdminBar';
import { fetchData, saveData } from '../lib/api';
import { isAdmin } from '../lib/identity';
import type { DataFile, Item, Tier } from '../lib/types';

export default function Board() {
  const [data, setData] = useState<DataFile | null>(null);
  const [selected, setSelected] = useState<Item | null>(null);
  const [editMode, setEditMode] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => { fetchData().then(setData); }, []);
  useEffect(() => { setEditMode(isAdmin()); }, [data]);

  if (!data) return <p style={{ padding: 40 }}>Loading...</p>;

  const itemsByTier = useMemo(() => {
    const map: Record<string, Item[]> = {};
    data.tiers.forEach(t => map[t.id] = []);
    data.items.forEach(it => {
      const tid = it.tierId || data.tiers[data.tiers.length - 1].id;
      map[tid].push(it);
    });
    return map;
  }, [data]);

  const handleDragEnd = (event: DragEndEvent) => {
    if (!editMode) return;
    const { active, over } = event;
    if (!over) return;
    const itemId = active.id as string;
    const toTierId = over.id as string;
    setData(prev => {
      if (!prev) return prev;
      const newItems = prev.items.map(it =>
        it.id === itemId ? { ...it, tierId: toTierId } : it
      );
      return { ...prev, items: newItems, lastUpdated: new Date().toISOString() };
    });
  };

  const handleSave = async () => {
    await saveData(data!);
    alert('저장 완료!');
  };

  return (
    <div className="app">
      <AdminBar editMode={editMode} onSave={handleSave} />
      <DndContext sensors={sensors} collisionDetection={undefined} onDragEnd={handleDragEnd}>
        <div className="board">
          <SortableContext
            items={data.tiers.map(t => t.id)}
            strategy={rectSortingStrategy}
          >
            {data.tiers.sort((a, b) => a.order - b.order).map(tier => (
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
            setData(prev => prev
              ? { ...prev, items: prev.items.map(i => i.id === next.id ? next : i) }
              : prev)
          }
        />
      )}
    </div>
  );
}
