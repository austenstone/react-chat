import './Chat.css';
import 'animate.css/animate.min.css'

import React, { useState, useEffect, useRef } from "react";

import firebase from 'firebase/compat/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { auth, firestore } from './Firebase';
import { format } from 'timeago.js';

export function Chat() {
    const bottomMessageRef = useRef(null);
    const inputMessageRef = useRef(null);
    const messagesCollection = firestore.collection('messages');
    const query = messagesCollection.orderBy('createdAt').limitToLast(50);
    const [messages] = useCollectionData(query, { idField: 'id', snapshotListenOptions: {} });
    const [message, setMessage] = useState('');

    let lastSize = 0;
    query.onSnapshot({
        next: (e) => {
            if (e.size !== lastSize) bottomMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    })

    useEffect(() => {
        inputMessageRef.current?.focus();
    }, []);

    const onSubmit = async (e) => {
        inputMessageRef.current?.focus();
        e.preventDefault();
        if (!message) return;
        await messagesCollection.add({
            text: message,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid: auth.currentUser.uid,
            photoURL: auth.currentUser.photoURL,
            displayName: auth.currentUser.displayName
        })
        setMessage('');
    }

    return (
        <div id="chat">
            <div id="messages">
                {messages?.map((msg, i) => {
                    let timeAgoInfo, nameInfo;
                    const lastMessage = messages[i - 1];
                    const timeDiff = msg?.createdAt?.seconds - lastMessage?.createdAt?.seconds;
                    if (i === 0 || timeDiff > 60) {
                        timeAgoInfo = <p className="message-info message-date">{format(msg?.createdAt?.seconds * 1000)}</p>;
                    }
                    const differentName = msg?.displayName !== lastMessage?.displayName;
                    if (differentName) {
                        nameInfo = <p className="message-info">{msg?.displayName}</p>;
                    }
                    return (
                        <React.Fragment key={msg.id}>
                            {timeAgoInfo}
                            {nameInfo}
                            <ChatMessage key={msg.id} message={msg}></ChatMessage>
                        </React.Fragment>
                    )
                })}
                <div ref={bottomMessageRef}></div>
            </div>
            <form onSubmit={onSubmit}>
                <input ref={inputMessageRef} name="message" placeholder="Aa" autoComplete="off" value={message} onChange={(e) => setMessage(e.target.value)}></input>
                <button type="submit">Send</button>
            </form>
        </div>
    )
}

function ChatMessage(props) {
    const unknownPhotoURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXg4OC9vb3f39/Kysrc3Ny+vr7Q0NDHx8fNzc3ExMTU1NTV1dXY2NjBwcG6urrLy8vXjdnDAAAEKElEQVR4nO3d63KrIBQF4IAIBgXf/22P5GpbEwGVzfasb6bTv6zhoiCQywUAAAAAAAAAAAAAAAAAAAAAAABgiVTW6k5bqyR1UQ6gbOP8RAgR/rnGKuoi7ao3bcg251vTUxdrN/31d7xHyOs5Miq3nO+W0Z2grXaf890ydtQF3Eh+aKDzpsp6YFXtSr6gZdxSh4h8wUBd0FwqMqAQTGtRxjTRR0Pl2Rev0QGFuFIXNsfKY+Injg+N2FHmid9ok9JGA3bt1Ka00cBb6iIncokBhXDURU7Tp1bhVIm8JhqpvTBg1RPj32bmOL3Z6PRGymysMVl1aKiLHU+mj6SB4/N2qnIa6dRM+XTEITMhnze3rIFmSqipCx6tywooBJ8JxvkTNpkJG+qCRzt/HZ4/oc5MyGcszZg7BYzmT+d/p0lYKZ3jtGqaMwHmNQXOmx/yGWj+hzn++ddp0pdLmS1iTDLqkLrIiZLHGlbjTJC8VMNokeYhsScyemN7SVtRZLSS+JLUTvm10SDlsc/qYf8WPYni2AnvbGRCZs/6uT4qINsaDIb1mWLLZ6V7kTQrexMNy1H0B/tne/AsX8u4C77J7kNG33b8K/BO6oV9wt7ps+S7Ud30ivOMOf13HdOH/DdqsF1jjGk6O5wwHgAAAAAAAMBFymn2a3U3Nk1jpr8xXDswKHmGVYwwrzeu9Y/LBmarNEHrDOf5vhy0ccKvnnT2whk9sKvOYUz+BjzyWftW+iqydgyJq2bQYnPjcQlpt8R7hax2pV91m+M9Q1a5XDysfGRKDGlqG3f2zVdfRpW3n3TNtZa2Kse96+/Jj1W8CHz7Aro5YgVfUNe+Ym/OSP0VPGInwla0OxmS7r7IRXlnxsEt9BWRalufPOYZsYTmLqnMYyN5WoqA5WowINieWTYgwVmFpswg8+YLHzDNOE+xOWLR1xtZPF9QsivmHmXepmA7zTu4tV252RRNFRasxKLP+rlih0wzDzJvV2xPf+5x++1KzTLybhDaQ6lJRt4NQnsodafb+evw/GNp5FGY/RU8XFN8ZhGUnV1QDDZlr46keDMtvMZfvisWP+GWeWNZLorD7Id9j1kMOJYPWGw9+BaQaE244IowTcByEQlvPSkTkfRal9Wfr9jOE99bc/hwQ/bh6eXgT4g1XLife8FenCpurTnwS3ctZ/XVQeONr2ZDzVGrbxV0wbdh/wmjq6SFPsmdp/2+qWI71A/Dl18fS85XWwU+6L0G1baKZ8QStc9HqaaeIfQvtbk7+qrzBRvrsfp8gfp0W8tq9fG5DkRak7yp3Qtj63tAfKG0Wz0QNIvnXeXnLBYpa+IeH63h+8Oyt9NdX+pyqjuOp7p+kaq/H2Lzs98D9vcja/2pfvtYDb21WndaW9vzPXQIAAAAAAAAAAAAAAAAAAAAAAAAh/oHOVI0YSQb7ewAAAAASUVORK5CYII=';
    const messageWasSent = auth.currentUser.uid === props.message.uid;
    const messageClasses = `message ${messageWasSent ? 'sent' : 'received'} animate__animated animate__fadeIn`
    return (
        <div className={messageClasses}>
            <img className="avatar" alt="avatar" src={messageWasSent ? auth.currentUser.photoURL : props.message.photoURL ? props.message.photoURL : unknownPhotoURL} />
            <div className="content">{props.message.text}</div>
        </div>
    )
}