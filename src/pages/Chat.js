import React, { useEffect, useState, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, doc, addDoc, Timestamp, updateDoc } from 'firebase/firestore';
import Cookies from 'js-cookie';
import { db } from '../firebase-config';
import { BiTimeFive } from 'react-icons/bi';
import { GoChevronUp, GoPaperAirplane } from 'react-icons/go';
import { useStateContext } from '../Context/ContextProvider';

const Chat = () => {
  const { setNotification, messages, setMessages } = useStateContext();
  const [myMsg, setMyMsg] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle scroll visibility for "scroll to top" button
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update read status for unread messages
  useEffect(() => {
    const updateRead = async () => {
      const unReadMsg = messages.filter(
        (data) => data.status === 'unread' && data.sender !== Cookies.get('name')
      );
      for (const data of unReadMsg) {
        await updateDoc(
          doc(db, 'room', sessionStorage.getItem('roomCode'), 'messages', data.id),
          { status: 'read' }
        );
      }
    };
    updateRead();
  }, [messages]);

  // Subscribe to messages in real time
  useEffect(() => {
    const roomCode = sessionStorage.getItem('roomCode');
    if (roomCode) {
      const messagesQuery = query(
        collection(db, 'room', roomCode, 'messages'),
        orderBy('timestamp', 'asc')
      );
      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const messageData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setMessages(messageData);
        const unReadMsg = messageData.filter(
          (doc) => doc.status === 'unread' && doc.sender !== Cookies.get('name')
        );
        setNotification(unReadMsg.length);
      });
      return () => unsubscribe();
    }
  }, [setMessages, setNotification]);

  const scrollToTop = () => {
    document.getElementById('chat-container')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sendMsg = async () => {
    if (!myMsg.trim()) return;
    const roomCode = sessionStorage.getItem('roomCode');
    if (!roomCode) return;
    try {
      await addDoc(collection(db, 'room', roomCode, 'messages'), {
        data: myMsg,
        sender: Cookies.get('name') || 'Guest',
        timestamp: Timestamp.now(),
        status: 'unread',
      });
      setMyMsg('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <div className="text-white ml-5 text-xl flex items-end">
        <b>Chat</b>
      </div>
      {sessionStorage.getItem('roomCode') ? (
        <div className="flex flex-col flex-1 m-3 bg-zinc-900 rounded-lg overflow-hidden">
          <div
            id="chat-container"
            className="flex-1 overflow-y-auto p-3"
            style={{ maxHeight: 'calc(100vh - 200px)' }}
          >
            {messages.length === 0 ? (
              <p className="text-white text-center">No messages yet.</p>
            ) : (
              messages.map((data, index) => (
                <div
                  key={index}
                  className={`chat ${
                    data.sender === Cookies.get('name') ? 'chat-end' : 'chat-start'
                  } text-white p-2`}
                >
                  <div className="bg-black chat-bubble">
                    <b>{data.sender === Cookies.get('name') ? 'You' : data.sender}</b>
                    <p>{data.data}</p>
                    <div className="flex flex-row items-center text-xs">
                      <BiTimeFive />
                      {data.timestamp.toDate().toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex flex-row p-3 gap-2 bg-zinc-900">
            <input
              type="text"
              className="flex-1 bg-slate-50 h-10 rounded-full pl-5 outline-none text-black"
              value={myMsg}
              onChange={(e) => setMyMsg(e.target.value)}
              placeholder="Type here..."
              onKeyPress={(e) => e.key === 'Enter' && sendMsg()}
            />
            <button
              className="bg-slate-50 rounded-full p-2 w-10 flex items-center justify-center"
              onClick={sendMsg}
            >
              <GoPaperAirplane className="mx-auto" color="black" size={18} />
            </button>
          </div>
          {isVisible && (
            <button
              className="bg-white bg-opacity-10 w-8 p-2 rounded-full fixed right-7 bottom-20 transition-opacity"
              onClick={scrollToTop}
            >
              <GoChevronUp className="mx-auto" color="white" size={15} />
            </button>
          )}
        </div>
      ) : (
        <div className="mt-14 mx-auto text-white">
          <p>
            <b>Please join a room to chat</b>
          </p>
        </div>
      )}
    </div>
  );
};

export default Chat;

