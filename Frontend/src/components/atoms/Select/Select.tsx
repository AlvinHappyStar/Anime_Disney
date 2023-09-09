import { SelectOwnProps } from ".";
import { useParams } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import styled from "@mui/material/styles/styled";
import { useState } from "react";

export type SelectProps = SelectOwnProps &
  React.ComponentProps<typeof TextField>;

const CssTextField = styled(TextField)({
  // Filled Input
  "& .MuiFilledInput-root": {
    backgroundColor: "transparent",
    borderRadius: "0px",
    height: '47px',
    border: "1px solid #ffffff",
    userSelect: 'text',
    // '&:hover fieldset': {
    //   borderColor: '#fff', // Set your desired outline color here
    // },
    // '& fieldset': {
    //   borderColor: '#fff', // Set your desired outline color here
    // },
  },
  "& .MuiInputBase-input": {
    height: "1em",
    color: "white",
    paddingTop: "16px",
    paddingBottom: "5px",
    userSelect:'text',
    fontSize: '16px',
  },
  "& .MuiInputLabel-root": {
    color: "white",
    top: "-4px",
    userSelect: 'text',
    fontSize: '16px',
  },
  "& .MuiFilledInput-root:after, .MuiFilledInput-root:before": {
    display: "none",
  },
  "& .Mui-disabled": {
    backgroundColor: "transparent",
    textFillColor: "rgb(255 255 255 / 50%) !important",
    opacity: "0.9",
  },
  "& .Mui-focused": {
    backgroundColor: "transparent !important",
  },
  "& .MuiFilledInput-root:hover": {
    backgroundColor: "transparent !important",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "rgba(255, 255, 255, 255)",
  },
  "& svg": {
    fill: "#ffffff",
  },
  
});

export default function Select({
  disabled,
  disabledOnUpdate,
  options = [],
  ...rest
}: SelectProps) {
  const { id } = useParams();
  const [selectedIndex, setSelectedIndex] = useState(1);

  return (
    <CssTextField
      select
      fullWidth
      variant="filled"
      SelectProps={{ MenuProps: { sx: { maxHeight: "535px"} } }}
      {...rest}
      disabled={disabledOnUpdate && id ? true : disabled}
    >
      {options.map(({ value, label }, index) => (
        <MenuItem
          key={index}
          value={value}
          disableTouchRipple
          selected={index === selectedIndex}
          // style={{userSelect:'text'}}
          onClick={() => setSelectedIndex(index)}
        >
          {label}
        </MenuItem>
      ))}
    </CssTextField>
  );
}
