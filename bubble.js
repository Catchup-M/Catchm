// bubble.js

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

  // Common styles for reply preview
  const replyPreviewStyle = {
    borderLeft: '3px solid ' + (msg.sent ? '#128C7E' : '#06cf9c'),
    paddingLeft: '8px',
    marginBottom: '6px',
    background: 'rgba(0,0,0,0.05)',
    borderRadius: '4px',
    padding: '6px 8px'
  };
  
  const replySenderStyle = { 
    fontSize: '12px', 
    fontWeight: '600', 
    color: msg.sent ? '#128C7E' : '#06cf9c', 
    marginBottom: '2px' 
  };
  
  const replyTextStyle = { 
    fontSize: '13px', 
    color: '#666', 
    overflow: 'hidden', 
    textOverflow: 'ellipsis', 
    whiteSpace: 'nowrap' 
  };

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
          {/* Image and Time/Checkmark logic */}
          {/* ... (SVG for checkmark needs to be defined if not using a separate function) */}
        </div>
      )}

      {/* Text Message */}
      {!msg.type && (
        <div style={{...bubbleStyle, maxWidth: isLongMessage ? '290px' : '85%'}}>
          {/* Reply Preview */}
          {msg.replyTo && (
            <div style={replyPreviewStyle}>
              <div style={replySenderStyle}>
                {msg.replyTo.sender}
              </div>
              <div style={replyTextStyle}>
                {msg.replyTo.text}
              </div>
            </div>
          )}

          {/* Long Message Layout */}
          {isLongMessage && (
            <div style={{ fontSize: '14px', lineHeight: '1.3' }}>
              {msg.text}
              <span style={{
                float: 'right',
                marginLeft: '6px',
                fontSize: '11px',
                color: '#6b7280',
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                position: 'relative',
                bottom: '-3px'
              }}>
                {msg.time}
                {msg.sent && checkmarkSVG}
              </span>
            </div>
          )}

          {/* Medium/Short Message Layout (Single line, more compact) */}
          {(!isLongMessage) && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '8px'
            }}>
              <span style={{ color: '#111', fontSize: '14px', whiteSpace: isShortMessage && !msg.replyTo ? 'nowrap' : 'normal' }}>
                {msg.text}
              </span>
              <span style={{
                fontSize: '11px',
                color: '#6b7280',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                flexShrink: 0,
                whiteSpace: 'nowrap'
              }}>
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

