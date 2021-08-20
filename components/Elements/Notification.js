import React, { useRef } from 'react';
// react plugin for creating notifications over the dashboard
import NotificationAlert from 'react-notification-alert';
// reactstrap components
import { Button } from 'reactstrap';

const Notifications = () => {
  const notificationAlertRef = useRef();
  const notify = (type, title, content) => {
    let options = {
      place: 'bc',
      message: (
        <div className="alert-text">
          <span className="alert-title" data-notify="title">
            {`${title} `}
          </span>
          <span data-notify="message">{content}</span>
        </div>
      ),
      type: type,
      icon: 'ni ni-bell-55',
      autoDismiss: 7
    };
    notificationAlertRef.current.notificationAlert(options);
  };

  return (
    <>
      <div className="rna-wrapper">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <Button
        color="danger"
        onClick={() =>
          notify(
            'danger',
            'Bootstrap Notify',
            'Turning standard Bootstrap alerts into awesome notifications'
          )
        }
      >
        Danger
      </Button>
    </>
  );
};

export default Notifications;
