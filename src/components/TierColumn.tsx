import { useDroppable } from '@dnd-kit/core';
import ItemCard from './ItemCard';
import type { Item, Tier } from '../lib/types';

export default function TierColumn({
  tier, items, editable, onOpen
}: {
  tier: Tier;
  items: Item[];
  editable: boolean;
  onOpen: (item: Item) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: tier.id });
  return (
    <div
      className="tier"
      ref={setNodeRef}
      style={{ outline: isOver ? `2px solid ${tier.color}` : 'none' }}
    >
      <div className="tier-header">
        <span className="tier-label">{tier.label}</span>
        <span className="tier-color-dot" style={{ background: tier.color }} />
      </div>
      <div style={{ padding: 10, minHeight: 100 }}>
        {items.map(it => (
          <ItemCard key={it.id} item={it} onOpen={() => onOpen(it)} editable={editable} />
        ))}
      </div>
    </div>
  );
}
