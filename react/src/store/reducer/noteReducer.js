import { createSlice } from '@reduxjs/toolkit'

const note = createSlice({
  name: 'note',
  initialState: {
    noteDocs: null,
  },
  reducers: {
    allNote(state, action) {
      state.noteDocs = action.payload;
    },
    addNote(state, action) {
      state.noteDocs.docs.push(action.payload);
    },
    updateNote(state, action) {
      const index = state.noteDocs.docs.findIndex(item => item._id === action.payload._id)
      state.noteDocs.docs[index] = action.payload
    },
    deleteNote(state, action) {
      const { index } = action.payload;
      state.noteDocs.docs = state.noteDocs.docs.filter((item, key) => key !== index);
    }
  }
})

export const { allNote, addNote, updateNote, deleteNote } = note.actions

export default note.reducer