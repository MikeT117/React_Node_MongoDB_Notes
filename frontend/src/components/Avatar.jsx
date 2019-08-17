import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import defaultAvatar from '../assets/images/default_avatar.jpg'

const ImgWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-self: center;
  max-width: 42px;
  min-width: ${props => props.size || "42px"};
  height: ${props => props.size || "42px"};
  border-radius: 50%;
  overflow: hidden;
  &:hover {
    cursor: pointer;
  }
`;

const Avatar = ({ size }) => {
  const avatar = useSelector(state => state.rootReducer.user.avatar);
  return (
    <ImgWrapper size={size}>
      <img src={avatar || defaultAvatar} alt="Avatar" />
    </ImgWrapper>
  );
};

export default Avatar;
