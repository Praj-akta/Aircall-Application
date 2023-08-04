import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import outgoingImg from "./images/outbound.svg";
import archiveImg from "./images/archive.svg";
import threeDotsImg from "./images/threeDots.svg";
import recentsImg from "./images/recents.svg";
import userImg from "./images/user.svg";
import keypadImg from "./images/keypad.svg";
import settingsImg from "./images/settings.svg";
import voiceMailImg from "./images/voicemail.svg";
import incomingCallImg from "./images/incomingCall.svg";

function Activities() {
  const tabs = [
    {
      displayName: "All calls",
      active: true,
    },
    {
      displayName: "Archived",
      active: false,
    },
  ];
  const [data, setData] = useState(null);
  const [tabsList, setModifiedTabs] = useState(tabs);
  const [archiveList, setArchiveList] = useState([]);
  const [selectedTab, setSelectedTab] = useState("All calls");

  useEffect(() => {
    // calling activities api list
    fetch("https://cerulean-marlin-wig.cyclic.app/activities")
      .then((res) => res.json())
      .then((data) => {
        const _data = data.filter(
          (value) =>
            (value.direction === "inbound" || value.direction === "outbound") &&
            value.is_archived === false
        );
        const archivedData = data.filter((val) => val.is_archived === true);
        setData(_data);
        setArchiveList(archivedData);
      });
  }, []);

  function onTabClick(value) {
    const modifiedTabs = tabs.map((data) => {
      if (data.displayName === value) {
        data.active = true;
        setSelectedTab(data.displayName);
      } else {
        data.active = false;
      }
      return data;
    });
    setModifiedTabs(modifiedTabs);
  }

  function archiveAllCalls() {
    const value = confirm(
      `Are you sure you want to archive ${data.length} calls?`
    );
    if (value) {
      return data.map((callDetail) => {
        fetch(
          `https://cerulean-marlin-wig.cyclic.app/activities/${callDetail.id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              is_archived: true,
            }),
          }
        )
          .then((res) => res.json)
          .then(() => (window.location.href = "/"));
      });
    }
  }

  function unarchiveAllCalls() {
    const value = confirm(
      `Are you sure you want to unarchive ${archiveList.length} calls?`
    );
    if (value) {
      return fetch("https://cerulean-marlin-wig.cyclic.app/reset", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }
      })
        .then((res) => res.json)
        .then(() => (window.location.href = "/"));
    }
  }

  return (
    <div className="activities-container">
      <ul className="headings">
        {tabsList.map(({ displayName, active }, index) => {
          return (
            <li
              key={index}
              className={active ? "active" : ""}
              onClick={(_) => onTabClick(displayName)}
            >
              {displayName}
            </li>
          );
        })}
      </ul>
      <div className="call-list">
        {selectedTab === "All calls" ? (
          <React.Fragment>
            <button className="archive-calls" onClick={archiveAllCalls}>
              <img src={archiveImg} alt="Archive Image" />
              Archive all calls
            </button>
            {data &&
              data.map((value, index) => {
                const missCallClass =
                  value.direction === "inbound" && value.call_type === "missed"
                    ? "missed-call"
                    : "";

                return callList(value, index, missCallClass);
              })}
          </React.Fragment>
        ) : archiveList && archiveList.length > 0 ? (
          <React.Fragment>
            <button className="archive-calls" onClick={unarchiveAllCalls}>
              <img src={archiveImg} alt="Archive Image" />
              Unarchive all calls
            </button>
            {archiveList.map((value, index) => {
              return callList(value, index);
            })}
          </React.Fragment>
        ) : (
          <h1> No Archived calls</h1>
        )}
      </div>
      <div className="footer">
        <div className="footer-items active">
          <img src={recentsImg} alt="Recents image" />
          <span> Recents </span>
        </div>
        <div className="footer-items">
          <img src={userImg} alt="user image" />
          <span> Contacts </span>
        </div>
        <div className="keypad">
          <img src={keypadImg} alt="keypad image" />
        </div>
        <div className="footer-items">
          <img src={settingsImg} alt="Settings image" />
          <span> Settings </span>
        </div>
        <div className="footer-items">
          <img src={voiceMailImg} alt="Voicemail image" />
          <span> Voicemail </span>
        </div>
      </div>
    </div>
  );
}

const callList = (data, index, missCallClass) => {
  return (
    <Link
      key={index}
      className="calls"
      to="/call-details"
      state={{ id: data.id }}
    >
      <div>
        {data.direction === "outbound" ? (
          <img src={outgoingImg} alt="outbound call Image" />
        ) : (
          <img src={incomingCallImg} alt="Incoming call Image" />
        )}
        <div className={missCallClass}>
          +1 {data.direction === "inbound" ? data.to : data.from}
        </div>
      </div>
      <div>
        <img src={threeDotsImg} alt="three dots img" />
        <div> 7:58 PM </div>
      </div>
    </Link>
  );
};

export default Activities;
