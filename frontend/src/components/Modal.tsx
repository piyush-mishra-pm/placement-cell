import React from 'react';
import ReactDOM from 'react-dom';

export interface ModalProps {
  header: JSX.Element;
  onCloseModal: () => void;
  content: JSX.Element;
  modalActions: JSX.Element;
}

const Modal = (props: ModalProps) => {
  return ReactDOM.createPortal(
    <div onClick={props.onCloseModal} className="ui dimmer modals visible active">
      {/* Prevent event bubbling to outside modal container, else outer part will close modal. */}
      <div onClick={(e) => e.stopPropagation()} className="ui standard modal visible active">
        <div className="header">{props.header}</div>
        <div className="content">{props.content}</div>
        <div className="actions">{props.modalActions}</div>
      </div>
    </div>,
    document.getElementById('modal')!
  );
};

export default Modal;
