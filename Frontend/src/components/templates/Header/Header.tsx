import "./Header.css";
import { Grid } from "@mui/material";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { tabActions } from "redux/slices/tab";
import { useNavigate } from "react-router-dom";
import { authActions } from "redux/slices/auth";
import { messageActions } from "redux/slices/message";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { tab } = useAppSelector((state) => state.tab);
  return (
    <header>
      <div className="navbar">
        <Grid container alignItems="center" justifyContent="center">
          <Grid item xs={12} lg={6}>
            <ul>
              <li
                onClick={() => {
                  navigate("/");
                  dispatch(messageActions.setMessages([]));
                  dispatch(tabActions.setTab("chat"));
                  dispatch(authActions.setChat(null));
                }}
                style={{ fontWeight: tab === "chat" ? "900" : "500" }}
              >
                Chat
              </li>
              <li
                onClick={() => dispatch(tabActions.setTab("gif"))}
                style={{ fontWeight: tab === "gif" ? "900" : "500" }}
              >
                Gif
              </li>
              <li
                onClick={() => dispatch(tabActions.setTab("picture"))}
                style={{ fontWeight: tab === "picture" ? "900" : "500" }}
              >
                Picture
              </li>
              <li
                onClick={() => dispatch(tabActions.setTab("video"))}
                style={{ fontWeight: tab === "video" ? "900" : "500" }}
              >
                Video
              </li>
              <li
                onClick={() => dispatch(tabActions.setTab("music"))}
                style={{ fontWeight: tab === "music" ? "900" : "500" }}
              >
                Music
              </li>
              <li
                onClick={() => {
                  navigate("/");
                  dispatch(tabActions.setTab("user"));
                }}
                style={{ fontWeight: tab === "user" ? "900" : "500" }}
              >
                User
              </li>
            </ul>
          </Grid>
        </Grid>
      </div>
    </header>
  );
}
