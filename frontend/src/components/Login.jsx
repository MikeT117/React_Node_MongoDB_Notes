import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";

const Wrapper = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  @media (max-width: 576px) {
    background: rgb(61, 90, 254);
  }
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 50%;
  width: 100%;
  border-radius: 0.5em;
  padding: 1em 2em 2.5em 2em;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 2px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 3px 0 rgba(0, 0, 0, 0.2);
  background: rgb(61, 90, 254);
  @media (max-width: 12000px) {
    max-width: 500px;
  }
  @media (max-width: 1200px) {
    max-width: 50%;
  }
  @media (max-width: 12000px) {
    max-width: 500px;
  }
  @media (max-width: 1200px) {
    max-width: 50%;
  }
  @media (max-width: 992px) {
    max-width: 65%;
  }
  @media (max-width: 768px) {
    max-width: 75%;
  }
  @media (max-width: 576px) {
    border: none;
    box-shadow: none;
    min-width: 100%;
  }
`;

const Form = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  flex-direction: column;
`;

const Input = styled.input`
  flex-grow: 1;
  font-family: "Open Sans", sans-serif;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.8);
  font-size: 0.85em;
  margin-bottom: 0.5em;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5em;
  padding: 0.75em;
  margin-top: 0.5em;
  outline: none;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  &:hover {
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
  &:focus {
    border: 1px solid rgba(0, 0, 0, 0.4);
  }
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  font-family: "Open Sans", sans-serif;
  font-weight: 400;
  color: rgb(247, 247, 247);
  font-size: 0.85em;
  padding: 0.5em 0 0.5em 0;
  position: relative;
`;

const Title = styled.h1`
  font-family: "Open Sans", sans-serif;
  font-weight: 700;
  color: rgb(247, 247, 247);
  margin-bottom: 0.5em;
`;

const Button = styled.button`
  display: flex;
  flex-grow: 1;
  margin-top: 1em;
  padding: 0.5em;
  justify-content: center;
  font-family: "Open Sans", sans-serif;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.8);
  font-size: 1em;
  border-radius: 0.5em;
  border: 0px solid rgba(0, 0, 0, 0.1);
  background-color: rgba(254, 199, 61, 1);
  outline: none;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 2px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 3px 0 rgba(0, 0, 0, 0.2);
  transition: all ease-in;
  &:hover {
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
      0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  }
  &:active {
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
      0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  }
`;

const P = styled.p`
  font-family: "Open Sans", sans-serif;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.8);
  font-size: 1em;
  & > a {
    font-weight: 600;
    text-decoration: none;
    color: inherit;
  }
  @media (max-width: 576px) {
    font-size: 0.85em;
    color: rgb(247, 247, 247);
  }
`;
const CheckLabel = styled(Label)`
  flex-direction: row;
`;

const CheckInput = styled(Input)`
  position: relative;
  bottom: 2px;
  flex-grow: 0;
`;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const remember = useRef(null);

  const apiLogin = async () => {
    try {
      if (username.trim() === "" || password.trim() === "") {
        setError("Username/Password cannot be blank!");
        return;
      }

      const resp = await fetch(`/login`, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        credentials: "same-origin",
        body: JSON.stringify({
          username: username,
          password: password,
          remember: remember.current.checked
        })
      });

      if (resp.statusText === "LOGIN_SUCCESSFUL") {
        const json = await resp.json();
        dispatch({ type: "LOGIN", payload: json });
        return;
      }
      if (resp.statusText === "USERNAME/PASSWORD_INCORRECT") {
        setError(resp.statusText);
        return;
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Wrapper>
      <FormWrapper>
        <Title>Login</Title>
        <Form>
          <Label htmlFor="username">
            Username
            <Input
              name="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Username"
            />
          </Label>
          <Label htmlFor="password">
            Password
            <Input
              type="password"
              name="password"
              value={password}
              onKeyUp={event => event.key === "Enter" && apiLogin()}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
            />
          </Label>
          <CheckLabel htmlFor="rememberme">
            Remember me:
            <CheckInput type="checkbox" ref={remember} />
          </CheckLabel>
        </Form>
        <Button onClick={apiLogin}>Login</Button>
      </FormWrapper>
      {error && <P>{error}</P>}
      <P>
        Don't have an account? Why not register{" "}
        <a href={`http://${window.location.hostname}:3000/register`}>here?</a>
      </P>
    </Wrapper>
  );
};

export default Login;
