import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import appReducer from "./reducers";
import { loadState, saveState } from "./persistence";

const persistedState = loadState();

const store = createStore(
  appReducer,
  persistedState,
  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

store.subscribe(() => saveState(store.getState()));

export default store;
