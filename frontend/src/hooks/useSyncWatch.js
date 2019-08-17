import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { apiDeleteNote, apiSaveNote, apiUpdateNote } from "../api";

const useSyncWatch = () => {
  const updated = useSelector(state => state.rootReducer.notes.updated);
  const deleted = useSelector(state => state.rootReducer.notes.deleted);
  const newNotes = useSelector(state => state.rootReducer.notes.new);

  const dispatch = useCallback(useDispatch(), []);

  const newSync = useCallback(() => {
    newNotes.length > 0 &&
      newNotes.map(d => {
        dispatch(apiSaveNote(d));
        return null;
      });
  }, [newNotes, dispatch]);

  const updatedSync = useCallback(() => {
    updated.length > 0 && updated.map(d => dispatch(apiUpdateNote(d)));
  }, [updated, dispatch]);

  const deletedSync = useCallback(() => {
    deleted.length > 0 && deleted.map(d => dispatch(apiDeleteNote(d)));
  }, [deleted, dispatch]);

  useEffect(() => newSync(), [newSync]);
  useEffect(() => updatedSync(), [updatedSync]);
  useEffect(() => deletedSync(), [deletedSync]);

  const forceSync = () => {
    newSync();
    updatedSync();
    deletedSync();
  };

  return [forceSync];
};

export default useSyncWatch;
