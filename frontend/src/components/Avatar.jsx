import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import defaultAvatar from "../assets/images/default_avatar.jpg";
import ImageUpload from "./ImageUpload";

const ImgWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  max-width: 42px;
  min-width: ${props => props.size || "42px"};
  height: ${props => props.size || "42px"};
  border-radius: 50%;
  overflow: hidden;
  &:hover {
    cursor: pointer;
  }
`;

const Avatar = ({ size, className, updateable = false }) => {
  const avatar = useSelector(state => state.rootReducer.user.avatar);
  return (
    <ImgWrapper className={className} size={size} updateable={updateable}>
      <img src={avatar === "http://localhost:3000/avatarundefined.jpg" && defaultAvatar || avatar} alt="Avatar" />
      {updateable && <ImageUpload />}
    </ImgWrapper>
  );
};

export default Avatar;
