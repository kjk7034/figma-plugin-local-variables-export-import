import {
  ExportFile,
  ExportVariableCollections,
  ExportVariables,
  TempIds,
  VariableCollectionMode,
} from "./types";

export function exportToJSON() {
  const variables = figma.variables.getLocalVariables();
  const collections = figma.variables.getLocalVariableCollections();

  const files = {
    variables: {} as ExportVariables,
    collections: {} as ExportVariableCollections,
  };

  variables.forEach((variable) => {
    files.variables[`${variable.id}`] = {
      id: variable.id,
      key: variable.key,
      name: variable.name,
      resolvedType: variable.resolvedType,
      valuesByMode: variable.valuesByMode,
      variableCollectionId: variable.variableCollectionId,
    };
  });

  collections.forEach((collection) => {
    const modes: Record<string, VariableCollectionMode> = {};

    collection.modes.forEach((mode) => {
      modes[mode.modeId] = mode;
    });

    files.collections[`${collection.id}`] = {
      id: collection.id,
      defaultModeId: collection.defaultModeId,
      key: collection.key,
      modes: modes,
      name: collection.name,
      variableIds: collection.variableIds,
    };
  });

  figma.ui.postMessage({ type: "EXPORT_RESULT", files });
}

function createCollections(
  collections: ExportVariableCollections,
  tempIds: TempIds
) {
  Object.entries(collections).forEach(([, object]) => {
    const collection = figma.variables.createVariableCollection(
      `${object.name}`
    );
    collection.renameMode(
      collection.modes[0].modeId,
      object.modes[object.defaultModeId!].name
    );
    tempIds.mode[object.defaultModeId!] = collection.modes[0].modeId;
    delete object.modes[object.defaultModeId!];
    Object.entries(object.modes).forEach(([id, mode]) => {
      const modeId = collection.addMode(mode.name);
      tempIds.mode[id] = modeId;
    });
    tempIds.collections[object.id!] = collection.id;
  });
}

function createVariables(variables: ExportVariables, tempIds: TempIds) {
  Object.entries(variables).forEach(([, object]) => {
    const variable = figma.variables.createVariable(
      object.name!,
      tempIds.collections[object.variableCollectionId!],
      object.resolvedType!
    );
    tempIds.variables[object.id!] = variable.id;
  });
}

function setValuesForModes(variables: ExportVariables, tempIds: TempIds) {
  Object.entries(variables).forEach(([, object]) => {
    const variableId = tempIds.variables[object.id!];
    const variableInstance = figma.variables.getVariableById(variableId);

    if (variableInstance) {
      Object.entries(object.valuesByMode!).forEach(([modeId, mode]) => {
        const modeValue = isVariableAlias(mode)
          ? ({
              type: "VARIABLE_ALIAS",
              id: tempIds.variables[mode.id],
            } as VariableAlias)
          : mode;

        variableInstance.setValueForMode(tempIds.mode[modeId], modeValue);
      });
    }
  });
}

// 타입 가드 함수
function isVariableAlias(value: VariableValue): value is VariableAlias {
  return (value as VariableAlias).type === "VARIABLE_ALIAS";
}

// function clearCollections() {
//   const collections = figma.variables.getLocalVariableCollections();
//   collections.forEach((collection) => {
//     collection.remove();
//   });
// }

export function importJSONFile(body: string) {
  const { collections, variables } = JSON.parse(body) as ExportFile;

  const tempIds = {
    mode: {},
    variables: {},
    collections: {},
  } as TempIds;

  /** 테스트 시 초기화를 위해서 사용 */
  //   clearCollections();

  /** Collection 생성 */
  createCollections(collections, tempIds);

  /** Variable 생성 */
  createVariables(variables, tempIds);

  /** setValuesForMode를 이용하여 내부 값 연동 */
  setValuesForModes(variables, tempIds);

  figma.ui.postMessage({ type: "IMPORT_SUCCESS" });
}
