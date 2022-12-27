type Keywords = { name: string; id?: string }[];

export type UploadReducer = {
  file: File;
  title: string;
  keywords: Keywords;
}[];

export enum actionsUploadEnum {
  UPLOAD = 'UPLOAD',
  CHANGETITLE = 'CHANGETITLE',
  DELETEKEYWORD = 'DELETEKEYWORD',
}
type UploadAction = {
  type: actionsUploadEnum;
  payload?: number;
  files?: FileList | null;
  text?: string;
  keywordName?: string;
};

export function uploadReducer(
  state: UploadReducer,
  action: UploadAction
): UploadReducer {
  const newState = structuredClone(state);

  switch (action.type) {
    case actionsUploadEnum.UPLOAD:
      if (action.files) {
        Array.from(action.files).forEach((file) => {
          newState.push({
            file,
            title: file.name,
            keywords: [
              { id: 'eweweqeas', name: 'teste1dasdsadasdsad' },
              { id: 'eweweqe2as', name: 'teste2' },
              { id: 'eweweq1eas', name: 'tesdsadasdzste3' },
              { id: 'eweweq2eas', name: 'teste4' },
              {
                id: 'ewewaeqeas',
                name: 'texczxcxzczzsdwdwdawaed waddwa wdawds ste5',
              },
              { name: 'teste6' },
            ],
          });
        });
      }
      break;
    case actionsUploadEnum.CHANGETITLE:
      if (typeof action.payload === 'number') {
        newState[action.payload].title = action.text ?? '';
      }
      break;
    case actionsUploadEnum.DELETEKEYWORD:
      if (action.keywordName && typeof action.payload === 'number') {
        const deleteIdx = newState[action.payload].keywords
          .map((words) => words.name)
          .indexOf(action.keywordName);

        deleteIdx > -1 &&
          newState[action.payload].keywords.splice(deleteIdx, 1);
      }
      break;
    default:
      throw new Error();
  }

  return newState;
}
