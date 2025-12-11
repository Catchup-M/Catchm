// header.js
const { useEffect } = React;

export function ChatHeader({ closeChat, headerDate, showChat }) {
  // Logic to prevent scroll jump on initial load/switch
  useEffect(() => {
    // Re-check for header date logic can be added here if needed
  }, [showChat]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      background: '#fff',
      padding: '8px 12px',
      display: 'flex',
      alignItems: 'center',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      {/* Back button */}
      <svg 
        onClick={closeChat}
        style={{ width: '24px', height: '24px', marginRight: '12px', cursor: 'pointer', fill: '#666' }}
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24"
      >
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
      </svg>

      {/* Avatar */}
      <div style={{
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        background: '#FF8C42',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '10px',
        fontWeight: 'bold',
        color: '#fff',
        fontSize: '16px'
      }}>
        DS
      </div>

      {/* Contact Info */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#000', lineHeight: '1.2' }}>
          Daddy Steve
        </div>
        <div style={{ fontSize: '14px', color: '#999', lineHeight: '1.2' }}>
          last seen 11/3/2025
        </div>
      </div>

      {/* Menu button */}
      <svg 
        onMouseDown={(e) => e.preventDefault()}
        style={{ width: '20px', height: '20px', cursor: 'pointer', fill: '#666' }}
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24"
      >
        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
      </svg>
      
      {/* Fixed Header Date Badge */}
      {headerDate && (
        <div style={{
          position: 'fixed',
          top: '58px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          background: 'rgba(0, 0, 0, 0.5)',
          color: '#fff',
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '13px',
          fontWeight: '500'
        }}>
          {headerDate}
        </div>
      )}
    </div>
  );
}

