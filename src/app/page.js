/**
 * Next.js 與 React 基礎概念解析
 *
 * 【Next.js 基礎知識】
 * Next.js 是一個基於 React 的全端開發框架，提供了許多內建功能：
 * 1. 自動路由：基於文件系統的路由
 * 2. 服務器端渲染 (SSR)
 * 3. 靜態網站生成 (SSG)
 * 4. API 路由
 * 5. 自動代碼分割
 *
 * 推薦學習資源：
 * - Next.js 官方文檔：https://nextjs.org/docs
 * - Next.js 學習課程：https://nextjs.org/learn
 *
 * 【React 基礎知識】
 * React 是一個用於構建用戶界面的 JavaScript 庫：
 * 1. 組件 (Components)：UI 的基本構建塊
 * 2. Props：組件間傳遞數據的方式
 * 3. State：組件內部的數據狀態
 * 4. Hooks：在函數組件中使用狀態和副作用
 *
 * 推薦學習資源：
 * - React 官方文檔：https://react.dev
 * - React Hooks 文檔：https://react.dev/reference/react/hooks
 */

// 【'use client' 指令詳解】
// Next.js 13+ 引入了 React Server Components 概念：
// 1. 服務器組件（默認）：在服務器端渲染，減少客戶端 JavaScript
// 2. 客戶端組件：需要使用 'use client' 指令，可以使用瀏覽器 API 和交互功能
//
// 學習資源：https://nextjs.org/docs/getting-started/react-essentials
'use client';

// 【重要依賴導入】
// 1. next/image：Next.js 的優化圖片組件
//    - 自動圖片優化
//    - 延遲加載
//    - 防止佈局偏移
// 2. useState：React 的狀態管理 Hook
//    - 用於在函數組件中管理狀態
//    - 返回當前狀態和更新函數
// 3. TaskList：自定義組件
//    - 遵循組件組合原則
//    - 實現關注點分離
import Link from "next/link";
import { useState ,useEffect} from "react";
import TaskList from "./components/TaskList";

// 【主頁組件】
// 在 Next.js 中，app/page.js 是應用的默認首頁
// 使用 export default 導出作為主組件
export default function Home() {
  // 【React Hooks - useState 詳解】
  // useState 是最基本的 React Hook
  // 語法：const [state, setState] = useState(initialValue)
  //
  // 1. tasks 數組：存儲所有任務
  //    - 初始值為空數組 []
  //    - 符合 React 不可變性原則
  const[tasks,setTasks]=useState([]);
  
  // 2. newTask 字符串：存儲輸入框的當前值
  //    - 實現受控組件模式
  //    - 狀態與 UI 同步
  const [newTask,setNewTask]=useState('');
  const [nextId,setNextId]=useState(1);
  useEffect(()=>{
    const savedTasks=JSON.parse(localStorage.getItem('tasks'))||[];
    setTasks(savedTasks);
    const maxId=savedTasks.reduce((max,task)=>Math.max(max,task.id),0);
    setNextId(maxId+1);
  },[]);
  // 【事件處理函數】
  // addTask 函數：添加新任務到列表
  // 1. 使用展開運算符 (...) 創建新數組
  // 2. 保持數據不可變性
  // 3. 使用 setState 更新狀態
  const addTask=()=>{
    console.log("Before:",tasks);
    console.log("NewTask:",newTask);
    const newTaskObj={
      id:nextId,
      title:newTask,
      description:'',

    };


    // 創建新數組而不是修改原數組
    // 這是 React 中操作數組的最佳實踐
    const updatedTasks=[...tasks,newTaskObj];
    setTasks(updatedTasks);
    console.log("After:",updatedTasks);
    // 重置輸入框
    setNewTask('');
    setNextId(nextId+1);
    localStorage.setItem('tasks',JSON.stringify(updatedTasks));
  };
  const handleDelete=(id)=>{
      const newTasks=tasks.filter((task)=>task.id!==id);
      setTasks (newTasks);
      localStorage.setItem('tasks',JSON.stringify(newTasks));
  }
  // 【JSX 語法與 React 渲染】
  // JSX 允許在 JavaScript 中寫 HTML 類似的代碼
  // 1. className 代替 class（因為 class 是 JS 關鍵字）
  // 2. 使用大括號 {} 插入 JavaScript 表達式
  // 3. 所有標籤必須關閉
  return (
    // 【Tailwind CSS 樣式】
    // Tailwind 是一個實用優先的 CSS 框架
    // p-4：padding: 1rem
    <main className="p-4 max-w-md mx-auto">
      {/* 頁面標題 */}
      <h1 className="text-2xl font bold">Task Board</h1>

      {/* 輸入區域容器 */}
      {/* flex：彈性布局 */}
      {/* gap-2：間距 0.5rem */}
      {/* mb-4：底部外邊距 1rem */}
      <div className="flex gap-2 mb-4">
        {/* 【受控組件模式】
         * 在 React 中，表單元素通常使用受控組件模式：
         * 1. value 屬性綁定到 state
         * 2. onChange 事件更新 state
         * 3. React 控制輸入框的值
         */}
        <input
          className="border p-2 flex-1"
          placeholder="Enter a task"
          value={newTask}
          onChange={(e)=>setNewTask(e.target.value)}
        />
        {/* 添加按鈕 */}
        {/* onClick 事件綁定到 addTask 函數 */}
        <button
          className="bg-blue-500 text-white px-4"
          onClick={addTask}
        >
          Add
        </button>
      </div>

      {/* 【組件組合】
       * TaskList 是一個子組件，通過 props 接收數據
       * 1. 將 tasks 數組作為 prop 傳遞
       * 2. 實現組件複用
       * 3. 保持代碼模塊化
       */}
      <TaskList tasks={tasks} onDelete={handleDelete}/>
    </main>
  );
}

/**
 * 【進階學習主題】
 * 1. React 生命周期和 useEffect Hook
 *    - https://react.dev/reference/react/useEffect
 *
 * 2. React 性能優化
 *    - https://react.dev/learn/render-and-commit
 *
 * 3. Next.js 數據獲取
 *    - https://nextjs.org/docs/app/building-your-application/data-fetching
 *
 * 4. React 狀態管理進階
 *    - Context API：https://react.dev/reference/react/useContext
 *    - Redux：https://redux.js.org/
 *    - Zustand：https://github.com/pmndrs/zustand
 */
