import path from 'path';

type Keywords = { name: string }[];

export type UploadReducer = {
  file: File;
  title: string;
  keywords: Keywords;
}[];

export enum actionsUploadEnum {
  UPLOAD = 'UPLOAD',
  REMOVEUPLOAD = 'REMOVEUPLOAD',
  CHANGETITLE = 'CHANGETITLE',
  DELETEKEYWORD = 'DELETEKEYWORD',
  NEWKEYWORD = 'NEWKEYWORD',
}
type UploadAction = {
  type: actionsUploadEnum;
  payload?: number;
  files?: FileList | null;
  text?: string;
  keywordName?: string;
  defaultKeywords?: Keywords;
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
          if (!file.type.includes('image') || !action.defaultKeywords) return;

          console.log();
          newState.push({
            file,
            title: path.parse(file.name).name,
            keywords: action.defaultKeywords,
          });
        });
      }
      break;
    case actionsUploadEnum.REMOVEUPLOAD:
      if (typeof action.payload === 'number') {
        newState.splice(action.payload, 1);
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
    case actionsUploadEnum.NEWKEYWORD:
      if (action.keywordName && typeof action.payload === 'number') {
        const sameKeyword = newState[action.payload].keywords
          .map((words) => words.name)
          .indexOf(action.keywordName);

        sameKeyword === -1 &&
          newState[action.payload].keywords.push({ name: action.keywordName });
        break;
      }
    default:
      throw new Error();
  }

  return newState;
}
