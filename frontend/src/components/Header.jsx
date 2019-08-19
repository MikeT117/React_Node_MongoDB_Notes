import React, { useState } from "react";
import styled from "styled-components";
import Avatar from "./Avatar";
import { IoMdSearch, IoMdAdd, IoMdMenu } from "react-icons/io";
import Drawer from "./Drawer";
import { useDispatch } from "react-redux";

const Wrapper = styled.div`
  display: flex;
  background: #fff;
  align-items: center;
  padding: 1.5em 1.5em;
  background-color: ${props => props.bgColor || "#f7f7f7"};
`;

const SearchInput = styled.input`
  display: ${props => (props.open ? "unset" : "none")};
  height: 32px;
  flex-grow: inherit;
  border-radius: inherit;
  border: none;
  font-family: "Open Sans", sans-serif;
  font-weight: 400;
  font-size: 0.9em;
  transition: box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  padding: 0.5em;
  border-left: 1px solid rgba(0, 0, 0, 0.12);
  outline: none;
  max-width: 100%;
  min-width: 0;
`;

const ButtonWrapper = styled.div`
  display: flex;
  margin-right: 1em;
  box-sizing: unset;
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

const Spacer = styled.div`
  display: ${props => (!props.open ? "unset" : "none")};
  flex-grow: 1;
`;

const SearchButtonWrapper = styled(ButtonWrapper)`
  align-items: center;
  padding: ${props => props.search && "0"};
  flex-grow: ${props => props.search && "1"};
  min-width: 0;
  & svg {
    padding: ${props => props.search && "0 .5em"};
    box-sizing: ${props => props.search && "unset"};
    min-width: 1.5em;
  }
  &:hover {
    cursor: pointer;
  }
`;

const AddButton = styled(ButtonWrapper)`
  @media (max-width: 768px) {
    border-radius: 50%;
    position: fixed;
    bottom: 1.5em;
    right: 1.5em;
    margin: 0;
    padding: 0.5em 0.5em;
    padding: 0.75em 0.75em;
    background-color: rgba(254, 199, 61, 1);
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.14),
      0 2px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 3px 0 rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(0, 0, 0, 0);
  }
  &:hover {
    cursor: pointer;
  }
`;

const Header = ({ searchCallback, ...props }) => {
  const [searchOpen, setSearch] = useState(false);
  const [drawerState, setDrawer] = useState(false);
  const dispatch = useDispatch();
  const root = props.location.pathname === "/";

  const newNote = () => {
    dispatch({ type: "EDITOR_NEW" });
  };

  return (
    <Wrapper>
      <Drawer {...props} open={drawerState} close={() => setDrawer(false)} />
      <ButtonWrapper onClick={() => setDrawer(true)}>
        <IoMdMenu size="1.5em" />
      </ButtonWrapper>
      {root && <>
      <SearchButtonWrapper search={searchOpen}>
        <IoMdSearch onClick={() => setSearch(!searchOpen)} size="1.5em" />
        <SearchInput
          open={searchOpen}
          placeholder="Search"
          onKeyDown={e => e.key === "Escape" && setSearch(false)}
          onChange={e => searchCallback(e.target.value)}
        />
      </SearchButtonWrapper>
      <Spacer open={searchOpen} />
       <AddButton className="addButton" onClick={newNote}>
        <IoMdAdd size="1.5em" />
      </AddButton>
      <Avatar />
      </>}
    </Wrapper>
  );
};

export default Header;
