'use client';

import { useState } from 'react';

export interface DraggableListProps<T extends { id: number }> {
  items: T[];
  onReorder: (reordered: T[]) => void;
  onEdit: (item: T) => void;
  onDelete: (id: number) => void;
  renderItem: (item: T) => React.ReactNode;
  saving?: boolean;
  orderEndpoint: string;
}

export function DraggableList<T extends { id: number }>({
  items,
  onReorder,
  onEdit,
  onDelete,
  renderItem,
  saving = false,
  orderEndpoint,
}: DraggableListProps<T>) {
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);

  function handleDragStart(e: React.DragEvent, id: number) {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(id));
    e.dataTransfer.setData('application/json', JSON.stringify({ id }));
  }

  function handleDragOver(e: React.DragEvent, id: number) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedId !== null && draggedId !== id) setDragOverId(id);
  }

  function handleDragLeave() {
    setDragOverId(null);
  }

  function handleDrop(e: React.DragEvent, dropTargetId: number) {
    e.preventDefault();
    setDragOverId(null);
    setDraggedId(null);
    const id = draggedId ?? Number(e.dataTransfer.getData('text/plain'));
    if (Number.isNaN(id) || id === dropTargetId) return;
    const fromIndex = items.findIndex((i) => i.id === id);
    const toIndex = items.findIndex((i) => i.id === dropTargetId);
    if (fromIndex === -1 || toIndex === -1) return;
    const next = [...items];
    const [removed] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, removed);
    fetch(orderEndpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ ids: next.map((i) => i.id) }),
    })
      .then((r) => (r.ok ? r.json() : r.json().then((d) => Promise.reject(new Error(d.error)))))
      .then(() => onReorder(next))
      .catch(() => onReorder(items));
  }

  function handleDragEnd() {
    setDraggedId(null);
    setDragOverId(null);
  }

  return (
    <ul className="admin-list admin-draggable-list">
      {items.map((item) => (
        <li
          key={item.id}
          className={`admin-list-item ${draggedId === item.id ? 'admin-dragging' : ''} ${dragOverId === item.id ? 'admin-drag-over' : ''}`}
          draggable
          onDragStart={(e) => handleDragStart(e, item.id)}
          onDragOver={(e) => handleDragOver(e, item.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, item.id)}
          onDragEnd={handleDragEnd}
        >
          <span className="admin-drag-handle" title="Drag to reorder">⋮⋮</span>
          <span className="admin-list-item-content">{renderItem(item)}</span>
          <div className="admin-item-actions">
            <button type="button" onClick={() => onEdit(item)} disabled={saving}>Edit</button>
            <button type="button" onClick={() => onDelete(item.id)} disabled={saving}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
