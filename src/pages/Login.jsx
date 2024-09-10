import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { ref, update, get } from 'firebase/database';
import useFirebase from "../hooks/useFirebase";
import styles from "../styles/Login.module.scss";
import logo from "../assets/vaco.png";

function Login() {
    const [nickname, setNickname] = useState("");
    const { db } = useFirebase();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setNickname(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (nickname.trim()) {
            try {
                if (!db) {
                    throw new Error("Firebase 데이터베이스가 초기화되지 않았습니다.");
                }

                const userListRef = ref(db, "users/userList");

                const snapshot = await get(userListRef);
                const currentData = snapshot.val() || {};
                const updatedNicknames = [...(currentData.nicknames || []), nickname];

                await update(userListRef, {
                    nicknames: updatedNicknames
                });

                navigate(`/messenger?nickname=${nickname}`);
            } catch (error) {
                console.error("닉네임 저장 중 오류가 발생했습니다:", error.message);
                alert(`닉네임을 저장하는 데 문제가 발생했습니다: ${error.message}`);
            }
        } else {
            alert("닉네임을 입력해주세요.");
        }
    };

    return (
        <div className={styles['login-container']}>
            <img src={logo} className="logo" alt="logo" />
            <form onSubmit={handleSubmit} className={styles['login-input-container']}>
                <label htmlFor="login" className="blind">닉네임을 입력해주세요.</label>
                <div className={styles['login-input-wrap']}>
                    <input
                        type="text"
                        className={styles['login-input']}
                        id="login"
                        value={nickname}
                        onChange={handleInputChange}
                        placeholder="닉네임을 입력해주세요."
                    />
                </div>
                <button type="submit" className={styles['login-input-button']}>
                    <span className="blind">입력</span>
                </button>
            </form>
        </div>
    );
}

export default Login;
