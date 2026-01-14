import { useState } from "react";
import useEventListener from "./useEventListener";

const useKeyPress = () => {
  const [keyData, setKeyData] = useState({});
  const [key, setKey] = useState("");

  const documentElement = typeof document !== "undefined" ? document : null;

  useEventListener(documentElement, "keydown", (event) => {
    setKeyData(extractKeyData(event));
    setKey(event.code);
  });

  return [key, keyData];
};

export default useKeyPress;

const extractKeyData = ({
  altKey,
  ctrlKey,
  shiftKey,
  target,
  timeStamp,
  keyCode,
}) => ({
  altKey,
  ctrlKey,
  shiftKey,
  target,
  timeStamp,
  keyCode,
});
