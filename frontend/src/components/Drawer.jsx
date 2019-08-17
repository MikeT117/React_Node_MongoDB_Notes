import React from "react";
import styled from "styled-components";
import { IoMdArrowBack } from "react-icons/io";
import { useDispatch } from "react-redux";

const Overlay = styled.div`
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
  border-right: 1px solid rgba(0, 0, 0, 0.12);
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
    border-top: 1px solid rgba(0, 0, 0, 0.12);
    &:hover {
      cursor: pointer;
    }
  }
  & li:last-child {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
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
  color: ${props =>
    !props.dark ? "rgba(0, 0, 0, 0.6)" : "rgb(247, 247, 247)"};
  border: 1px solid
    ${props => (!props.dark ? "rgba(0, 0, 0, 0.12)" : "rgb(247, 247, 247)")};
  & svg {
    color: inherit;
  }
  &:hover {
    cursor: pointer;
  }
`;

const Drawer = ({ open, close }) => {
  const dispatch = useDispatch();
  const handleLink = e => {
    window.location.replace(`${window.location.origin}/${e}`);
  };

  const handleLogout = () => dispatch({ type: "LOGOUT" });
  return (
    open && (
      <>
        <Wrapper open={open}>
          <DrawerHeader>
            <ButtonWrapper onClick={close}>
              <IoMdArrowBack size="1.5em" />
            </ButtonWrapper>
          </DrawerHeader>
          <UnorderedList>
            <li onClick={e => handleLink("")}>Home</li>
            <li onClick={e => handleLink("account")}>Account</li>
            <li onClick={e => handleLogout(e)}>Logout</li>
          </UnorderedList>
        </Wrapper>
        <Overlay onClick={close} />
      </>
    )
  );
};

export default Drawer;
