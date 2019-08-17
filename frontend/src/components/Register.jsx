import React, { useState } from "react";
import styled from "styled-components";
import { apiRegister } from "../api";
// import { useDispatch } from "react-redux";

const Wrapper = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 50%;
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 0.5em;
  padding: 1em 2em;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.12);
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
  padding: 0.5em;
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
  flex-grow: 1;
  font-family: "Open Sans", sans-serif;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.6);
  font-size: 1em;
  padding: 0.5em 0 0.5em 0;
`;

const Title = styled.h1`
  font-family: "Open Sans", sans-serif;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.8);
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
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: transparent;
  outline: none;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  &:active {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

const P = styled.p`
  font-family: "Open Sans", sans-serif;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.8);
  font-size: 1em;
  & > a {
    text-decoration: none;
  }
  @media (max-width: 576px) {
    font-size: 0.85em;
  }
`;

const Register = () => {
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");

  const handleRegister = () => {
    password.trim() === passwordConfirm.trim() &&
      apiRegister({
        username: username,
        password: password,
        firstname: firstname,
        lastname: lastname,
        email: email
      });
    // Register user, upon successful registration
    // redirect user to login form
    // Throw warning to form that passwords do not match
  };

  return (
    <Wrapper>
      <FormWrapper>
        <Title>Register</Title>
        <Form>
          <Label htmlFor="username">Username</Label>
          <Input
            name="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Username"
          />
          <Label htmlFor="firstname">First Name</Label>
          <Input
            name="firstname"
            value={firstname}
            onChange={e => setFirstname(e.target.value)}
            placeholder="First Name"
          />
          <Label htmlFor="lastname">Last Name</Label>
          <Input
            name="lastname"
            value={lastname}
            onChange={e => setLastname(e.target.value)}
            placeholder="Last Name"
          />
          <Label htmlFor="password">Password</Label>
          <Input
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
          />
          <Label htmlFor="passwordConfirm">Confirm Password</Label>
          <Input
            name="passwordConfirm"
            value={passwordConfirm}
            onChange={e => setPasswordConfirm(e.target.value)}
            placeholder="Confirm Password"
          />
          <Label htmlFor="email">Email Address</Label>
          <Input
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email Address"
          />
        </Form>
        <Button onClick={handleRegister}>Register</Button>
      </FormWrapper>
      <P>
        Already have an account? Login{" "}
        <a href={`http://${window.location.hostname}:3000/login`}>here?</a>
      </P>
    </Wrapper>
  );
};

export default Register;
