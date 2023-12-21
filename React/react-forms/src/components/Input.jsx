/* eslint-disable react/prop-types */
import { useInput } from "../hooks/useInput.js";
import { isEmail } from "../util/validation.js";

export default function Input({ inputType, ...props }) {
  const {
    value: enteredValue,
    handleInputChange,
    handleInputBlur,
  } = useInput("", isEmail);

  return (
    <>
      <div className="control no-margin">
        <label htmlFor={inputType}>{inputType}</label>
        <input
          {...props}
          onChange={handleInputChange}
          value={enteredValue}
          onBlur={handleInputBlur}
          required
        />
        <div className="control-error"></div>
      </div>
    </>
  );
}
