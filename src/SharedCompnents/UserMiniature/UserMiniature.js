import React, { useState, useEffect } from "react";
import defaultUserIcon from './imgs/default_user.png'
import './UserMiniature.css'

function UserMiniature(props) {

    const [user, setUser] = useState(null);

    useEffect(() => {
        setUser(props.user)
    }, [props.user]);

    let variation = null;
    if ("variation" in props) {
        variation = props.variation;
    }

    // navigation variation modal
    const [isModalActive, setModalActive] = useState(false);
    function openModal() {
        setModalActive(true);
    }
    function closeModal() {
        setModalActive(false);
    }
    function toggleModal() {
        setModalActive(!isModalActive);
    }

    // Logout
    function logout() {
        user.logout(
            () => {
                window.location.href = "/login";
            },
            () => { }
        );
    }

    return (
        <div className={`loged-in-user ${user == null ? "hidden" : ""} ${variation != null ? variation : ""}`}>
            {
                variation == "navigation" ? (
                    <>
                        <img className="user-icon" src={defaultUserIcon} onClick={toggleModal} />
                        <span className="user-name">{user == null ? "" : user.firstName}</span>
                        <div className={`user-modal ${isModalActive ? "" : "closed"}`}>
                            <a onClick={() => { }}>Settings</a>
                            <a onClick={logout}>Logout</a>
                        </div>
                        <div className={`filter user-modal-filter ${isModalActive ? "" : "hidden"}`}
                            onClick={closeModal}
                        ></div>
                    </>
                ) : (
                    <>
                        <img className="user-icon" src={defaultUserIcon} />
                        <div className="user-info">
                            <span className="user-name">{user == null ? "" : `${user.firstName} ${user.lastName}`}</span>
                            <span className="user-email">{user == null ? "" : user.email}</span>
                            <a onClick={props.logout} className="user-logout">Logout</a>
                        </div>
                    </>
                )
            }
        </div >
    )

}
export default UserMiniature;