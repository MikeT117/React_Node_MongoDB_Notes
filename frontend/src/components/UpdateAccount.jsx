import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
const Wrapper = styled.div`
  position: fixed;
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 90;

  @media (max-width: 576px) {
    background: rgb(61, 90, 254);
  }
`;

const FormWrapper = styled.div`
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 2px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 3px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  max-width: 500px;
  width: 100%;
  border-radius: 0.5em;
  padding: 1em 2em 2.5em 2em;
  background: rgb(61, 90, 254);
  @media (max-width: 12000px) {
    max-width: 500px;
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
  margin: 0.5em 0em 0.5em 0em;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5em;
  padding: 0.75em;
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
    text-decoration: none;
  }
  @media (max-width: 576px) {
    font-size: 0.85em;
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  & button:first-child {
    margin-right: 0.5em;
  }
  & button:last-child {
    margin-left: 0.5em;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.45);
  z-index: 40;
`;

const AccountUpdate = ({ elem, cancelUpdate }) => {
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [currentpassword, setCurrentPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const handleUpdate = async () => {
    try {
      if (password.trim() !== passwordConfirm.trim()) {
        setError("Passwords do not match!");
        return;
      }
      const url =
        (elem === "Password" && "/update_password") || "/update_account";
      const resp = await fetch(url, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          username: username,
          currentpassword: currentpassword,
          password: password,
          firstname: firstname,
          lastname: lastname,
          email: email
        })
      });

      if (
        resp.statusText === "ACCOUNT_UPDATE_SUCCESSFUL" ||
        resp.statusText === "PASSWORD_UPDATE_SUCCESSFUL"
      ) {
        // Possibly add a timer here, display to the user that
        // they will need to log back in
        dispatch({ type: "REAUTH" });
        return;
      }
    } catch (err) {
      console.log(err);
      return;
    }
  };

  return (
    <>
      <Wrapper>
        <FormWrapper>
          <Title>Update {elem}</Title>
          <Form>
            {elem === "Username" && (
              <Label htmlFor="username">
                Username
                <Input
                  name="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Username"
                />
              </Label>
            )}
            {elem === "Name" && (
              <>
                <Label htmlFor="firstname">
                  First Name
                  <Input
                    name="firstname"
                    value={firstname}
                    onChange={e => setFirstname(e.target.value)}
                    placeholder="First Name"
                  />
                </Label>
                <Label htmlFor="lastname">
                  Last Name
                  <Input
                    name="lastname"
                    value={lastname}
                    onChange={e => setLastname(e.target.value)}
                    placeholder="Last Name"
                  />
                </Label>
              </>
            )}
            {elem === "Password" && (
              <>
                <Label htmlFor="password">
                  Current Password
                  <Input
                    type="password"
                    name="currentpassword"
                    value={currentpassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    placeholder="Password"
                  />
                </Label>
                <Label htmlFor="password">
                  Password
                  <Input
                    type="password"
                    name="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Password"
                  />
                </Label>
                <Label htmlFor="passwordConfirm">
                  Confirm Password
                  <Input
                    type="password"
                    name="passwordConfirm"
                    value={passwordConfirm}
                    onChange={e => setPasswordConfirm(e.target.value)}
                    placeholder="Confirm Password"
                  />
                </Label>
              </>
            )}
            {elem === "Email" && (
              <Label htmlFor="email">
                Email Address
                <Input
                  name="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email Address"
                />
              </Label>
            )}
          </Form>
          {error && <P>{error}</P>}
          <Row>
            <Button onClick={handleUpdate}>Update</Button>
            <Button onClick={cancelUpdate}>Cancel</Button>
          </Row>
        </FormWrapper>
      </Wrapper>
      <Overlay />
    </>
  );
};

export default AccountUpdate;
