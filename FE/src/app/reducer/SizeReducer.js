import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const SizeSlice = createSlice({
  name: "size",
  initialState,
  reducers: {
    SetSize: (state, action) => {
      return action.payload;
    },
    CreateSize: (state, action) => {
      const data = action.payload;
      const newSize = {
        stt: state.length + 1,
        id: data.id,
        name: data.name,
        status: data.status,
      };
      state.unshift(newSize);
      state.forEach((item, index) => {
        item.stt = index + 1;
      });
    },
    UpdateSize: (state, action) => {
      const updatedSize = action.payload; // backend
      const index = state.findIndex(
        (period) => period.id === updatedSize.id
      );
      console.log(index);
      if (index !== -1) {
        state[index].name = updatedSize.name;
        state[index].status = updatedSize.status;
      }
    },
  },
});

export const { SetSize, CreateSize, UpdateSize } =
  SizeSlice.actions;
export default SizeSlice.reducer;
export const GetSize = (state) => state.size;
