import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import Avatar from "./Avatar";
import { apiAccount } from "../api";
import UpdateAccount from "./UpdateAccount";

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 500px;
  min-width: 300px;
  width: 100%;
  border-radius: 0.5em;
  background: rgba(61, 90, 254, 1);
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 2px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 3px 0 rgba(0, 0, 0, 0.2);
`;

const AvatarRow = styled.div`
  display: flex;
  padding: 2em 2em 2em 2em;
  & p {
    padding: unset;
    margin: unset;
    font-family: "Open Sans", sans-serif;
    font-weight: 600;
    font-size: 0.85em;
    color: rgb(247, 247, 247);
  }
  &:first-of-type(p) {
    font-weight: 700;
  }
`;

const UserDetails = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  padding: 0 2em;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgb(247, 247, 247, 0.7);
  & > p {
    font-family: "Open Sans", sans-serif;
    font-weight: 400;
    font-size: 0.85em;
    color: rgb(247, 247, 247);
  }
`;

const AvatarColumn = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 1em;
`;

const Button = styled.div`
  display: flex;
  box-sizing: unset;
  padding: 0.5em 0.75em;
  border-radius: 0.5em;
  color: rgba(0, 0, 0, 0.7);
  font-weight: 700;
  border: 1px solid rgb(247, 247, 247);
  background: rgb(247, 247, 247);
  font-size: 0.75em;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 2px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 3px 0 rgba(0, 0, 0, 0.2);
  & svg {
    color: inherit;
  }
  &:hover {
    cursor: pointer;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
      0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  }
  &:active {
    box-shadow: none;
  }
`;

const Account = () => {
  const [accountData, set] = useState(null);
  const [update, setUpdate] = useState({ open: false, elem: "" });
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const data = await apiAccount();
      if (!data) dispatch({ type: "REAUTH" });
      set(data);
    };
    fetchData();
  }, [dispatch]);

  const editProps = ["Username", "Name", "Email", "Password"];

  return (
    accountData && (
      <PageWrapper>
        <ContentWrapper>
          <AvatarRow>
            <Avatar size={"56px"} updateable={true} />
            <AvatarColumn>
              <p>{accountData.fullname}</p>
              <p>{accountData.username}</p>
              <p>{accountData.email}</p>
            </AvatarColumn>
          </AvatarRow>
          <UserDetails>
            {editProps.map((d, i) => {
              return (
                <Row key={i}>
                  <p>{d}</p>
                  <Button
                    onClick={e => setUpdate({ ...update, elem: d, open: true })}
                  >
                    Change
                  </Button>
                </Row>
              );
            })}
          </UserDetails>
        </ContentWrapper>
        {update.open && (
          <UpdateAccount
            elem={update.elem}
            cancelUpdate={() => setUpdate({ elem: "", open: false })}
          />
        )}
      </PageWrapper>
    )
  );
};

export default Account;
