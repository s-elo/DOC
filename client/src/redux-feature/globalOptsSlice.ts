/* eslint-disable @typescript-eslint/no-unsafe-return */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '@/store';
import { localStore, changeTheme } from '@/utils/utils';

export interface GlobalOptsPayload {
  keys: ('anchor' | 'isDarkMode' | 'isEditorBlur' | 'menuCollapse' | 'mirrorCollapse' | 'readonly')[];
  values: (boolean | string)[];
}

export interface GlobalOptsType {
  isDarkMode: boolean;
  readonly: boolean;
  menuCollapse: boolean;
  mirrorCollapse: boolean;
  isEditorBlur: boolean;
  anchor: string;
}

const initialTheme = localStore('theme').value;
changeTheme(initialTheme ? initialTheme : 'dark');

const initialState: GlobalOptsType = {
  isDarkMode: initialTheme === 'dark' ? true : false,
  readonly: true,
  menuCollapse: true,
  mirrorCollapse: true,
  isEditorBlur: true,
  anchor: '',
};

export const globalOptsSlice = createSlice({
  name: 'globalOpts',
  initialState,
  reducers: {
    // only for boolean type update
    updateGlobalOpts: (state, action: PayloadAction<GlobalOptsPayload>) => {
      const { keys, values } = action.payload;

      for (const [idx, key] of keys.entries()) {
        if (key === 'anchor') {
          state[key] = values[idx] as string;
        } else {
          state[key] = values[idx] as boolean;
        }

        if (key === 'isDarkMode') {
          const { setStore: setTheme } = localStore('theme');
          changeTheme(!values[idx] ? 'light' : 'dark');
          setTheme(!values[idx] ? 'light' : 'dark');
        }
      }
    },
  },
});

export const { updateGlobalOpts } = globalOptsSlice.actions;

export const selectGlobalOpts = (state: RootState) => state.globalOpts;

export const selectDocGlobalOpts = (state: RootState) => {
  const { isDarkMode, readonly, anchor } = state.globalOpts;
  return { isDarkMode, readonly, anchor };
};

export const selectMenuCollapse = (state: RootState) => state.globalOpts.menuCollapse;

export const selectDarkMode = (state: RootState) => state.globalOpts.isDarkMode;
export const selectReadonly = (state: RootState) => state.globalOpts.readonly;
export const selectAnchor = (state: RootState) => state.globalOpts.anchor;

export default globalOptsSlice.reducer;
