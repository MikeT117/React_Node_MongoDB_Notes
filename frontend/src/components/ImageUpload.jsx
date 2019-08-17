import React, { useRef } from "react";

const ImageUpload = () => {
  const inputEl = useRef(null);

  const handleChange = e => {
    e.preventDefault();
    //dispatch(updateAvatar(inputEl.current.files[0], refresh_token));
  };

  return (
    <input
      name="UploadFile"
      type="file"
      ref={inputEl}
      onChange={e => handleChange(e)}
    />
  );
};

export default ImageUpload;
