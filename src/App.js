import React, { Fragment, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const App = () => {
  const [notesState, setNoteState] = useState([]);
  const [noteInput, setNoteInput] = useState('');
  const [subNoteInput, setSubNoteInput] = useState('');

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
    setNoteState(notesState.filter((item) => item.id !== id));
  };

  const handleSubNoteSubmit = (id) => {
    const tempNotesState = notesState.map((note) =>
      note.id === id
        ? { ...note, subNote: [...note.subNote, { title: subNoteInput, id: uuidv4() }] }
        : note
    );
    setNoteState(tempNotesState);
    setSubNoteInput('');
    setDisplayInputField(false);
  };

  const deleteSubNote = (parentId, noteId) => {
    const tempNotesState = notesState.map((note) =>
      note.id === parentId
        ? { ...note, subNote: note.subNote.filter((n) => n.id !== noteId) }
        : note
    );
    setNoteState(tempNotesState);
  };

  const ReturnSubNote = ({ note, parentId }) => (
    <Fragment key={note.id}>
      <br />
      <ul key={note.id}>
        <li>{note.title}</li>
        <button
          type="submit"
          class="btn btn-danger"
          onClick={() => deleteSubNote(parentId, note.id)}
        >
          Delete
        </button>
      </ul>
    </Fragment>
  );

  const ReturnNote = ({ note }) => (
    <Fragment key={note.id}>
      <br />
      <hr />
      <ul>
        <li>{note.title}</li>
        <button type="submit" class="btn btn-warning" onClick={() => setDisplayInputField(note.id)}>
          New Note
        </button>
        &nbsp; &nbsp; &nbsp;
        <button type="submit" class="btn btn-danger" onClick={() => deleteNote(note.id)}>
          Delete
        </button>
        <br />
        <br />
        {note.id === displayInputField && (
          <div className="row">
            <div className="col-8">
              <input
                placeholder="Type to make a Note"
                class="form-control"
                autoFocus={true}
                onChange={(e) => setSubNoteInput(e.target.value)}
                value={subNoteInput}
              />
            </div>
            <br />
            <div className="col-4">
              <button
                type="submit"
                class="btn btn-primary"
                onClick={() => handleSubNoteSubmit(note.id)}
              >
                Submit
              </button>
            </div>
          </div>
        )}
        {note.subNote.map((sNote) => (
          <ReturnSubNote note={sNote} parentId={note.id} />
        ))}
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
            class="form-control"
            onChange={(e) => setNoteInput(e.target.value)}
            value={noteInput}
          />
        </div>
        <br />
        <div className="col-4">
          <button
            type="submit"
            class="btn btn-primary"
            onClick={handleNoteSubmit}
            disabled={displayInputField}
          >
            Submit
          </button>
        </div>
      </div>
      {notesState.length > 0 && notesState.map((note) => <ReturnNote note={note} />)}
    </div>
  );
};

export default App;
