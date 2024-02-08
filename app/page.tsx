'use client';

import SockJS from "sockjs-client"
import {useCallback, useEffect, useRef, useState} from "react";
import {Client} from "@stomp/stompjs";

export default function Home() {
  const client = useRef<Client>();

  const [text, setText] = useState<string>('')
  const [messages, setMessages] = useState<string[]>([])

  const connect = useCallback(() => {
    client.current = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      connectHeaders: {
        Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJtZW1iZXJJZCI6MiwidHlwZSI6Ik1FTUJFUiIsInN1YiI6IjIiLCJleHAiOjE3MDY4NTg2MjF9.vUEmv7bXcKmByR6-6kdv9PDl9ta9ckEFUJVA-bkLsCdB1MELe1-CZPp7x8GOQPWdTs9uuZerBjg9Hcla8--Hvw',
      },
      onConnect: () => {
        console.info("connected!")
        client.current?.subscribe(`/sub/chat/room/1`, (res) => {
          setMessages((prev) => [...prev, JSON.parse(res.body).message])
        }, {
          Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJtZW1iZXJJZCI6MiwidHlwZSI6Ik1FTUJFUiIsInN1YiI6IjIiLCJleHAiOjE3MDY4NTg2MjF9.vUEmv7bXcKmByR6-6kdv9PDl9ta9ckEFUJVA-bkLsCdB1MELe1-CZPp7x8GOQPWdTs9uuZerBjg9Hcla8--Hvw',
        });
      },
      onWebSocketError: (e) => {
        console.error(e)
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });


    client.current.activate();
  }, []);

  useEffect(() => {
    connect();

    return () => {
      client.current?.deactivate();
    };
  }, [connect]);

  return (
    <div className="flex flex-col h-screen bg-white">
      <ul className="flex flex-col h-full p-4 bg-sky-200">
        {messages.map((it, index) => <li key={index}>{it}</li>)}
      </ul>

     <div className="flex flex-row">
       <input className="flex-1 px-4 py-2" type="text" placeholder="내용을 입력하세요." value={text} onChange={(e) => {setText(e.target.value)}} />
       <button className="p-4 bg-orange-400" onClick={() => {
         client.current?.publish({
           destination: "/pub/chat/room/1",
           body: JSON.stringify({
             message: text
           }),
           headers: {
             Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJtZW1iZXJJZCI6MiwidHlwZSI6Ik1FTUJFUiIsInN1YiI6IjIiLCJleHAiOjE3MDY4NTg2MjF9.vUEmv7bXcKmByR6-6kdv9PDl9ta9ckEFUJVA-bkLsCdB1MELe1-CZPp7x8GOQPWdTs9uuZerBjg9Hcla8--Hvw',
           }
         });

         setText("");
       }}>
         보내기
       </button>
     </div>
    </div>
  );
}
