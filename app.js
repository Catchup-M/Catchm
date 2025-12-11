// app.js

// Imports from globally available React (from index.html)
const { useState, useRef, useEffect } = React;

// Import sub-components (assuming they are in the same directory)
import { ChatHeader } from './header.js';
import { ChatMessageContent } from './chat.js';
// Note: MessageBubble is imported inside ChatMessageContent, 
// so we don't need it here unless we used it directly.

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
    // Ensure we scroll down after sending a message
    setTimeout(() => scrollToBottom(), 50);
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
  
  // Handlers for message swiping (kept here as they manipulate top-level state)
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

  // Effect to ensure scroll state updates on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Conversation List View 
        --- This section is restored to its full original JSX structure ---
      */}
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
        <div style={{
          padding: '12px 16px',
          background: '#fff',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            <svg 
              style={{ width: '28px', height: '28px', cursor: 'pointer', fill: '#666' }}
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24"
            >
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>

            <div style={{
              flex: 1,
              textAlign: 'center',
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#000',
              marginRight: '28px'
            }}>
              Messages
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#f0f0f0',
            borderRadius: '20px',
            padding: '8px 16px'
          }}>
            <svg 
              style={{ width: '20px', height: '20px', marginRight: '8px', fill: '#999' }}
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24"
            >
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search"
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '16px',
                color: '#999'
              }}
            />
          </div>
        </div>

        <div 
          onClick={openChat}
          onMouseDown={(e) => e.preventDefault()}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            borderBottom: '1px solid #f0f0f0',
            cursor: 'pointer',
            background: '#fff'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
        >
          <div 
            onMouseDown={(e) => e.preventDefault()}
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: '#FF8C42',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px',
              fontWeight: 'bold',
              color: '#fff',
              fontSize: '20px',
              flexShrink: 0
            }}
          >
            DS
          </div>

          <div 
            onMouseDown={(e) => e.preventDefault()}
            style={{ flex: 1, minWidth: 0 }}
          >
            <div 
              onMouseDown={(e) => e.preventDefault()}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: '4px'
              }}
            >
              <div style={{ fontSize: '17px', fontWeight: '600', color: '#000' }}>
                Daddy Steve
              </div>
              <div style={{ fontSize: '14px', color: '#999', flexShrink: 0, marginLeft: '8px' }}>
                Oct 27
              </div>
            </div>
            <div style={{ fontSize: '15px', color: '#999', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Daddy Steve joined Telegram
            </div>
          </div>
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
          // The component now handles its own scroll logic via useEffect
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
            style={{
              position: 'fixed',
              right: '16px',
              bottom: showEmojiPicker ? '375px' : '70px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#fff',
              border: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 11,
              transition: 'bottom 0.3s ease'
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L12 20M12 20L18 14M12 20L6 14" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
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
          <svg 
            onClick={handleAttachment}
            style={{ width: '25px', height: '29px', marginRight: '10px', marginBottom: '7px', flexShrink: 0, fill: '#666666', cursor: 'pointer' }}
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24"
            onMouseDown={(e) => e.preventDefault()}
          >
            <g>
              <path fill="#666666" fillRule="evenodd" d="M8 7.308c0-.558.186-1.434.659-2.14C9.1 4.504 9.779 4 10.88 4c1.134 0 1.88.499 2.373 1.155c.52.692.746 1.555.746 2.153v7.54a.8.8 0 0 1-.073.223c-.065.141-.166.3-.3.447c-.269.295-.61.482-1.002.482c-.436 0-.777-.18-1.02-.433c-.263-.274-.355-.574-.355-.72v-7.56a1 1 0 0 0-2 0v7.56c0 .75.358 1.527.912 2.105A3.38 3.38 0 0 0 12.625 18c1.085 0 1.93-.532 2.48-1.134c.517-.567.895-1.335.895-2.02V7.308c0-1.001-.35-2.292-1.146-3.354C14.029 2.856 12.716 2 10.88 2c-1.867 0-3.13.925-3.885 2.055A6.13 6.13 0 0 0 6 7.308v8.695C6 19.402 9.003 22 12.5 22c3.498 0 6.5-2.597 6.5-5.997V7a1 1 0 1 0-2 0v9.003C17 18.123 15.079 20 12.5 20C9.923 20 8 18.122 8 16.003z" clipRule="evenodd"/>
            </g>
          </svg>

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
            <svg 
              onClick={toggleEmojiPicker}
              style={{ width: '21px', height: '21px', flexShrink: 0, marginRight: '10px', cursor: 'pointer' }}
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 512 512"
            >
              <path fill="#666666" d="M464 256a208 208 0 1 0-416 0a208 208 0 1 0 416 0M0 256a256 256 0 1 1 512 0a256 256 0 1 1-512 0m177.3 63.4c15 15.6 41.1 32.6 78.7 32.6s63.7-17 78.7-32.6c9.2-9.6 24.4-9.9 33.9-.7s9.9 24.4.7 33.9c-22.1 23-60 47.4-113.3 47.4s-91.2-24.4-113.3-47.4c-9.2-9.6-8.9-24.8.7-33.9s24.8-8.9 33.9.7M144 208a32 32 0 1 1 64 0a32 32 0 1 1-64 0m192-32a32 32 0 1 1 0 64a32 32 0 1 1 0-64"/>
            </svg>

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
              style={{
                flex: 1,
                fontSize: '14px',
                lineHeight: '20px',
                outline: 'none',
                border: 'none',
                background: 'transparent',
                padding: 0,
                minHeight: '20px',
                maxHeight: '127px',
                overflowY: 'auto'
              }}
            />
          </div>

          <div style={{ width: '40px', flexShrink: 0, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
            {/* Microphone / Send Button */}
            {message.trim() === '' ? (
              <svg 
                onClick={handleMicrophone}
                style={{ width: '25px', height: '29px', marginBottom: '7px', fill: '#666666', cursor: 'pointer' }}
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 256 256"
                onMouseDown={(e) => e.preventDefault()}
              >
                <path fill="#666666" d="M128 176a48.05 48.05 0 0 0 48-48V64a48 48 0 0 0-96 0v64a48.05 48.05 0 0 0 48 48ZM96 64a32 32 0 0 1 64 0v64a32 32 0 0 1-64 0Zm40 143.6V232a8 8 0 0 1-16 0v-24.4A80.11 80.11 0 0 1 48 128a8 8 0 0 1 16 0a64 64 0 0 0 128 0a8 8 0 0 1 16 0a80.11 80.11 0 0 1-72 79.6Z"/>
              </svg>
            ) : (
              <button 
                onClick={sendMessage}
                onMouseDown={(e) => e.preventDefault()}
                style={{
                  padding: '6px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '3px'
                }}
              >
                <svg viewBox="0 -0.5 21 21" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.61258 9L0.05132 1.31623C-0.22718 0.48074 0.63218 -0.28074 1.42809 0.09626L20.4281 9.0963C21.1906 9.4575 21.1906 10.5425 20.4281 10.9037L1.42809 19.9037C0.63218 20.2807 -0.22718 19.5193 0.05132 18.6838L2.61258 11H8.9873C9.5396 11 9.9873 10.5523 9.9873 10C9.9873 9.4477 9.5396 9 8.9873 9H2.61258z" fill="#3b82f6" fillRule="evenodd" clipRule="evenodd" />
                </svg>
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

