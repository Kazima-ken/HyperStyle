import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const materialSlice = createSlice({
  name: "material",
  initialState,
  reducers: {
    SetMaterial: (state, action) => {
      return action.payload;
    },
    CreateMaterial: (state, action) => {
      const data = action.payload;
      const newMaterial = {
        stt: state.length + 1,
        id: data.id,
        name: data.name,
        status: data.status,
      };
      state.unshift(newMaterial);
      state.forEach((item, index) => {
        item.stt = index + 1;
      });
    },
    UpdateMaterial: (state, action) => {
      const updatedMaterial = action.payload; // backend
      const index = state.findIndex(
        (period) => period.id === updatedMaterial.id
      );
      console.log(index);
      if (index !== -1) {
        state[index].name = updatedMaterial.name;
        state[index].status = updatedMaterial.status;
      }
    },
  },
});

export const { SetMaterial, CreateMaterial, UpdateMaterial } =
  materialSlice.actions;
export default materialSlice.reducer;
export const GetMaterial = (state) => state.material;
