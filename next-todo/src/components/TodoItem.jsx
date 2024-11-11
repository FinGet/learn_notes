'use client';

export default function TodoItem({ id, title, completed, onToggle, onDelete }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow mb-2">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => onToggle(id, e.target.checked)}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <span className={`ml-3 ${completed ? 'line-through text-gray-500' : ''}`}>
          {title}
        </span>
      </div>
      <button
        onClick={() => onDelete(id)}
        className="text-red-600 hover:text-red-800"
      >
        删除
      </button>
    </div>
  );
}