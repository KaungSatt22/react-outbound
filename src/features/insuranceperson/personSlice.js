import { createSlice } from "@reduxjs/toolkit";

const initialState = { insuredPerson: {} };

const personSlice = createSlice({
  name: "person",
  initialState,
  reducers: {
    addInsuredPerson: (state, action) => {
      state.insuredPerson = action.payload;
    },
    resetInsuredPerson: (state) => {
      state.insuredPerson = {};
    },
  },
});

export const { addInsuredPerson, resetInsuredPerson } = personSlice.actions;

export const insuredPersonState = (state) => state.person;

export default personSlice.reducer;
