import React, { useEffect, useState } from 'react';
import './Mail.css';

const Mail = ({ isOpen, onClose, toEmails, OnSend }) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false); 

  useEffect(() => {
    if (isOpen) {
      setSubject('');
      setBody('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!subject || !body) {
      OnSend({ type: 'error', message: 'Please fill all the fields' });
      return;
    }

    setIsSending(true);

    try {
      const res = await fetch("http://localhost:5000/api/mail/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toEmails,   // ✅ match backend
          subject,
          body,       // ✅ match backend
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to send email");

      OnSend({
        type: 'success',
        message: `Mail sent to: ${toEmails.join(', ')}`,
        toEmails,
        subject,
        body,
      });

      setIsSending(false);
      onClose();
    } catch (error) {
      console.error(error);
      OnSend({
        type: 'error',
        message: 'Failed to send email. Please try again',
      });
      setIsSending(false);
    }
  };

  return (
    <div className="mail-overlay">
      <div className="mail-box">
        <h2>Send Mail</h2>

        <label>To:</label>
        <input
          type="text"
          className="input-small"
          value={toEmails.join(', ')}
          readOnly
        />

        <label>Subject:</label>
        <input
          type="text"
          className="input-small"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <label>Body:</label>
        <textarea
          className="input-large"
          rows="5"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        ></textarea>

        <div className="mail-buttons">
          <button
            onClick={handleSend}
            className={isSending ? 'sending' : ''}
            disabled={isSending}
          >
            {isSending ? <>Sending... ⏳</> : 'Send'}
          </button>
          <button
            onClick={onClose}
            className={isSending ? 'cancel-sending' : ''}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Mail;
