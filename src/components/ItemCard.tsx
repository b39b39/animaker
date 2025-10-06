import type { Item } from '../lib/types';

export default function ItemCard({
  item, editable, onOpen
}: {
  item: Item;
  editable: boolean;
  onOpen: () => void;
}) {
  return (
    <div className="item" id={item.id}>
      <img src={item.image} alt={item.title} />
      <div className="item-title">{item.title}</div>
      <div className="magnify" onClick={onOpen}>🔍</div>
      {editable && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(255,255,255,0.05)'
        }} />
      )}
    </div>
  );
}
