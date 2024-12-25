"use client";

import {
  LocalUser,
  RemoteUser,
  useIsConnected,
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";
import React, { useState, useEffect } from "react";
import "../style.css";
export const Basics = () => {
  const [isClient, setIsClient] = useState(false);

  // Ensure component only renders on client-side

  const [calling, setCalling] = useState(false);
  const isConnected = useIsConnected(); // Store the user's connection status
  // const appId = "438cab05d11a4c948444027a10e1bb04";
  const appId = process.env.NEXT_PUBLIC_APPID || "";
  const [name, setName] = useState("");
  const channel = "channel1";
  //  const token = "da40bee493b84bb6a93ac42af4e0e534";
  // const token =
  //   "007eJxTYJAMDz///l7E+p+FX7/Ocb7knbyheLPonY0XLjh3xliGOmQpMJgYWyQnJhmYphgaJpokW5pYmJiYGBiZJxoapBomJRmYhAtmpzcEMjIUnjjPzMgAgSA+B0NyRmJeXmqOIQMDAGgTIhc=";

  const token = process.env.NEXT_PUBLIC_TOKEN;
  console.log("APP id is ", appId);
  console.log("token is ", token);
  useJoin(
    { appid: appId, channel: channel, token: token ? token : null },
    calling
  );

  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);

  usePublish([localMicrophoneTrack, localCameraTrack]);

  const remoteUsers = useRemoteUsers();
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="room">
        {isConnected ? (
          <div className="user-list">
            <div className="user">
              <LocalUser
                audioTrack={localMicrophoneTrack}
                cameraOn={cameraOn}
                micOn={micOn}
                videoTrack={localCameraTrack}
                cover="https://www.agora.io/en/wp-content/uploads/2022/10/3d-spatial-audio-icon.svg"
              >
                <samp className="user-name">{name}</samp>
              </LocalUser>
            </div>
            {remoteUsers.map((user, index) => (
              <div className="user" key={user.uid || index}>
                <RemoteUser
                  cover="https://www.agora.io/en/wp-content/uploads/2022/10/3d-spatial-audio-icon.svg"
                  user={user}
                >
                  {/* <samp className="user-name">{index}</samp> */}
                </RemoteUser>
              </div>
            ))}
          </div>
        ) : (
          <div className="join-room">
            <input
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              value={name}
            />

            <button
              className={`join-channel ${!appId || !channel ? "disabled" : ""}`}
              disabled={!appId || !channel}
              onClick={() => setCalling(true)}
            >
              <span>Join Channel</span>
            </button>
          </div>
        )}
      </div>
      {isConnected && (
        <div className="control">
          <div className="left-control">
            <button className="btn" onClick={() => setMic((a) => !a)}>
              <i className={`i-microphone ${!micOn ? "off" : ""}`} />
            </button>
            <button className="btn" onClick={() => setCamera((a) => !a)}>
              <i className={`i-camera ${!cameraOn ? "off" : ""}`} />
            </button>
          </div>
          <button
            className={`btn btn-phone ${calling ? "btn-phone-active" : ""}`}
            onClick={() => setCalling((a) => !a)}
          >
            {calling ? (
              <i className="i-phone-hangup" />
            ) : (
              <i className="i-mdi-phone" />
            )}
          </button>
        </div>
      )}
    </>
  );
};

export default Basics;
