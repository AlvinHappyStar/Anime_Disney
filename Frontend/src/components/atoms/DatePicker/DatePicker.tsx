import Input from "../Input";
import { useState } from "react";
import { DatePickerProps } from ".";
import { DatePicker as BaseDatePicker } from "@mui/lab";
import styled from "@mui/material/styles/styled";

const CustomInput = styled(Input)({
"& .MuiInputBase-input": {
  height: "1em",
  paddingTop: "20px",
  color: "white !important",
  cursor:'default!important',
  caretColor:'transparent',
}});

export default function DatePicker({
  onChange,
  editable,
  InputFieldProps,
  value: { date: value = "" },
  ...rest
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const InputProps = {
    autoComplete: "off",
    InputLabelProps: { shrink: true },
    ...InputFieldProps,
    onClick: () => setOpen(true),
    onKeyDown: (e: any) => {
      if (!editable) e.preventDefault();
    },
    error: InputFieldProps?.helperText ? InputFieldProps?.error : false,
  };

  return (
    <BaseDatePicker
      open={open}
      value={value}
      showTodayButton
      mask="__/__/____"
      inputFormat="dd/MM/yyyy"
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onChange={(date) =>
        onChange?.({ date: date ? `${date}` : "", error: false })
      }
      onAccept={(date) =>
        onChange?.({ date: date ? `${date}` : "", error: false })
      }
      onError={(reason, date) => {
        if (!reason) return;
        onChange?.({ date: date ? `${date}` : "", error: true });
      }}
      {...rest}
      renderInput={(params) => <CustomInput {...params} {...InputProps} />}
      PopperProps={{ placement: "bottom-start", ...rest.PopperProps }}
      reduceAnimations={true}
    />
  );
}
