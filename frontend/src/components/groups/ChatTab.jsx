"use client";
import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import api from '@/lib/axios';
import { Send, Paperclip, File } from 'lucide-react';

export default function ChatTab({ groupId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);
  const [file, setFile] = useState(null);
  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    // Fetch initial messages
    api.get(`/api/messages/${groupId}`).then(res => setMessages(res.data));

    // Socket setup
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSocket(newSocket);

    newSocket.emit('join_group', groupId);

    newSocket.on('receive_message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => newSocket.close();
  }, [groupId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() && !file) return;

    let fileUrl = '';
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await api.post('/api/messages/upload', formData);
        fileUrl = res.data.fileUrl;
      } catch (err) {
        console.error('Upload failed', err);
      }
    }

    const msgData = {
      group: groupId,
      sender: user.id,
      content: input,
      fileUrl
    };

    socket.emit('send_message', msgData);
    setInput('');
    setFile(null);
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
        {messages.map((msg, i) => {
           const isMe = msg.sender?._id === user.id;
           return (
             <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[70%] rounded-2xl px-5 py-3 ${isMe ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white border border-gray-100 shadow-sm rounded-bl-sm text-gray-800'}`}>
                 {!isMe && <div className="text-xs font-semibold text-blue-600 mb-1">{msg.sender?.name}</div>}
                 {msg.content && <p className="text-sm">{msg.content}</p>}
                 {msg.fileUrl && (
                   <a href={`http://localhost:5000${msg.fileUrl}`} target="_blank" rel="noreferrer" className={`mt-2 flex items-center p-2 rounded-lg text-sm ${isMe ? 'bg-blue-700 text-blue-100 hover:text-white' : 'bg-gray-50 text-blue-600 hover:underline'}`}>
                     <File className="w-4 h-4 mr-2" /> Attachment
                   </a>
                 )}
               </div>
             </div>
           );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        {file && (
          <div className="mb-2 text-sm text-gray-500 flex items-center">
            <Paperclip className="w-4 h-4 mr-1" /> {file.name}
            <button onClick={() => setFile(null)} className="ml-2 text-red-500 hover:text-red-700">Clear</button>
          </div>
        )}
        <form onSubmit={handleSend} className="flex space-x-2">
          <label className="p-3 text-gray-400 hover:text-blue-600 cursor-pointer transition-colors bg-gray-50 rounded-xl hover:bg-blue-50">
            <Paperclip className="w-5 h-5" />
            <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
          </label>
          <input 
            type="text" 
            placeholder="Type your message..." 
            className="flex-1 bg-gray-50 text-gray-800 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 border-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-colors shadow-sm">
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
