import React from "react";
import styled from "styled-components";
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;

`
const H1 = styled.h1`
  font-family: "Open Sans", sans-serif;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.6);
  font-size: 3em;
`;

const NotFound = () => <Wrapper><H1>Oh dear, looks like you're lost!</H1></Wrapper>;

export default NotFound;
