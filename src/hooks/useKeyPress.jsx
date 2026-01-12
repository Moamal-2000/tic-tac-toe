import { useEffect, useState } from "react";

const useKeyPress = () => {
  const [keyData, setKeyData] = useState({});
  const [key, setKey] = useState("");

  function handleKeyPress(event) {
    const { altKey, ctrlKey, shiftKey, target, timeStamp, keyCode } = event;
    const extractedInfo = { altKey, ctrlKey, shiftKey, target, timeStamp, keyCode };
    setKeyData(extractedInfo);
    setKey(event.code);
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return [key, keyData];
};

export default useKeyPress;