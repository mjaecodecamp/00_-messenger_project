import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ref, set, onValue, push } from 'firebase/database';
import useFirebase from "../hooks/useFirebase";
import styles from "../styles/Messenger.module.scss";
import logo from "../assets/vaco.png";

function Messenger() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const nickname = params.get('nickname');
    const { db } = useFirebase();

    const generateHexCode = () => {
        return `#${(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, "0")}`;
    };

    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");

    useEffect(() => {
        const messagesRef = ref(db, "chat/messages");

        // 실시간으로 메시지 목록을 받아옴
        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            setMessages(data ? Object.values(data) : []);
        });

        return () => unsubscribe();
    }, [db]);

    const handleInputChange = (e) => {
        setInputMessage(e.target.value);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (inputMessage.trim()) {
            try {
                const currentDateTime = new Date();
                const hours = currentDateTime.getHours();
                const minutes = currentDateTime.getMinutes();
                const ampm = hours >= 12 ? '오후' : '오전';
                const formattedHours = hours % 12 || 12;
                const formattedDateTime = `${currentDateTime.getMonth() + 1}월 ${currentDateTime.getDate()}일 ${ampm} ${formattedHours}시 ${minutes}분`;

                const newMessage = {
                    nickname: nickname,
                    text: inputMessage,
                    timestamp: formattedDateTime,
                    color: generateHexCode()
                };

                const messagesRef = ref(db, "chat/messages");
                const newMessageRef = push(messagesRef);
                await set(newMessageRef, newMessage);

                setInputMessage("");
            } catch (error) {
                console.error("메시지 전송 오류:", error);
                alert("메시지를 전송하는 데 문제가 발생했습니다.");
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage(e);
        }
    };

    return (
        <div className={styles['chat-container']}>
            <img src={logo} className="logo" alt="logo"/>
            <div className={styles['chat-inner']}>
                <div className={styles['chat-message-container']}>
                    <ul className={styles['chat-message-list']}>
                        {messages.map((message, index) => {
                            const isOwnMessage = message.nickname === nickname;
                            return (
                                <li
                                    key={index}
                                    className={`${styles['chat-message-item']} ${isOwnMessage ? styles['right'] : ''}`}>
                                    <strong
                                        className={styles['chat-message-nickname']}
                                        style={{backgroundColor: message.color}}>
                                        💁🏻‍ {message.nickname}
                                    </strong>
                                    <p className={styles['chat-message-text']}>{message.text}</p>
                                    <span className={styles['chat-message-date']}>{message.timestamp}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className={styles['chat-message-send-container']}>
                    <label htmlFor="sendMessage" className="blind">메시지</label>
                    <input
                        type="text"
                        id="sendMessage"
                        className={styles['chat-message-send-input']}
                        value={inputMessage}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="메시지를 입력해주세요."
                    />
                    <button
                        type="submit"
                        className={styles['chat-message-send-button']}
                        onClick={handleSendMessage}
                    >
                        <span className="blind">메시지 발송하기</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Messenger;
