import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const SoleSlice = createSlice({
  name: "sole",
  initialState,
  reducers: {
    SetSole: (state, action) => {
      return action.payload;
    },
    CreateSole: (state, action) => {
      const data = action.payload;
      const newSole = {
        stt: state.length + 1,
        id: data.id,
        name: data.name,
        status: data.status,
      };
      state.unshift(newSole);
      state.forEach((item, index) => {
        item.stt = index + 1;
      });
    },
    UpdateSole: (state, action) => {
      const updatedSole = action.payload; // backend
      const index = state.findIndex(
        (period) => period.id === updatedSole.id
      );
      console.log(index);
      if (index !== -1) {
        state[index].name = updatedSole.name;
        state[index].status = updatedSole.status;
      }
    },
  },
});

export const { SetSole, CreateSole, UpdateSole } =
  SoleSlice.actions;
export default SoleSlice.reducer;
export const GetSole = (state) => state.sole;
