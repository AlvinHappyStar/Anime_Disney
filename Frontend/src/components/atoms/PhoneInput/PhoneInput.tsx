import { PhoneInputOwnProps } from ".";
import "react-phone-input-2/lib/material.css";
import { default as BasePhoneInput } from "react-phone-input-2";
import "./PhoneInput.css";
import { useAppSelector } from "redux/hooks";

export type PhoneInputProps = PhoneInputOwnProps &
  React.ComponentProps<typeof BasePhoneInput>;

export default function PhoneInput({
  id,
  name,
  error,
  onChange,
  helperText,
  value,
  ...rest
}: PhoneInputProps) {
  const { user } = useAppSelector((state) => state.auth);

  const handleChange = (inputValue: string, data: any, event: React.ChangeEvent<HTMLInputElement>, formattedValue: string) => {
    // Check if the inputValue is empty
    if (inputValue === '') {
      // Set the value to just the country code
      onChange?.(`+${data.dialCode}`, data, event, formattedValue);
    } else {
      onChange?.(inputValue, data, event, formattedValue);
    }
  };

  return (
    <>
      <BasePhoneInput
        country={user ? (user.country ? user.country : "au") : "au"}
        enableSearch
        value={value}
        inputProps={{
          id,
          name,
          defaultValue: value,
          placeholder: "",
        }}
        jumpCursorToEnd
        dropdownClass={"phone-input-dropdown"}
        containerClass={`phone-input ${error ? "phone-input-error" : ""}`}
        onChange={handleChange}
        {...rest}
        placeholder=""
      />
      {helperText && <p className="phone-input-helper-text">{helperText}</p>}
    </>
  );
}
