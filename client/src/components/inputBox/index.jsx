import { useContext, useEffect, useState } from "react";
import { Context } from "../../App";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  styled,
} from "@mui/material";
import useMicFrequency from "../../hooks";
import { Mic, Send } from "@mui/icons-material";
import LanguageDropdown from "../languageDropdown";
import { observer } from "mobx-react-lite";
import { FormControl } from "@mui/material";

const InputBox = observer(({ onSend, text, setText }) => {
  const store = useContext(Context);
  const [isRecording, setIsRecording] = useState(false);
  const frequency = useMicFrequency({ isEnabled: Boolean(isRecording) });
  const handleSend = () => {
    if (text === "") {
      return;
    }
    onSend(text);
  };
  // eslint-disable-next-line react/prop-types
  const CustomBox = ({ volume, ...rest }) => {
    return <Box {...rest} />;
  };
  const StyledBox = styled(CustomBox)`
    & {
      position: absolute;
      border: 2px solid red;
      border-radius: 50%;
      opacity: 0.5;
      background-color: #dc143c;
      width: calc(40px + ${({ volume }) => Math.sqrt(volume)}px);
      height: calc(40px + ${({ volume }) => Math.sqrt(volume)}px);
      top: calc(50%-${({ volume }) => volume}px);
      left: calc(50%-${({ volume }) => volume}px);
    }
  `;
  const availableLanguages = [
    { value: "pl-PL", label: "Polski (PL)" },
    { value: "en-US", label: "English (US)" },
  ];
  const [language, setLanguage] = useState(availableLanguages[0].value);
  useEffect(() => {
    const recordText = () => {
      if ("webkitSpeechRecognition" in window) {
        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = language;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.start();
        recognition.onresult = (event) => {
          if (isRecording) {
            const speechResult = event.results[0][0].transcript;
            setText(text ? text + " " + speechResult : speechResult);
          } else {
            recognition.stop();
            setIsRecording(false);
          }
        };
        recognition.onspeechend = () => {
          recognition.stop();
          setIsRecording(false);
        };
        recognition.onerror = (event) => {
          console.log(event.error);
        };
      } else {
        return;
      }
    };
    if (isRecording) {
      recordText();
    }
  }, [isRecording]);
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && text.trim() !== "") {
      handleSend();
    }
  };

  return (
    <FormControl
      fullWidth
      sx={{
        "&.MuiFormControl-root": {
          display: "flex",
          flexDirection: "row",
          gap: "1rem",
          fullWidth: true,
        },
      }}
    >
      <LanguageDropdown
        languages={availableLanguages}
        currentLanguage={language}
        changeLanguage={setLanguage}
      />
      <TextField
        fullWidth
        maxRows={1}
        multiline
        placeholder="Wpisz wiadomość"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={handleKeyDown}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSend}>
                <Send />
              </IconButton>
            </InputAdornment>
          ),
          startAdornment: (
            <InputAdornment position="start">
              <IconButton
                onClick={() => {
                  setIsRecording(!isRecording);
                }}
                backgroundColor="red"
              >
                <StyledBox
                  volume={frequency}
                  sx={{
                    display: isRecording ? "block" : "none",
                    pointerEvents: "none",
                    width: "100%",
                    position: "absolute",
                    height: "100%",
                  }}
                />
                <Mic />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </FormControl>
  );
});

export default InputBox;
