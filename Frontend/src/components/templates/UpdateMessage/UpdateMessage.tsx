import useAutosizeTextArea from "hooks/useAutosizeTextArea";
import { useEffect, useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "redux/hooks";
import MessageService from "services/message.service";
import { authActions } from "redux/slices/auth";
export default function UpdateMessage({ message, ScrollDown }: any) {
  const dispatch = useAppDispatch();
  const [value, setValue] = useState(message);
  const { user, chat } = useAppSelector((state) => state.auth);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const edit = useAppSelector((state) => state.auth.edit);
  const { messages } = useAppSelector((state) => state.message);
  const hiddenDivRef = useRef<HTMLDivElement>(null);
  const isFirefox = /Firefox/.test(navigator.userAgent);
  // const textareaRef = useRef(null);
  // const [text, setText] = useState("sad");



  const updateMessage = (value: any) => {
    if ((!messages[edit].fromSelf || !chat) && user || messages[edit].fromSelf && !user) {
      let data = {
        id: messages[edit]._id,
        _id: messages[edit]._id,
        message: value,
        p_user: user,
        fromSelf: true
      };
      MessageService.updateChat(data, dispatch);
    } else {
      let data = {
        id: messages[edit]._id,
        _id: messages[edit]._id,
        message: value,
        p_user: user,
        fromSelf: true
      };
      MessageService.updateMessage(data, dispatch);
    }
    dispatch(authActions.setEdit(-1));
  };

  useAutosizeTextArea(textAreaRef.current, value);

  useEffect(() => {
    setValue(message);
    if (hiddenDivRef.current) {
      hiddenDivRef.current.textContent = message;
      adjustWidth(message);
    }
    // adjustWidth(message);
  }, []);

  // useEffect(() => {
  //   adjustWidth(message);
  // }, [message])

  const isChildInView = (childRef: any, parentRef: any) => {
    const parentRect = parentRef.getBoundingClientRect();
    const childRect = childRef.getBoundingClientRect();

    return (
      childRect.top >= parentRect.top &&
      childRect.bottom <= (parentRect.bottom + 1) &&
      childRect.left >= parentRect.left &&
      childRect.right <= parentRect.right
    );
  }

  const adjustWidth = (text: any) => {
    if (textAreaRef.current && hiddenDivRef.current) {

      const words = text.length;


      const newWidth = Math.min(parseFloat(hiddenDivRef.current.getBoundingClientRect().width.toFixed(2)), 800); // Ensure width doesn't exceed 800px
      textAreaRef.current.style.width = `${newWidth}px`;
      textAreaRef.current.style.height = `${parseFloat(hiddenDivRef.current.getBoundingClientRect().height.toFixed(2))}px`;
      
      // (textAreaRef.current.parentNode as HTMLElement).style.height = `${parseFloat(hiddenDivRef.current.getBoundingClientRect().height.toFixed(2))}px`
      if (!isChildInView(textAreaRef?.current?.parentNode?.parentNode?.parentNode?.parentNode as HTMLElement, textAreaRef?.current?.parentNode?.parentNode?.parentNode?.parentNode?.parentNode as HTMLElement)) {
        setTimeout(() => {
          (textAreaRef?.current?.parentNode?.parentNode?.parentNode?.parentNode as HTMLElement)?.scrollIntoView({ block: "end" });
          console.log("asdf");
        }, 1);
      }
      //ScrollDown();
    }
  }

  return (
    <>
      <textarea
        ref={textAreaRef}
        defaultValue={message}
        style={{
          // width: "100%",
          resize: "none",
          background: "none",
          border: "none",
          fontSize: "16px",
          lineHeight: isFirefox ? 1.3 : 1.4,
          wordBreak: "break-all",
          padding: 0,
          minWidth: "55px",
          overflow: "hidden",
          minHeight: "22.39px",
          position: "absolute"
        }}
        rows={1}
        onChange={(e) => {
          setValue(e.target.value)
          if (hiddenDivRef.current) {
            hiddenDivRef.current.textContent = e.target.value;
          }
          adjustWidth(e.target.value);
        }}
        onKeyDown={(e: any) => {
          if (e.keyCode === 13 && !e.shiftKey) {
            e.preventDefault();
            // if (user) {
            updateMessage(e.target.value);
            // }
          } else {
            setValue(e.target.value);
            // console.log(e.target.value);
            // setText(e.target.value);

          }
        }}
      />
      <div
        ref={hiddenDivRef}
        style={{
          display: 'inline-block',
          visibility: 'hidden',
          // height: 0,
          // position: "absolute",
          overflow: 'hidden',
          whiteSpace: 'pre-wrap', // preserve whitespaces & new lines
          fontSize: "16px",
          lineHeight: 1.4,
          wordBreak: "break-all",
          padding: 0,
          maxWidth: "800px"
        }}
      >
        {/* {value} */}
      </div>
    </>
  );
}
