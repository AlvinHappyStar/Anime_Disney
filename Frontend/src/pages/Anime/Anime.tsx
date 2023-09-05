import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";

import MusicDropZone from "components/atoms/MusicDropZone";
import ImageService from "services/image.service";
import AuthService from "services/auth.service";
import { backgroundActions } from "redux/slices/background";
import SocketService from "services/socket.service";

export default function Anime() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const visitedUser = useAppSelector((state) => state.user.user);
  const { play, music, bgType } = useAppSelector(
    (state) => state.background
  );

  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isFirefox = /Firefox/.test(navigator.userAgent);
  const { tab } = useAppSelector((state) => state.tab);

  useEffect(() => {
    if (tab != "user" && !user) {
      dispatch(backgroundActions.setBgType("public"));
    }
  }, [tab]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      // Set the current time before playing
      audioRef.current.currentTime = currentTime;
      if (play) audioRef.current.play();
      else audioRef.current.pause();
    }
  }, [user?.music, music, bgType, visitedUser, play]);

  useEffect(() => {
    ImageService.getBackgroundMusic(dispatch);
  }, []);


  const handlePlay = () => {
    SocketService.musicState(true);
    setCurrentTime(audioRef?.current?.currentTime!);
  };

  const handlePause = () => {
    SocketService.musicState(false);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          gap: "32px",
          // paddingTop: "18px",
        }}
      >
        <button
          onClick={() =>
            window.open("https://www.paypal.com/paypalme/DamianGower", "_blank")
          }
          style={{
            cursor: "pointer", display: "inline", marginLeft: "32px", border: 0,
            fontFamily: "'Varela Round', sans-serif",
            fontWeight: 500,
            fontSize: "16px",
            background: "none",
            color: "white",
            padding: 0,
            // marginTop: "2px",
            marginBottom: "0.83em",
            userSelect: "text",
            textAlign: "start"
          }}
        >
          Donate
        </button>
      </div>
      <div style={{ marginTop: isFirefox ? "273px" : "259px" }}>
        <audio
          controls
          loop
          ref={audioRef}
          onPlay={handlePlay}
          onPause={handlePause}
        // onLoad={handlePlay}
        >
          <source
            src={
              visitedUser
                ? `${process.env.REACT_APP_FILE_URL}/${bgType === "private" ? visitedUser?.music : music
                }`
                : user
                  ? `${process.env.REACT_APP_FILE_URL}/${bgType === "private" ? user?.music : music
                  }`
                  : `${process.env.REACT_APP_FILE_URL}/${music}`
            }
            type="audio/mpeg"
          />
          Your browser does not support the audio element.
        </audio>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "32px",

          }}
        >
          <button
            onClick={() => dispatch(backgroundActions.setBgType("public"))}
            style={{
              cursor: "pointer",
              border: 0,
              fontFamily: "'Varela Round', sans-serif",
              fontWeight: bgType === "public" ? 600 : 500,
              fontSize: "16px",
              background: "none",
              color: "white",
              padding: 0,
              marginBottom: "0.83em",
              userSelect: "text",
            }}
          >
            Public
          </button>
          <button
            onClick={() => {
              if (visitedUser || user)
                dispatch(backgroundActions.setBgType("private"));
            }}
            style={{
              cursor: (visitedUser || user) ? "pointer" : "default",
              border: 0,
              fontFamily: "'Varela Round', sans-serif",
              fontWeight: bgType === "private" ? 600 : 500,
              fontSize: "16px",
              background: "none",
              color: "white",
              padding: 0,
              marginBottom: "0.83em",
              userSelect: "text",
            }}
          >
            Private
          </button>
        </div>
      </div>
      <div className="music-upload-box" style={{ marginTop: "290px" }}>
        <MusicDropZone musicType={bgType} />
      </div>
    </>
  );
}
