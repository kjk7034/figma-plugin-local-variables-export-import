export type ExportFile = {
  variables: ExportVariables;
  collections: ExportVariableCollections;
};

export type ExportVariables = {
  [name: string]: Partial<Variable> & { originalVariableId?: string };
};

export type VariableCollectionMode = {
  modeId: string;
  name: string;
};

export type ExportVariableCollections = {
  [id: string]: Omit<Partial<VariableCollection>, "modes"> & {
    modes: Record<string, VariableCollectionMode>;
  };
};

export type TempIds = {
  mode: {
    [originModeId: string]: string;
  };
  variables: {
    [originVariableId: string]: string;
  };
  collections: {
    [originCollectionId: string]: string;
  };
};
