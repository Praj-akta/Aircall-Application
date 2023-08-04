import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import userImg from "./images/user.svg";
import callImg from "./images/call.svg";
import mailImg from "./images/mail.svg";
import videoImg from "./images/video.svg";
import messageIcon from "./images/message.svg";
import arrowLeftImg from "./images/arrowLeft.svg";

const ActivityDetails = () => {
  const { state } = useLocation();
  const [callDetails, setCallDetails] = useState(null);

  useEffect(() => {
    fetch(`https://cerulean-marlin-wig.cyclic.app/activities/${state.id}`)
      .then((res) => res.json())
      .then((details) => {
        setCallDetails(details);
      });
  }, [state.id]);

  const archiveBtnClass =
    callDetails && callDetails.is_archived === false
      ? "btn-archive"
      : "btn-archive unarchive";

  function onBtnArchive() {
    if (callDetails) {
      const value = !callDetails.is_archived;
      fetch(
        `https://cerulean-marlin-wig.cyclic.app/activities/${callDetails.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            is_archived: value,
          }),
        }
      )
        .then((res) => res.json)
        .then(() => (window.location.href = "/"));
    }
  }

  function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay; 
  }

  return (
    <div className="call-details-container">
      {callDetails && (
        <React.Fragment>
          <Link to="/" className="back-btn">
            <button>
              <img src={arrowLeftImg} alt="Arrow left" />
              Back
            </button>
          </Link>
          <div className="profile">
            <img src={userImg} alt="profile image" className="profile-img" />
            <p className="number"> +1 {callDetails.to || callDetails.from} </p>
            <div className="options footer">
              <div className="items footer-items">
                <img src={messageIcon} alt="Message Icon" />
                <span> message </span>
              </div>
              <div className="items footer-items">
                <img src={callImg} alt="Call Icon" />
                <span> call </span>
              </div>
              <div className="items footer-items">
                <img src={videoImg} alt="Video Icon" />
                <span> video </span>
              </div>
              <div className="items footer-items">
                <img src={mailImg} alt="Mail Icon" />
                <span> mail </span>
              </div>
            </div>
            <div className="call-duration">
              <div className="details">
                <div className="time"> 12: 51 PM </div>
                <div className="call-type">
                  {callDetails.direction === "inbound"
                    ? callDetails.call_type === "missed"
                      ? "Missed call"
                      : "Incoming Call"
                    : "Outgoing Call "}
                </div>
              </div>
              <div className="duration"> {secondsToHms(callDetails.duration)} </div>
            </div>
            <button className={archiveBtnClass} onClick={onBtnArchive}>
              {callDetails.is_archived === false
                ? "Archive Call"
                : "Remove from Archive"}
            </button>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default ActivityDetails;
