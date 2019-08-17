// Get username and avatar file from login request, Store this in redux state
const apiLogin = data => {
  if (data === undefined) return false;
  return async dispatch => {
    try {
      const resp = await fetch(`/login`, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        credentials: "same-origin",
        body: JSON.stringify(data)
      });
      console.log(resp);

      if (resp.statusText === "LOGIN_SUCCESSFUL") {
        const json = await resp.json();
        dispatch({ type: "LOGIN", payload: json });
      }
    } catch (err) {
      console.log(err);
    }
  };
};

const apiRegister = async (data = null) => {
  if (!data) return false;
  try {
    const resp = await fetch(`/register`, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(data)
    });
    if (resp.statusText === "REGISTRATION_SUCCESSFUL") return true;
  } catch (err) {
    console.log(err);
  }
};

const apiAccount = async () => {
  try {
    const resp = await fetch(`/account`, {
      method: "GET",
      credentials: "same-origin"
    });
    if (resp.status === 401) return false;
    if (resp.status === 200) {
      const json = await resp.json();
      return await json;
    }
  } catch (err) {
    console.log(err);
  }
};

const apiNotes = () => {
  return async dispatch => {
    try {
      const resp = await fetch(`/notes`, {
        method: "GET",
        credentials: "same-origin"
      });
      if (resp.status === 401) dispatch({ type: "REAUTH" });
      if (resp.status === 200) {
        const json = await resp.json();
        dispatch({ type: "LOAD_NOTES", payload: json });
      }
    } catch (err) {
      console.log(err);
    }
  };
};

const apiUpdateNote = (data = null) => {
  if (!data) return false;
  return async dispatch => {
    try {
      const resp = await fetch(`/update_note`, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "PUT",
        credentials: "same-origin",
        body: JSON.stringify(data)
      });
      if (resp.status === 401) dispatch({ type: "REAUTH" });
      if (resp.statusText === "NOTE_UPDATED") {
        dispatch({ type: "SYNC_UPDATED", payload: data._id });
      }
    } catch (err) {
      console.log(err);
    }
  };
};

const apiSaveNote = (data = null) => {
  if (!data) return false;
  return async dispatch => {
    try {
      const resp = await fetch(`/add_note`, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "PUT",
        credentials: "same-origin",
        body: JSON.stringify(data)
      });
      if (resp.status === 401) dispatch({ type: "REAUTH" });
      console.log(resp.statusText);
      if (resp.statusText === "NOTE_SAVED") {
        dispatch({ type: "SYNC_NEW", payload: data.tempId });
      }
    } catch (err) {
      console.log(err);
    }
  };
};

const apiDeleteNote = (data = null) => {
  if (!data) return false;
  return async dispatch => {
    try {
      const resp = await fetch(`/delete_note`, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "DELETE",
        credentials: "same-origin",
        body: JSON.stringify(data)
      });
      if (resp.status === 401) dispatch({ type: "REAUTH" });
      if (resp.statusText === "NOTE_DELETED") {
        dispatch({ type: "SYNC_DELETED", payload: data._id });
      }
    } catch (err) {
      console.log(err);
    }
  };
};

export {
  apiLogin,
  apiRegister,
  apiAccount,
  apiNotes,
  apiUpdateNote,
  apiSaveNote,
  apiDeleteNote
};
