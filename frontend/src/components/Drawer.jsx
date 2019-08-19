import React from "react";
import styled from "styled-components";
import { IoMdArrowBack } from "react-icons/io";
import { useDispatch } from "react-redux";
import { apiLogout } from "../api/index";

const Overlay = styled.div`
  display: ${props => (props.open ? "unset" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.45);
  z-index: 50;
`;

const Wrapper = styled.div`
  display: flex;
  position: fixed;
  flex-direction: column;
  height: 100%;
  width: 250px;
  z-index: 100;
  background-color: #f7f7f7;
  left: ${props => (props.open ? "0px" : "-250px")};
  top: 0;
  border-right: 1px solid rgba(61, 90, 254, 0.25);
  transition: all ease-in-out;
`;

const UnorderedList = styled.ul`
  margin: 0;
  padding: 0;
  & > li {
    font-family: "Open Sans", sans-serif;
    font-size: 0.9em;
    color: rgba(0, 0, 0, 0.6);
    padding: 1em 0 1em 1.5em;
    list-style-type: none;
    border-top: 1px solid rgba(61, 90, 254, 0.25);
    &:hover {
      cursor: pointer;
    }
  }
  & li:last-child {
    border-bottom: 1px solid rgba(61, 90, 254, 0.25);
  }
`;

const DrawerHeader = styled.div`
  display: flex;
  align-content: center;
  padding: 1.5em;
  height: 90px;
  align-items: center;
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0.25em 0.5em;
  border-radius: 0.5em;
  color: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(61, 90, 254, 0.5);
  background: rgba(61, 90, 254, 0.05);
  & svg {
    color: inherit;
  }
  &:hover {
    cursor: pointer;
  }
`;

const Drawer = ({ open, close, history }) => {
  const dispatch = useDispatch();
  const handleNav = e => {
    history.push(e);
    close();
  };
  return (
    <>
      <Wrapper open={open}>
        <DrawerHeader>
          <ButtonWrapper onClick={close}>
            <IoMdArrowBack size="1.5em" />
          </ButtonWrapper>
        </DrawerHeader>
        <UnorderedList>
          <li onClick={e => handleNav("/")}>Home</li>
          <li onClick={e => handleNav("/account")}>Account</li>
          <li onClick={() => dispatch(apiLogout())}>Logout</li>
        </UnorderedList>
      </Wrapper>
      <Overlay open={open} onClick={close} />
    </>
  );
};

export default Drawer;
