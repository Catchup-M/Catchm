// chat.js
const { useEffect } = React;

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

  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
      
      // Check which date is currently visible at the top
      const dateBadges = document.querySelectorAll('.date-badge');
      let currentDate = '';
      
      dateBadges.forEach((badge) => {
        const rect = badge.getBoundingClientRect();
        const headerBottom = 58; // Header height
        // Check if the badge is visible near the header
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
      // Clean up the event listener
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
            <React.Fragment key={index}>
              {/* Date Badge */}
              {showDateBadge && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '12px',
                  marginTop: index === 0 ? '0' : '12px'
                }}>
                  <div 
                    className="date-badge" // Class for scroll handler to find
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
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

