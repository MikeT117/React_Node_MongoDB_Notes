import React, { useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2em 1em;
`;

const Label = styled.label``;

const Input = styled.input``;

const FormWrapper = styled.div`
  display: flex;
  margin-top: 2em;
`;

const App = () => {
  // Register State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmitRegister = e => {
    e.preventDefault();
    fetch("/testingregister", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: password,
        firstname: firstname,
        lastname: lastname,
        email: email
      })
    })
      .then(d => d.status === 200 && d.json())
      .then(s => console.log(s));
  };

  // Note State

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [user, setUser] = useState("");

  const handleSubmitNote = e => {
    e.preventDefault();
    fetch("/add_update_note", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        title: title,
        body: body,
        user: user,
        tags: ["Tag1", "Tag2", "Tag3"]
      })
    })
      .then(d => d.status === 200 && d.json())
      .then(s => console.log(s));
  };

  // Session State
  const [sessionuser, setSessionUser] = useState("");

  const handleSubmitSession = e => {
    e.preventDefault();
    console.log("MIDDLEWARE TEST BEGIN CLIENT SIDE");
    fetch("/testingMiddleWare", {
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      method: "POST"
    })
      .then(d => d.status === 200 && d.json())
      .then(s => console.log(s));
  };

  // Notes
  const handleGetNotes = e => {
    e.preventDefault();

    fetch("/getnotes", {
      credentials: "include",
      method: "GET"
    })
      .then(d => d.status === 200 && d.json())
      .then(s => console.log(s));
  };

  // Login State
  const [loginUsername, setloginUsername] = useState("");
  const [loginPassword, setloginPassword] = useState("");

  const handleSubmitLogin = e => {
    e.preventDefault();
    fetch("/testinglogin", {
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      method: "POST",
      body: JSON.stringify({
        username: loginUsername,
        password: loginPassword
      })
    })
      .then(d => d.status === 200 && d.json())
      .then(s => console.log(s));
  };

  return (
    <Wrapper>
      <button onClick={handleGetNotes}>Get Notes</button>
      <FormWrapper>
        Register Form
        <Form onSubmit={handleSubmitRegister}>
          <Label htmlFor="username">
            Username
            <Input
              type="text"
              name="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </Label>
          <Label htmlFor="password">
            Password
            <Input
              type="password"
              name="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </Label>
          <Label htmlFor="firstname">
            First Name
            <Input
              type="text"
              name="firstname"
              value={firstname}
              onChange={e => setFirstname(e.target.value)}
            />
          </Label>
          <Label htmlFor="lastname">
            Surname
            <Input
              type="text"
              name="lastname"
              value={lastname}
              onChange={e => setLastname(e.target.value)}
            />
          </Label>
          <Label htmlFor="emailaddress">
            Email Address
            <Input
              type="text"
              name="emailaddress"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </Label>
          <button type="submit" value="Submit">
            Register
          </button>
        </Form>
      </FormWrapper>
      <FormWrapper>
        Session Form
        <Form onSubmit={handleSubmitSession}>
          <Label htmlFor="sessionuser">
            Session User
            <Input
              type="text"
              name="sessionuser"
              value={sessionuser}
              onChange={e => setSessionUser(e.target.value)}
            />
          </Label>
          <button type="submit" value="Submit">
            Add Session
          </button>
        </Form>
      </FormWrapper>

      <FormWrapper>
        Login Form
        <Form onSubmit={handleSubmitLogin}>
          <Label htmlFor="loginUsername">
            Login Username
            <Input
              type="text"
              name="loginUsername"
              value={loginUsername}
              onChange={e => setloginUsername(e.target.value)}
            />
          </Label>
          <Label htmlFor="loginPassword">
            Login Password
            <Input
              type="text"
              name="loginPassword"
              value={loginPassword}
              onChange={e => setloginPassword(e.target.value)}
            />
          </Label>
          <button type="submit" value="Submit">
            Login Test
          </button>
        </Form>
      </FormWrapper>
      <FormWrapper>
        Note Form
        <Form onSubmit={handleSubmitNote}>
          <Label htmlFor="title">
            Title
            <Input
              type="text"
              name="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </Label>
          <Label htmlFor="body">
            body
            <Input
              type="body"
              name="body"
              value={body}
              onChange={e => setBody(e.target.value)}
            />
          </Label>
          <Label htmlFor="user">
            User
            <Input
              type="text"
              name="user"
              value={user}
              onChange={e => setUser(e.target.value)}
            />
          </Label>
          <button type="submit" value="Submit">
            Add Note
          </button>
        </Form>
      </FormWrapper>
    </Wrapper>
  );
};

export default App;
