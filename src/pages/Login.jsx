import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import useFirebase from "../hooks/useFirebase";
import styles from "../styles/Login.module.scss";

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
                const userDocRef = doc(db, "users", "userList");

                await updateDoc(userDocRef, {
                    nicknames: arrayUnion(nickname)
                });

                navigate(`/messenger?nickname=${nickname}`);
            } catch (error) {
                console.error("닉네임 저장 중 오류가 발생했습니다:", error);
                alert("닉네임을 저장하는 데 문제가 발생했습니다.");
            }
        } else {
            alert("닉네임을 입력해주세요.");
        }
    };

    return (
        <div className={styles['login-container']}>
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
