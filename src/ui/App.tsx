import { useEffect, useState } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import { download, readFile } from "./utils";

import "./App.css";

function App() {
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    window.onmessage = ({ data: { pluginMessage } }) => {
      switch (pluginMessage.type) {
        case "EXPORT_RESULT":
          download(pluginMessage.files);
          setLoading(false);
          break;
        case "IMPORT_SUCCESS":
          setLoading(false);
          break;
      }
    };
  }, []);

  const postMessageExport = () => {
    setLoading(true);
    parent.postMessage({ pluginMessage: { type: "EXPORT" } }, "*");
  };

  const handleImport = async (file: Blob) => {
    try {
      const fileContent = await readFile(file);
      parent.postMessage(
        {
          pluginMessage: {
            body: fileContent,
            type: "IMPORT",
          },
        },
        "*"
      );
    } catch (error) {
      console.error("Error reading file:", error);
      setLoading(false);
    }
  };

  const postMessageImport = () => {
    setLoading(true);
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;

    if (fileInput.files && fileInput.files.length > 0) {
      handleImport(fileInput.files[0]);
    } else {
      console.error("No file selected.");
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <h1>Local variables Export & Import</h1>
      {isLoading && <LoadingSpinner />}

      <section>
        <h2>Export</h2>
        <p>Local variables을 .json 파일로 다운로드</p>
        <button onClick={postMessageExport}>다운로드</button>
      </section>

      <section>
        <h2>Import</h2>
        <p>기존에 다운로드한 파일을 불러온 후 프로젝트에 적용</p>
        <input type="file" id="fileInput" accept=".json" />
        <button onClick={postMessageImport}>적용하기</button>
      </section>
    </div>
  );
}

export default App;
