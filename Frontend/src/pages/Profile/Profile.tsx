import { Grid } from "@mui/material";
import Gifs from "pages/Gifs";
import Members from "pages/Members";
import Music from "pages/Music";
import Pictures from "pages/Pictures";
import Anime from "pages/Anime";
import User from "pages/User";
import Videos from "pages/Videos";
import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { tabActions } from "redux/slices/tab";
import { userActions } from "redux/slices/users";
import UsersService from "services/users.service";
import { authActions } from "redux/slices/auth";
import { io } from "socket.io-client";
export default function Profile() {
  const socket: any = useRef();
  const [id, setId] = useState<string>("");
  const idRef = useRef(id);  // Create a ref for the id

  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const { tab } = useAppSelector((state) => state.tab);
  const { users } = useAppSelector((state) => state.user);
  const profileUser = useAppSelector((state) => state.user.user);
  const {
    user,
    online,
    tab: memberTab,
  } = useAppSelector((state) => state.auth);

  // useEffect(() => {
  //   if(id) {
  //     UsersService.getUser(id);  
  //   }
  // }, [users]);
  useEffect(() => {
    idRef.current = id;  // Update the ref's value whenever id changes
  }, [id]);
  useEffect(() => {
    socket.current = io("http://95.216.22.143:3001");
    // socket.current = io("https://api.animedisney.com");
    socket.current.on("photoUpdate", () => {
      if (idRef.current && idRef.current != 'undefined') {
        console.log("userIdRef:", idRef.current);
        UsersService.getUser(idRef.current);
      }
    });
    dispatch(tabActions.setTab("user"));

    let pathArray = pathname.split("/");
    let userId = pathArray.pop();
    if ((user == null || user._id == undefined || userId != user._id) && userId != undefined) {
      console.log("userId:", userId);
      setId(userId);
    }
    if (userId != 'undefined')
        UsersService.getUser(userId);
    // Polling logic here
    // const interval = setInterval(() => {
    //   UsersService.getUserFriend(userId);
    // }, 1000); // every 1 second

    return () => {
      dispatch(userActions.setUser(null));
      // clearInterval(interval); // Clear the interval when the component is unmounted or pathname changes
    };
  }, [pathname]);


  return (
    <div className="main">
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <div
            className="basic-box left-section"
            style={{
              display: "flex",
              alignItems: "center",
              // justifyContent: "space-between",
              flexDirection: "column",
              // height: "calc(100vh - 124px)",
              overflow: "hidden",
              // marginTop: '6px'
            }}
          >
            <Anime />
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <div style={{ position: "relative" }}>
            <div className="center-box">
              {tab === "gif" ? (
                <Gifs />
              ) : tab === "picture" ? (
                <Pictures />
              ) : tab === "video" ? (
                <Videos />
              ) : tab === "music" ? (
                <Music />
              ) : tab === "user" ? (
                <User />
              ) : (
                ""
              )}
            </div>
          </div>
        </Grid>
        <Grid item xs={12} md={3}>
          <h2
            className="heading"
            style={{
              marginTop: "2px",
              padding: "0px 24px",
            }}
          >
            <span
              className={`${memberTab === "online" ? "active" : ""}`}
              onClick={() => dispatch(authActions.setTab("online"))}
            >
              {" "}
              Online ({online?.length ?? 0}){" "}
            </span>

            <span
              className={`${memberTab === "registered" ? "active" : ""}`}
              onClick={() => dispatch(authActions.setTab("registered"))}
            >
              {" "}
              Registered ({users.length})
            </span>
            <span
              className={`${memberTab === "friends" ? "active" : ""}`}
              onClick={() => dispatch(authActions.setTab("friends"))}
            >
              {" "}
              Friends ({id ? (profileUser?.friends?.length ?? 0) : (user?.friends?.length ?? 0)})
            </span>
          </h2>
          <div
            className="basic-box right-section"
            style={{ height: "calc( 100vh - 164px )", padding: "0px 24px" }}
          >
            <Members userId={id} />
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
