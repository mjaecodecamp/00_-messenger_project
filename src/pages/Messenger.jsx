import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import useFirebase from "../hooks/useFirebase";
import styles from "../styles/Messenger.module.scss";

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
        const fetchMessages = async () => {
            try {
                const docRef = doc(db, "chat", "messages");
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setMessages(docSnap.data().messages || []);
                } else {
                    await setDoc(docRef, { messages: [] });
                    setMessages([]);
                }
            } catch (error) {
                console.error("메시지 가져오기 오류:", error);
                alert("메시지를 가져오는 데 문제가 발생했습니다.");
            }
        };

        fetchMessages();
    }, [db]);

    const handleInputChange = (e) => {
        setInputMessage(e.target.value);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (inputMessage.trim()) {
            try {
                const currentDateTime = new Date();
                const formattedDateTime = new Intl.DateTimeFormat('ko-KR', {
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                }).format(currentDateTime);

                const newMessage = {
                    nickname: nickname,
                    text: inputMessage,
                    timestamp: formattedDateTime,
                    color: generateHexCode()
                };

                const docRef = doc(db, "chat", "messages");

                await updateDoc(docRef, {
                    messages: arrayUnion(newMessage)
                });

                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setMessages(docSnap.data().messages || []);
                }

                setInputMessage("");
            } catch (error) {
                console.error("Error sending message:", error);
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
                                        style={{ backgroundColor: message.color }}>
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
