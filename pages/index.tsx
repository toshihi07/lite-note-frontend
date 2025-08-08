import { useEffect, useState } from "react";
import { redirectToCognitoLoginPKCE } from "../lib/auth";
import { apiRequest } from "../lib/api";

interface Todo {
  itemId: string;
  title: string;
  userId?: string;
}

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("id_token");
    if (t) {
      setToken(t);
      const payload = JSON.parse(atob(t.split(".")[1]));
      setEmail(payload.email);
      fetchTodos();
    }
  }, []);

  const handleLogin = () => redirectToCognitoLoginPKCE();
  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setEmail(null);
    setTodos([]);
  };

  const fetchTodos = async () => {
    try {
      const data = await apiRequest<{ items: Todo[] }>("/hello");
      setTodos(data.items || []);
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("不明なエラーが発生しました");
      }
    }
  };

  const addTodo = async () => {
    if (!newTitle.trim()) return alert("タイトルを入力してください");
    await apiRequest("/hello", "POST", { title: newTitle });
    setNewTitle("");
    fetchTodos();
  };

  const updateTodo = async (id: string, newTitle: string) => {
    await apiRequest(`/hello?itemId=${id}`, "PUT", { title: newTitle });
    fetchTodos();
  };

  const deleteTodo = async (id: string) => {
    if (confirm("削除しますか？")) {
      await apiRequest(`/hello?itemId=${id}`, "DELETE");
      fetchTodos();
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-4 sm:p-8">
      <header className="flex justify-between items-center mb-6 border-b pb-3">
        <h1 className="text-3xl font-extrabold">LiteNote</h1>
        {token ? (
          <button
            onClick={handleLogout}
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            ログアウト
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="px-3 py-1 bg-black text-white rounded"
          >
            ログイン
          </button>
        )}
      </header>

      {token ? (
        <div className="max-w-2xl mx-auto">
          {email && <p className="mb-4 text-gray-600">ログイン中: {email}</p>}

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="新しいToDoを入力..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 border rounded px-3 py-2"
            />
            <button
              onClick={addTodo}
              className="px-4 py-2 bg-black text-white rounded"
            >
              追加
            </button>
          </div>

          <div className="space-y-3">
            {todos.map((item) => (
              <TodoItem
                key={item.itemId}
                item={item}
                onUpdate={updateTodo}
                onDelete={deleteTodo}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">
          👋 ログインしてToDoを管理しましょう。
        </p>
      )}
    </div>
  );
}

interface TodoItemProps {
  item: Todo;
  onUpdate: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
}

function TodoItem({ item, onUpdate, onDelete }: TodoItemProps) {
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState(item.title);

  return (
    <div className="p-4 border rounded shadow-sm bg-white hover:shadow-md transition">
      {edit ? (
        <div className="flex gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 border px-2 py-1 rounded"
          />
          <button
            onClick={() => {
              setEdit(false);
              onUpdate(item.itemId, title);
            }}
            className="px-2 py-1 bg-black text-white rounded"
          >
            保存
          </button>
        </div>
      ) : (
        <h3 className="text-lg font-semibold">{title}</h3>
      )}
      <div className="text-xs text-gray-500">🆔 {item.itemId}</div>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => setEdit(true)}
          className="text-blue-600 text-sm"
        >
          ✏️ 編集
        </button>
        <button
          onClick={() => onDelete(item.itemId)}
          className="text-red-600 text-sm"
        >
          🗑️ 削除
        </button>
      </div>
    </div>
  );
}
