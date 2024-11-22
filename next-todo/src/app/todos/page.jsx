'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TodoItem from '@/components/TodoItem';
import TodoForm from '@/components/TodoForm';

export default function TodoList() {
  const router = useRouter();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/todos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (title) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      });
      if (!response.ok) throw new Error('Failed to add todo');
      const newTodo = await response.json();
      setTodos([newTodo, ...todos]);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleToggle = async (id, completed) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed }),
      });
      if (!response.ok) throw new Error('Failed to update todo');
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed } : todo
        )
      );
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete todo');
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return <div className="text-center mt-8">加载中...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">待办事项列表</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          退出登录
        </button>
      </div>
      <TodoForm onAdd={handleAdd} />
      <div className="space-y-2">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            {...todo}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </div>
      {todos.length === 0 && (
        <p className="text-center text-gray-500 mt-4">暂无待办事项</p>
      )}
    </div>
  );
}