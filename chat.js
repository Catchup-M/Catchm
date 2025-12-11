// chat.js
const { useEffect } = window.React; // Get hook from global React

import { MessageBubble } from './bubble.js';

export function ChatMessageContent({ 
  contentRef, 
  messages, 
  showEmojiPicker, 
  setShowScrollButton, 
  setHeaderDate, 
  swipedMessage,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd
}) {
  // ... (handleScroll function remains the same) ...
  const handleScroll = () => {
    // ... (logic remains the same) ...
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
      
      const dateBadges = document.querySelectorAll('.date-badge');
      let currentDate = '';
      
      dateBadges.forEach((badge) => {
        const rect = badge.getBoundingClientRect();
        const headerBottom = 58;
        if (rect.top <= headerBottom + 10 && rect.bottom >= headerBottom) {
          currentDate = badge.textContent;
        }
      });
      
      setHeaderDate(currentDate);
    }
  };


  useEffect(() => {
    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      return () => contentElement.removeEventListener('scroll', handleScroll);
    }
  }, [contentRef.current]);

  return (
    <div 
      ref={contentRef}
      style={{ 
        padding: '70px 18px',
        paddingBottom: showEmojiPicker ? '370px' : '70px',
        flex: 1,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        transition: 'padding-bottom 0.3s ease',
        position: 'relative',
        zIndex: 1
      }}
    >
      <div style={{ 
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end'
      }}>
        {messages.map((msg, index) => {
          const showDateBadge = index === 0 || messages[index - 1].date !== msg.date;

          return (
            // Use window.React.Fragment since it's defined globally
            <window.React.Fragment key={index}> 
              {/* Date Badge (JSX remains the same) */}
              {showDateBadge && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '12px',
                  marginTop: index === 0 ? '0' : '12px'
                }}>
                  <div 
                    className="date-badge"
                    style={{
                      background: 'rgba(0, 0, 0, 0.5)',
                      color: '#fff',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: '500'
                    }}
                  >
                    {msg.date}
                  </div>
                </div>
              )}
              
              {/* Message Bubble Component */}
              <MessageBubble 
                msg={msg} 
                index={index}
                swipedMessage={swipedMessage}
                handleTouchStart={handleTouchStart}
                handleTouchMove={handleTouchMove}
                handleTouchEnd={handleTouchEnd}
              />
            </window.React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

