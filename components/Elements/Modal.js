import React, { useState } from 'react';
// reactstrap components
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';

const ModalComponent = ({
  show = false,
  title = 'Action Required!',
  content = 'Are you sure?',
  action,
  actionText = 'Confirm',
  toggle,
  loading = false,
  loaderComponent = null
}) => {
  const Loader = loaderComponent;
  return (
    <>
      <Modal toggle={toggle} isOpen={show}>
        {loading && !!loaderComponent ? (
          loaderComponent
        ) : (
          <>
            <div className="modal-header">
              <h3 className="modal-title" id="modal-component">
                {title}
              </h3>
              <button
                aria-label="Close"
                className=" close"
                type="button"
                onClick={toggle}
              >
                <span aria-hidden={true}>×</span>
              </button>
            </div>
            <ModalBody>{content}</ModalBody>
            <ModalFooter>
              <Button color="danger" type="button" onClick={toggle}>
                Cancel
              </Button>
              <Button color="info" type="button" onClick={() => action()}>
                {actionText}
              </Button>
            </ModalFooter>
          </>
        )}
      </Modal>
    </>
  );
};

export default ModalComponent;
