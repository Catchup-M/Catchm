// bubble.js
const React = window.React; // Get React from global scope

export function MessageBubble({ 
  msg, 
  index, 
  swipedMessage, 
  handleTouchStart, 
  handleTouchMove, 
  handleTouchEnd 
}) {
  
  const isLongMessage = msg.text && msg.text.length > 50;
  const isMediumMessage = msg.text && msg.text.length > 30 && msg.text.length <= 50;
  const isShortMessage = msg.text && msg.text.length <= 30;

  // Common styles for reply preview (styles omitted for brevity)
  // ...

  const checkmarkSVG = (
    <svg width="12" height="12" viewBox="0 0 48 48">
      <path fill="#43A047" d="M40.6 12.1L17 35.7l-9.6-9.6L4.6 29L17 41.3l26.4-26.4z"/>
    </svg>
  );

  const bubbleStyle = {
    background: msg.sent ? '#dcf8c6' : '#fff',
    borderRadius: '12px',
    padding: '8px 10px',
    maxWidth: '85%',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
  };

  return (
    <div 
      onTouchStart={(e) => handleTouchStart(e, index)}
      onTouchMove={(e) => handleTouchMove(e, index, msg.sent)}
      onTouchEnd={(e) => handleTouchEnd(e, index)}
      style={{
        display: 'flex',
        justifyContent: msg.sent ? 'flex-end' : 'flex-start',
        marginBottom: '8px',
        transform: swipedMessage?.index === index ? `translateX(${swipedMessage.offset}px)` : 'translateX(0)',
        transition: swipedMessage?.index === index ? 'none' : 'transform 0.2s ease'
      }}
    >
      {/* Image Message */}
      {msg.type === 'image' && (
        <div style={{
          background: msg.sent ? '#dcf8c6' : '#fff',
          borderRadius: '12px',
          padding: '4px',
          maxWidth: '290px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }}>
          {/* ... image content ... */}
        </div>
      )}

      {/* Text Message */}
      {!msg.type && (
        <div style={{...bubbleStyle, maxWidth: isLongMessage ? '290px' : '85%'}}>
          {/* Reply Preview */}
          {msg.replyTo && (
            <div style={{ /* ... styles ... */ }}>
              <div style={{ /* ... styles ... */ }}>
                {msg.replyTo.sender}
              </div>
              <div style={{ /* ... styles ... */ }}>
                {msg.replyTo.text}
              </div>
            </div>
          )}

          {/* Message Layouts (Long, Medium/Short) */}
          {/* ... JSX for different message lengths remains the same ... */}
          
          {isLongMessage && (
            <div style={{ fontSize: '14px', lineHeight: '1.3' }}>
              {msg.text}
              <span style={{ /* ... styles ... */ }}>
                {msg.time}
                {msg.sent && checkmarkSVG}
              </span>
            </div>
          )}

          {(!isLongMessage) && (
            <div style={{ /* ... styles ... */ }}>
              <span style={{ color: '#111', fontSize: '14px', whiteSpace: isShortMessage && !msg.replyTo ? 'nowrap' : 'normal' }}>
                {msg.text}
              </span>
              <span style={{ /* ... styles ... */ }}>
                {msg.time}
                {msg.sent && checkmarkSVG}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

