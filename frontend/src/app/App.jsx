import "./App.css";
import { Editor } from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import { useRef, useMemo, useState } from "react";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";
import { useEffect } from "react";

function App() {
  const editorRef = useRef(null);
  const [username, setUsername] = useState(() => {
    return new URLSearchParams(window.location.search).get("username") || "";
  });

  const [users, setusers] = useState([]);

  console.log("here is user connected list:", users);

  const ydoc = useMemo(() => new Y.Doc(), []);
  const ytext = useMemo(() => ydoc.getText("monaco"), [ydoc]);

  const handleMount = (editor) => {
    editorRef.current = editor;
    new MonacoBinding(
      ytext,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
    );
  };

  //provide.awareness is used to track the all the users connected with the same room or monaco editor

  const handleJoin = (e) => {
    e.preventDefault();
    setUsername(e.target.username.value);
    window.history.pushState({}, "", "?username=" + e.target.username.value);
  };

  useEffect(() => {
    if (username) {
      const provider = new SocketIOProvider("/", "monaco-room", ydoc, {
        autoConnect: true,
      });

      provider.awareness.setLocalStateField("user", { username });

      const states = Array.from(provider.awareness.getStates().values());
      setusers(
        states
          .filter((state) => state.user && state.user.username)
          .map((state) => state.user),
      );

      provider.awareness.on("change", () => {
        const states = Array.from(provider.awareness.getStates().values());
        setusers(
          states
            .filter((state) => state.user && state.user.username)
            .map((state) => state.user),
        );
      });

      function handleBeforeUnload() {
        provider.awareness.setLocalStateField("user", null);
      }

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        provider.disconnect();
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [username]);

  if (!username) {
    return (
      <main className="h-screen w-full bg-gray-950 flex items-center justify-center">
        <form
          onSubmit={handleJoin}
          className="flex flex-col gap-4 items-center"
        >
          <h1 className="text-3xl text-white">Enter your username</h1>
          <input
            type="text"
            placeholder="Username"
            className="p-2 rounded-lg"
            name="username"
            className="bg-gray-800 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
          <button className="bg-amber-300 p-2 rounded-lg">Enter</button>
        </form>
      </main>
    );
  }

  return (
    <>
      <main className="h-screen w-full bg-gray-950 flex gap-4 p-3">
        <aside className="h-full w-[20%] bg-amber-300 rounded-lg">
          <h2 className=""> Users</h2>
          <ul className="p-4">
            {users.map((user, index) => {
              return <li key={index}>{user.username}</li>;
            })}
          </ul>
        </aside>
        <section className="w-[80%] bg-amber-50 rounded-lg overflow-hidden ">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            defaultValue="// Write your code here"
            theme="vs-dark"
            onMount={handleMount}
          />
        </section>
      </main>
    </>
  );
}

export default App;
