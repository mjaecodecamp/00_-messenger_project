import React from "react";
import styles from "../styles/Login.module.scss";

function Login() {
    return (
        <div className={styles['login-container']}>
            <div className={styles['login-input-container']}>
                <label htmlFor="login" className="blind">닉네임을 입력해주세요.</label>
                <div className={styles['login-input-wrap']}>
                    <input type="text" className={styles['login-input']} id="login" placeholder="닉네임을 입력해주세요."/>
                </div>
                <button type="submit" className={styles['login-input-button']}>
                    <span className="blind">입력</span>
                </button>
            </div>
        </div>
    );
}

export default Login;
