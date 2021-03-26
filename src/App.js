import React, { Fragment, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const App = () => {
  const [notesState, setNoteState] = useState([]);
  const [noteInput, setNoteInput] = useState('');
  const [subNoteInput, setSubNoteInput] = useState('');

  const [update, setUpdate] = useState(false);

  const [displayInputField, setDisplayInputField] = useState(false);

  const handleNoteSubmit = (e) => {
    e.preventDefault();
    const id = uuidv4();
    if (setNoteInput !== '') {
      setNoteState([...notesState, { title: noteInput, id, subNote: [] }]);
      setNoteInput('');
    }
  };

  const deleteNote = (id) => {
    const tempNotesState = notesState;
    tempNotesState.forEach((note, index) => {
      if (note.id === id) {
        tempNotesState.splice(index, 1);
        setNoteState(tempNotesState);
        setUpdate(!update);
      } else {
        if (note.subNote.length > 0) {
          const subNote = handleRecursiveSubNoteDelete(note.subNote, id);
          tempNotesState[index].subNote = subNote;
          setNoteState(tempNotesState);
          setUpdate(!update);
        }
      }
    });
  };

  const handleRecursiveSubNoteDelete = (sNote, id) => {
    const subNote = sNote;

    subNote.forEach((note, index) => {
      if (note.id === id) {
        subNote.splice(index, 1);
      } else {
        if (note.subNote.length > 0) {
          handleRecursiveSubNoteDelete(note.subNote, id);
        }
      }
    });
    return subNote;
  };

  const handleSubNoteSubmit = (id) => {
    const tempNotesState = notesState;

    tempNotesState.forEach((note, index) => {
      if (note.id === id) {
        tempNotesState[index].subNote.push({ title: subNoteInput, id: uuidv4(), subNote: [] });
        setNoteState(tempNotesState);
        setSubNoteInput('');
        setDisplayInputField(false);
      } else {
        if (note.subNote.length > 0) {
          const subNote = handleRecursiveSubNoteSubmit(note.subNote, id);
          tempNotesState[index].subNote = subNote;
          setNoteState(tempNotesState);
          setSubNoteInput('');
          setDisplayInputField(false);
        }
      }
    });
  };

  const handleRecursiveSubNoteSubmit = (sNote, id) => {
    const subNote = sNote;

    subNote.forEach((note, index) => {
      if (note.id === id) {
        subNote[index].subNote.push({ title: subNoteInput, id: uuidv4(), subNote: [] });
      } else {
        if (note.subNote.length > 0) {
          handleRecursiveSubNoteSubmit(note.subNote, id);
        }
      }
    });
    return subNote;
  };

  const ReturnNote = ({ note }) => (
    <Fragment key={note.id}>
      <hr />
      <ul>
        <li>{note.title}</li>
        <button
          type="submit"
          className="btn btn-warning"
          onClick={() => setDisplayInputField(note.id)}
        >
          New Note
        </button>
        &nbsp; &nbsp; &nbsp;
        <button type="submit" className="btn btn-danger" onClick={() => deleteNote(note.id)}>
          Delete
        </button>
        <br />
        <br />
        {note.id === displayInputField && (
          <div className="row">
         <form>
            <div className="col-8">
              <input
                placeholder="Type to make a Note"
                className="form-control"
                autoFocus={true}
                onChange={(e) => setSubNoteInput(e.target.value)}
                value={subNoteInput}
              />
            </div>
            <br />
            <div className="col-4">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={() => handleSubNoteSubmit(displayInputField)}
              >
                Submit
              </button>
            </div>
          </form>
          </div>
        )}
        {note.subNote &&
          note.subNote.length > 0 &&
          note.subNote.map((sNote) => <ReturnNote note={sNote} key={sNote.id} />)}
      </ul>
    </Fragment>
  );

  return (
    <div className="container">
      <div className="row mt-5 ">
        <div className="col-8">
          <input
            disabled={displayInputField}
            placeholder="Type to make a Note"
            className="form-control"
            onChange={(e) => setNoteInput(e.target.value)}
            value={noteInput}
          />
        </div>
        <br />
        <div className="col-4">
          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleNoteSubmit}
            disabled={displayInputField}
          >
            Submit
          </button>
        </div>
      </div>
      {notesState.length > 0 && notesState.map((note) => <ReturnNote note={note} key={note.id} />)}
    </div>
  );
};

export default App;
