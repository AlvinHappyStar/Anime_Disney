import GuestIcon from "assets/Tiger.png";
import Friends from "components/templates/Friends/Friends";
import PhotoGallery from "components/templates/PhotoGallery/PhotoGallery";
import UpdateMessage from "components/templates/UpdateMessage/UpdateMessage";
import moment from "moment";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { authActions } from "redux/slices/auth";
import { backgroundActions } from "redux/slices/background";
import { messageActions } from "redux/slices/message";
import { tabActions } from "redux/slices/tab";
import AuthService from "services/auth.service";
import MessageService from "services/message.service";

export default function Chat() {
  const dispatch = useAppDispatch();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { messages } = useAppSelector((state) => state.message);
  const { user, chat, edit } = useAppSelector((state) => state.auth);
  const { socketId } = useAppSelector((state) => state.socket);

  useEffect(() => {
    if (edit == null) {
      ScrollDown();
    }
    if (edit == -1) {
      dispatch(authActions.setEdit(null));
    }
  }, [messages]);

  const ScrollDown = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", "block": "nearest" });
    console.log("scrollDown");
  }

  useEffect(() => {
    if (user) {
      if (chat) {
        let data = {
          currentUser: user?._id,
          currentChat: chat?._id,
        };
        MessageService.getCurrentMessages(data, dispatch);
      } else {
        MessageService.getChat(dispatch);
      }
    }
    else
      MessageService.getChat(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat?._id, user]);

  const makeUrlsClickable = (message: any) => {
    const urlPattern = /(https?:\/\/\S+)/g;
    return message.replace(urlPattern, '<a href="$1" target="_blank">$1</a>');
  };
  return (
    <>
      {/* <h2 className="heading">Chat</h2> */}
      {/* ${user?.friends?.length > 0 ? "330.5px" : "295px"} */}

      <Friends />
      <div
        className="chat-big-box"
        style={{
          height: `calc( 100vh - 330px)`,
          overflowY: "auto",
          paddingRight: "30px",
          marginBottom: "30px",
          overflowX: "hidden",
          display:'flex',
          flexDirection:'column',
          gap:"30px",
          marginTop:"24px",
        }}
      >
        {messages.map((message: any, index: any) => {
          if (
            (!chat && message?.type === "private") ||
            (chat && message?.type === "public")
          )
            return <></>;
          else
            return (
              <div className="chat-message" key={index} ref={scrollRef}>
                <div className="chat-user-data">
                  {/* <img
                    src={
                      chat
                        ? message.fromSelf
                          ? user?.profile_picture
                            ? `${process.env.REACT_APP_FILE_URL}/${user?.profile_picture}`
                            : GuestIcon
                          : chat?.profile_picture
                          ? `${process.env.REACT_APP_FILE_URL}/${chat?.profile_picture}`
                          : GuestIcon
                        : message?.p_user?.profile_picture
                        ? `${process.env.REACT_APP_FILE_URL}/${message?.p_user?.profile_picture}`
                        : GuestIcon
                    }
                    alt="Guest"
                  /> */}
                  <div
                    style={{
                      minWidth: "80px",
                      maxWidth: "80px",
                      cursor: "pointer",
                    }}
                  >
                    <PhotoGallery
                      group="no"
                      image={
                        chat
                          ? message.fromSelf
                            ? user?.profile_picture
                              ? `${process.env.REACT_APP_FILE_URL}/${user?.profile_picture}`
                              : GuestIcon
                            : chat?.profile_picture
                              ? `${process.env.REACT_APP_FILE_URL}/${chat?.profile_picture}`
                              : GuestIcon
                          : message?.p_user?.profile_picture
                            ? `${process.env.REACT_APP_FILE_URL}/${message?.p_user?.profile_picture}`
                            : GuestIcon
                      }
                    />
                  </div>
                  <p
                    style={{
                      textTransform: "capitalize",
                      paddingLeft: "4px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      overflow:'hidden',
                    }}
                    onClick={() => {
                      if (user && !chat && message?.p_user?._id != undefined) {
                        if (user?._id !== message?.p_user?._id) {
                          dispatch(messageActions.setMessages([]));
                          AuthService.addFriend(message?.p_user, dispatch);
                          dispatch(authActions.setChat(message?.p_user));
                          // if(message?.p_user?._id) {
                          //   AuthService.relationship({ id: message?.p_user?._id }, dispatch);
                          // }
                        }
                      }
                    }}
                  >
                    {(chat
                      ? message.fromSelf
                        ? `${user?.name}`
                        : `${chat?.name}`
                      : `${message?.p_user?.name}`) == "undefined" ? "Anime" : (chat
                        ? message.fromSelf
                          ? `${user?.name}`
                          : `${chat?.name}`
                        : `${message?.p_user?.name}`)}
                  </p>
                </div>
                <div
                  className="bubble"
                  style={{ maxWidth: edit === index ? "100%" : "auto" }}
                >
                  <div className="bubble-inner">
                    <p style={{ textAlign: "right", overflow:'hidden' }}>
                      <Link
                        to={`/profile/${chat
                          ? message.fromSelf
                            ? user._id
                            : chat?._id
                          : message?.p_user?._id ?? message?.userId
                          }`}
                        onClick={() => {
                          dispatch(tabActions.setTab("user"));
                          dispatch(backgroundActions.setBgType("private"));
                        }}
                        style={{
                          color: "#ffffff",
                          textTransform: "capitalize",
                          textDecoration: "none",
                        }}
                      >
                        {chat
                          ? message.fromSelf
                            ? user?.race ?? "Anime"
                            : chat?.race ?? "Anime"
                          : message?.p_user?.race ?? "Anime"}
                      </Link>
                    </p>
                    <div className="text-message" style={{ flexDirection: "column", alignItems: "flex-start" }}>
                      {edit === index ? (
                        <UpdateMessage message={message.message} ScrollDown={ScrollDown} />
                      ) : (
                        <p
                          onClick={() =>
                            (user?._id && user?._id === message?.p_user?._id || socketId === message?.socketId || message?.fromSelf) &&
                            dispatch(authActions.setEdit(index))
                          }
                          style={{
                            whiteSpace: 'pre-wrap', // preserve whitespaces & new lines
                            fontSize: "16px",
                            lineHeight: 1.4,
                            wordBreak: "break-all",
                            padding: 0,
                            maxWidth: "800px",
                            overflow:'hidden'
                          }}
                          dangerouslySetInnerHTML={{
                            __html: makeUrlsClickable(message.message.replace(/\n/g, '<br>')),
                          }}
                        >
                        </p>
                      )}
                    </div>
                    <div className="race-chat">
                      <p style={{overflow:'hidden'}}>
                        {moment(message.createdAt).format("h:mm a")}&nbsp;&nbsp;
                      </p>
                      <p style={{overflow:'hidden'}}>{moment(message.createdAt).format("DD/MM/yyyy")} </p>
                    </div>
                  </div>
                </div>
              </div>
            );
        })}
      </div>
    </>
  );
}
