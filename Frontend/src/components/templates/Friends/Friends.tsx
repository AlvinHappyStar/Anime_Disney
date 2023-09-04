import { useAppDispatch, useAppSelector } from "redux/hooks";
import CloseIcon from "@mui/icons-material/Close";
import AuthService from "services/auth.service";
import { authActions } from "redux/slices/auth";
import { messageActions } from "redux/slices/message";
import { tabActions } from "redux/slices/tab";
import MessageService from "services/message.service";
import SocketService from "services/socket.service";

export default function Friends() {
  const dispatch = useAppDispatch();
  const { tab } = useAppSelector((state) => state.tab);
  const { user, chat } = useAppSelector((state) => state.auth);

  return (
    <div className="friends-list" style={{ marginTop: '-8px', fontSize: '16px' }}>
      <div
        className={`friend-tag`}
        style={{ height: "33.433px" }}
      >
        <p
          style={{
            margin: 0,
            cursor: "pointer",
            whiteSpace: "nowrap",
            fontWeight: !chat && tab === "chat" ? 600 : "",
          }}
          onClick={() => {
            dispatch(messageActions.setMessages([]));
            dispatch(tabActions.setTab("chat"));
            dispatch(authActions.setChat(null));
          }}
        >
          Chat
        </p>
      </div>
      <div
        className={"friend-tag"}
        style={{ height: "33.433px" }}
      >
        <p
          style={{
            margin: 0,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
          onClick={() => {
            if (chat) {
              MessageService.deleteAllPrivateChat(chat?._id, dispatch);
              SocketService.sendDeleteUserChat(user?.id, chat?._id);
            } else MessageService.deleteAllChat(dispatch);
          }}
        >
          Delete
        </p>
      </div>
      {user &&
        user?.friends &&
        user?.friends.map((friend: any, index: number) => (
          <div
            className={"friend-tag"}
          >
            <p
              style={{ margin: 0, cursor: "pointer", whiteSpace: "nowrap", fontWeight: friend?._id === chat?._id ? 600 : "", }}
              onClick={() => {
                dispatch(messageActions.setMessages([]));
                dispatch(authActions.setChat(friend));
              }}
            >
              {friend.name}
            </p>
            <div style={{ paddingLeft: "6px" }}>
              <CloseIcon
                onClick={() => {
                  dispatch(authActions.setChat(null));
                  dispatch(messageActions.setMessages([]));
                  AuthService.removeFriend(friend, dispatch);
                }}
                style={{
                  cursor: "pointer",
                  width: "18px",
                  display: "flex",
                  color: "#ffffff",
                }}
              />
            </div>
          </div>
        ))}
    </div>
  );
}
