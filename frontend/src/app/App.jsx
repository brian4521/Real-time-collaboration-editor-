import "./App.css";
import { Editor } from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import { useRef, useMemo } from "react";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";

function App() {
  const editorRef = useRef(null);

  const ydoc = useMemo(() => new Y.Doc(), []);
  const ytext = useMemo(() => ydoc.getText("monaco"), [ydoc]);

  const handleMount = (editor) => {
    editorRef.current = editor;
    const provider = new SocketIOProvider(
      "http://localhost:3000",
      "monaco-room",
      ydoc,
      { autoConnect: true },
    );
    const monacoBinding = new MonacoBinding(
      ytext,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      provider.awareness,
    );
  };

  return (
    <>
      <main className="h-screen w-full bg-gray-950 flex gap-4 p-3">
        <aside className="h-full w-[20%] bg-amber-300 rounded-lg"></aside>
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
