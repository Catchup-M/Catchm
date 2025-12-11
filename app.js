// app.js

// Imports from globally available React (from index.html)
const { useState, useRef, useEffect } = React;

// Import sub-components (assuming they are in the same directory)
import { ChatHeader } from './header.js';
import { ChatMessageContent } from './chat.js';
import { MessageBubble } from './bubble.js'; 

// Initial dummy data for messages
const initialMessages = [
  { text: "Hey!", time: "10:30", sent: true, date: "June 6" },
  { text: "How are you doing today?", time: "10:31", sent: false, date: "June 6" },
  { 
    text: "I'm doing great, thanks for asking!", 
    time: "10:32", 
    sent: true, 
    date: "June 6",
    replyTo: { text: "How are you doing today?", sender: "Daddy Steve" }
  },
  { type: "image", imageUrl: "https://i.ibb.co/C5b875C6/Screenshot-20250904-050841.jpg", time: "10:33", sent: false, date: "June 6" },
  { 
    text: "That's great to hear!", 
    time: "14:24", 
    sent: false, 
    date: "June 6",
    replyTo: { text: "I'm doing great, thanks for asking!", sender: "You" }
  },
  { text: "Hey bro how are you doing my dear hope everything is going well and you're having a great day", time: "10:33", sent: false, date: "June 6" },
  { 
    text: "Hey", 
    time: "08:22", 
    sent: true, 
    date: "Tuesday",
    replyTo: { text: "Hey bro how are you doing my dear hope everything is going well and you're having a great day", sender: "Mykeespage" }
  },
  { type: "image", imageUrl: "https://i.ibb.co/C5b875C6/Screenshot-20250904-050841.jpg", time: "17:06", sent: true, date: "Tuesday" },
  { text: "Yes everything is fine", time: "10:34", sent: true, date: "Tuesday" },
];

function FooterChatBar() {
  const [message, setMessage] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [headerDate, setHeaderDate] = useState('');
  const [swipedMessage, setSwipedMessage] = useState(null);
  const [messages, setMessages] = useState(initialMessages);
  
  const inputRef = useRef(null);
  const contentRef = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const touchMoveRef = useRef({ x: 0, y: 0 });

  const scrollToBottom = () => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  };

  const handleInput = (e) => {
    const text = e.currentTarget.textContent;
    setMessage(text);
  };

  const sendMessage = () => {
    const textToSend = inputRef.current?.textContent?.trim() || '';
    
    if (!textToSend) {
      return;
    }
    
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeString = hours + ':' + (minutes < 10 ? '0' + minutes : minutes);
    
    const newMessage = {
      text: textToSend,
      time: timeString,
      sent: true,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    
    if (inputRef.current) {
      inputRef.current.textContent = '';
    }
    setMessage('');
  };

  const openChat = () => {
    setShowChat(true);
    // Smooth scroll to bottom after transition
    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.scrollTo({
          top: contentRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 350);
  };

  const closeChat = () => {
    setShowChat(false);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
    if (!showEmojiPicker) {
      // Scroll to bottom when opening the keyboard (closing the picker)
      setTimeout(() => scrollToBottom(), 500);
    }
  };

  const handleAttachment = () => console.log('Attachment clicked');
  const handleMicrophone = () => console.log('Microphone clicked');
  
  // Handlers for message swiping (move to chat.js if needed, but keeping here for state access)
  const handleTouchStart = (e, index) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now()
    };
  };

  const handleTouchMove = (e, index, sent) => {
    const deltaX = e.touches[0].clientX - touchStartRef.current.x;
    const deltaY = e.touches[0].clientY - touchStartRef.current.y;
    
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      e.preventDefault();
      const validSwipe = (sent && deltaX < 0) || (!sent && deltaX > 0);
      
      if (validSwipe && Math.abs(deltaX) < 80) {
        touchMoveRef.current = { x: deltaX, y: deltaY };
        setSwipedMessage({ index, offset: deltaX });
      }
    }
  };

  const handleTouchEnd = (e, index) => {
    const deltaX = touchMoveRef.current.x;
    const deltaTime = Date.now() - touchStartRef.current.time;
    
    if (Math.abs(deltaX) < 40 || deltaTime > 300) {
      setSwipedMessage(null);
    } else {
      console.log('Reply to message:', index);
      // Logic for reply action goes here
      setTimeout(() => setSwipedMessage(null), 200);
    }
    
    touchMoveRef.current = { x: 0, y: 0 };
  };

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Conversation List View */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          background: '#fff',
          transform: showChat ? 'translateX(-100%)' : 'translateX(0)',
          transition: 'transform 0.3s'
        }}
      >
        {/* Placeholder for Conversation List Header/Search */}
        <div style={{
          padding: '12px 16px',
          background: '#fff',
          borderBottom: '1px solid #e0e0e0'
        }}>
          {/* Header */}
          <div style={{...}}>...</div>
          {/* Search Bar */}
          <div style={{...}}>...</div>
        </div>

        {/* Conversation Item (Clickable) */}
        <div 
          onClick={openChat}
          onMouseDown={(e) => e.preventDefault()}
          style={{...}}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
        >
          {/* Avatar/Content */}
          <div style={{...}}>DS</div>
          <div style={{...}}>...</div>
        </div>
      </div>

      {/* Chat View */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 2,
          background: '#f5f5f5',
          backgroundImage: 'url(https://i.ibb.co/tMcNm2rY/Screenshot-20251206-103640.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: showChat ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Chat Header Component */}
        <ChatHeader 
          closeChat={closeChat} 
          headerDate={headerDate} 
          showChat={showChat}
        />

        {/* Chat Messages Content Component */}
        <ChatMessageContent
          contentRef={contentRef}
          messages={messages}
          showEmojiPicker={showEmojiPicker}
          setShowScrollButton={setShowScrollButton}
          setHeaderDate={setHeaderDate}
          scrollToBottom={scrollToBottom}
          swipedMessage={swipedMessage}
          handleTouchStart={handleTouchStart}
          handleTouchMove={handleTouchMove}
          handleTouchEnd={handleTouchEnd}
        />

        {/* Scroll to Bottom Button */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            onMouseDown={(e) => e.preventDefault()}
            style={{...}}
          >
            {/* SVG */}
          </button>
        )}

        {/* Input Bar */}
        <div style={{
          position: 'fixed',
          bottom: showEmojiPicker ? '300px' : 0,
          left: 0,
          right: 0,
          zIndex: 10,
          background: '#fff',
          padding: '6px 10px',
          display: 'flex',
          alignItems: 'flex-end',
          border: 'none',
          transition: 'bottom 0.3s ease'
        }}>
          {/* Attachment Icon */}
          <svg onClick={handleAttachment} style={{...}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">...</svg>

          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'flex-end',
            background: '#f1f1f1',
            borderRadius: '20px',
            padding: '11.5px 10px',
            minHeight: '43px',
            maxHeight: '150px',
            boxSizing: 'border-box',
            overflowY: 'auto'
          }}>
            {/* Emoji Icon */}
            <svg onClick={toggleEmojiPicker} style={{...}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">...</svg>

            {/* Content Editable Input */}
            <div
              ref={inputRef}
              contentEditable
              role="textbox"
              aria-label="Message input"
              onInput={handleInput}
              onFocus={() => {
                setShowEmojiPicker(false);
                setTimeout(() => scrollToBottom(), 500);
              }}
              style={{...}}
            />
          </div>

          <div style={{ width: '40px', flexShrink: 0, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
            {/* Microphone / Send Button */}
            {message.trim() === '' ? (
              <svg onClick={handleMicrophone} style={{...}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">...</svg>
            ) : (
              <button onClick={sendMessage} onMouseDown={(e) => e.preventDefault()} style={{...}}>
                <svg viewBox="0 -0.5 21 21" xmlns="http://www.w3.org/2000/svg">...</svg>
              </button>
            )}
          </div>
        </div>

        {/* Emoji Picker Placeholder */}
        <div style={{
          position: 'fixed',
          bottom: showEmojiPicker ? 0 : '-300px',
          left: 0,
          right: 0,
          height: '300px',
          background: '#fff',
          zIndex: 9,
          transition: 'bottom 0.3s ease',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
        }}>
          {/* Emoji Picker Content here */}
        </div>
      </div>
    </div>
  );
}

// Render the main component
ReactDOM.render(<FooterChatBar />, document.getElementById('root'));

