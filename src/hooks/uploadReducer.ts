export type UploadReducer = {
  file: File;
  title: string;
  keywords: string[];
}[];

export enum actionsUploadEnum {
  UPLOAD = 'UPLOAD',
  CHANGETITLE = 'CHANGETITLE',
  CHANGEKEYWORDS = 'CHANGEKEYWORDS',
}
type UploadAction = {
  type: actionsUploadEnum;
  payload?: number;
  files?: FileList | null;
  text?: string;
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
            keywords: [],
          });
        });
      }
      break;
    case actionsUploadEnum.CHANGETITLE:
      if (typeof action.payload === 'number') {
        newState[action.payload].title = action.text ?? '';
      }
      break;
    default:
      throw new Error();
  }

  return newState;
}
