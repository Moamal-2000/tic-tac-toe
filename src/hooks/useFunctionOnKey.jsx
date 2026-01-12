import useDebounce from "./useDebounce";
import useKeyPress from "./useKeyPress";

const useFunctionOnKey = (
  callback,
  allowedKeys,
  delay = 200,
  ignoreModifierKeys = false,
  ignoreWhenInputFocused = false
) => {
  const [key, keyData] = useKeyPress();
  useDebounce(() => handleKeyPress(), delay, [key, keyData]);

  function handleKeyPress() {
    const { shiftKey, altKey, ctrlKey } = keyData;
    const isModifierKeyPressed = shiftKey || altKey || ctrlKey;

    const focusElement = document.activeElement?.tagName;
    const isFocusOnInput = /^(input|textarea)$/i.test(focusElement);

    const shouldIgnore =
      (ignoreModifierKeys || ignoreWhenInputFocused) &&
      (isModifierKeyPressed || isFocusOnInput);

    if (shouldIgnore) return;

    if (allowedKeys.includes(key)) callback();
  }
};

export default useFunctionOnKey;
