export function download(files: unknown) {
  const jsonString = JSON.stringify(files, null, 2);

  // JSON 문자열을 파일로 저장
  const blob = new Blob([jsonString], { type: "application/json" });
  const fileName = "project-local-variables.json";
  const downloadLink = document.createElement("a");

  downloadLink.href = window.URL.createObjectURL(blob);
  downloadLink.download = fileName;

  // 링크를 클릭하여 다운로드 시작
  downloadLink.click();
}

export function readFile(file: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => resolve(event?.target?.result);
    reader.onerror = (error) => reject(error);

    reader.readAsText(file);
  });
}
