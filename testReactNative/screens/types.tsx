/* eslint-disable prettier/prettier */
export interface AppState {
  indexEvent: number | null;
  indexWheel: number | null;
}

export interface AppAction {
  type: string;
  payload?: any;
}