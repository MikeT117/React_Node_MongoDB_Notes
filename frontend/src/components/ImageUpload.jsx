import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { IoIosCamera } from "react-icons/io";
const Input = styled.input`
  display: none;
`;

const LabelWrapper = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 20;
  & > svg {
    opacity: 0;
  }
  &:hover {
    & > svg {
      opacity: 1;
    }
  }
`;

const Camera = styled(IoIosCamera)`
  box-sizing: unset;
  width: 50%;
  height: 50%;
  color: rgba(0, 0, 0, 0.6);
  padding: 25%;
  background-color: rgba(255, 255, 255, 0.45);
  transition: all 0.05s ease-in-out;
`;

const ImageUpload = () => {
  const inputEl = useRef(null);
  const dispatch = useDispatch();

  const handleAvatarUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("avatar", inputEl.current.files[0]);
      console.log(inputEl.current.files[0])
      const resp = await fetch(`/update_avatar`, {
        method: "POST",
        credentials: "same-origin",
        body: formData
      });
      //if (resp.status === 401) dispatch({ type: "REAUTH" });
      if (resp.statusText === "AVATAR_UPDATED") {
        const json = await resp.json();
        dispatch({ type: "UPDATE_AVATAR", payload: json.avatar });
        return;
      }
    } catch (e) {
      console.log("Error uploading avatar image, please try again later", e);
    }
  };
  return (
    <LabelWrapper htmlFor="avatarUpload">
      <Camera />
      <Input
        id="avatarUpload"
        name="avatarUpload"
        type="file"
        ref={inputEl}
        onChange={handleAvatarUpdate}
      />
    </LabelWrapper>
  );
};

export default ImageUpload;
