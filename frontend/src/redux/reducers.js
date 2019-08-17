import { combineReducers } from "redux";

const initialState = {
  notes: {
    allNotes: [],
    updated: [],
    new: [],
    deleted: []
  },
  syncing: {
    synced: true,
    syncFailure: false
  },
  editor: {
    note: false
  },
  user: {
    isLoggedIn: false
  }
};

const editorReducer = (state = initialState, action) => {
  switch (action.type) {
    case "EDITOR_NEW":
      return {
        ...state,
        note: { title: "", body: "", tempId: Math.random(), new: true }
      };
    case "EDITOR_EXISTING":
      return { ...state, note: { ...action.payload, new: false } };
    case "EDITOR_UPDATE":
      return { ...state, note: { ...state.note, ...action.payload } };
    case "EDITOR_SAVE_EXISTING":
      if (action.payload.new) {
        return {
          ...state,
          new: state.new.map(d =>
            d.tempId === action.payload.tempId ? action.payload : d
          ),
          allNotes: state.allNotes.map(d =>
            d.tempId === action.payload.tempId ? action.payload : d
          )
        };
      }
      return {
        ...state,
        updated: [...state.updated, action.payload],
        allNotes: state.allNotes.map(d =>
          d._id === action.payload._id ? action.payload : d
        )
      };
    case "EDITOR_SAVE_NEW":
      console.log(state);
      return {
        ...state,
        new: [...state.new, action.payload],
        allNotes: [...state.allNotes, action.payload]
      };
    case "EDITOR_CLOSE":
      return { ...state, note: false };
    default:
      return state;
  }
};

const syncReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SYNC_NEW":
      return {
        ...state,
        new: state.new.filter(d => d.tempId !== action.payload)
      };
    case "SYNC_UPDATED":
      return {
        ...state,
        updated: state.updated.filter(d => d._id !== action.payload)
      };
    case "SYNC_DELETED":
      return {
        ...state,
        deleted: state.deleted.filter(d => d._id !== action.payload)
      };
    default:
      return state;
  }
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "DELETE_NOTE":
    case "LOAD_NOTES":
      return { ...state, notes: notesReducer(state.notes, action) };

    case "LOGIN":
    case "REAUTH":
    case "UPDATE_AVATAR":
      return { ...state, user: userReducer(state.user, action) };

    case "SYNC_NEW":
    case "SYNC_UPDATED":
    case "SYNC_DELETED":
      return { ...state, notes: syncReducer(state.notes, action) };

    case "EDITOR_NEW":
    case "EDITOR_EXISTING":
    case "EDITOR_UPDATE":
    case "EDITOR_CLOSE":
      return { ...state, editor: editorReducer(state.editor, action) };

    case "EDITOR_SAVE_EXISTING":
    case "EDITOR_SAVE_NEW":
      return { ...state, notes: editorReducer(state.notes, action) };

    case "LOGOUT":
      return { ...initialState };
    default:
      return state;
  }
};

const notesReducer = (state = initialState.notes, action) => {
  switch (action.type) {
    case "DELETE_NOTE":
      if (
        state.new.filter(d => d.tempId === action.payload.tempId).length > 0
      ) {
        return {
          ...state,
          allNotes: state.allNotes.filter(
            d => d.tempId !== action.payload.tempId
          ),
          new: state.new.filter(d => d.tempId !== action.payload.tempId)
        };
      } else if (
        state.updated.filter(d => d._id !== action.payload._id).length > 0
      ) {
        return {
          ...state,
          allNotes: state.allNotes.filter(d => d._id !== action.payload._id),
          updated: state.updated.filter(d => d._id !== action.payload._id)
        };
      }
      return {
        ...state,
        allNotes: state.allNotes.filter(d => d._id !== action.payload._id),
        deleted: [...state.deleted, action.payload]
      };
    case "LOAD_NOTES":
      return { ...state, allNotes: [...action.payload] };
    default:
      return state;
  }
};

const userReducer = (state = initialState.user, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, isLoggedIn: true, ...action.payload };
    case "REAUTH":
      return { ...state, isLoggedIn: false };
    case "UPDATE_AVATAR":
      return { ...state, avatar: action.payload };
    default:
      return state;
  }
};

export default combineReducers({
  rootReducer
});
