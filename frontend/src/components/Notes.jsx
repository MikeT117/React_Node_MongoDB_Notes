import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import Note from "./Note";
import { apiNotes } from "../api";

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  @media (max-width: 12000px) {
    justify-content: flex-start;
  }
  padding: 0 1.5em;
  @media (max-width: 900px) {
    justify-content: space-evenly;
  }
`;

const Notes = ({ searchTerm }) => {
  const notes = useSelector(state => state.rootReducer.notes.allNotes);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(apiNotes());
  }, [dispatch]);

  return (
    <Wrapper>
      {notes &&
        notes
          .filter(
            d =>
              d.title.toLowerCase().includes(searchTerm) ||
              d.body.toLowerCase().includes(searchTerm)
          )
          .map(d => (
            <Note
              key={d._id || d.tempId}
              title={d.title}
              body={d.body}
              onClick={() => dispatch({ type: "EDITOR_EXISTING", payload: d })}
            />
          ))}
    </Wrapper>
  );
};

export default Notes;
