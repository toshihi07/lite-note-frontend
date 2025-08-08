import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { apiRequest } from "../lib/api";

interface TodoItem {
  itemId: string;
  title: string;
  userId?: string;
}

interface FetchTodosResponse {
  items: TodoItem[];
}

export default function Todos() {
  const router = useRouter();
  const [items, setItems] = useState<TodoItem[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("id_token");
    if (!token) {
      router.push("/");
      return;
    }
    fetchTodos();
  }, [router]); // router を依存配列に追加

  const fetchTodos = async () => {
    try {
      const data = await apiRequest<FetchTodosResponse>("/hello", "GET");
      setItems(data.items || []);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("不明なエラーが発生しました");
      }
    }
  };

  const addTodo = async () => {
    if (!newTitle.trim()) return;
    await apiRequest("/hello", "POST", { title: newTitle });
    setNewTitle("");
    fetchTodos();
  };

  const updateTodo = async (itemId: string) => {
    const newText = prompt("新しいタイトルを入力", "Updated Title");
    if (!newText) return;
    await apiRequest("/hello", "PUT", { itemId, title: newText });
    fetchTodos();
  };

  const deleteTodo = async (itemId: string) => {
    if (!confirm("削除してよろしいですか？")) return;
    await apiRequest(`/hello?itemId=${itemId}`, "DELETE");
    fetchTodos();
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center p-8">
      <header className="w-full max-w-2xl flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold">LiteNote ToDo</h1>
        <button
          onClick={() => {
            localStorage.clear();
            router.push("/");
          }}
          className="border border-black px-4 py-1 rounded hover:bg-black hover:text-white transition"
        >
          ログアウト
        </button>
      </header>

      {error && <p className="text-red-500 mb-4">⚠️ {error}</p>}

      <div className="w-full max-w-2xl flex mb-6">
        <input
          type="text"
          className="flex-grow border border-black px-3 py-2 rounded-l"
          placeholder="新しいToDoを入力..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <button
          onClick={addTodo}
          className="bg-black text-white px-4 rounded-r hover:bg-gray-800 transition"
        >
          追加
        </button>
      </div>

      <div className="w-full max-w-2xl space-y-3">
        {items.map((item) => (
          <div
            key={item.itemId}
            className="border rounded-lg p-4 shadow flex justify-between items-center hover:shadow-md transition"
          >
            <div>
              <h3 className="text-lg font-semibold">
                {item.title || "(タイトルなし)"}
              </h3>
              <p className="text-gray-500 text-xs">🆔 {item.itemId}</p>
            </div>
            <div className="space-x-2">
              <button
                className="border px-3 py-1 rounded hover:bg-gray-100 transition"
                onClick={() => updateTodo(item.itemId)}
              >
                更新
              </button>
              <button
                className="border px-3 py-1 rounded text-red-600 hover:bg-red-100 transition"
                onClick={() => deleteTodo(item.itemId)}
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
