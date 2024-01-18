import { exportToJSON, importJSONFile } from "./utils";

figma.showUI(__html__, {
  width: 600,
  height: 500,
});

figma.ui.onmessage = (e) => {
  if (e.type === "IMPORT") {
    importJSONFile(e.body);
  } else if (e.type === "EXPORT") {
    exportToJSON();
  }
};
