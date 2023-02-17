import React from 'react';
import Modal from './Modal';

export interface ErrorModalProps {
  header: string;
  onCloseModal: () => void;
  content: string;
}

function ErrorModal(props: ErrorModalProps) {
  return (
    <Modal
      header={<h2>{props.header}</h2>}
      onCloseModal={props.onCloseModal}
      content={<p>{props.content}</p>}
      modalActions={
        <button className="ui button negative" onClick={props.onCloseModal}>
          OK
        </button>
      }
    />
  );
}

export default ErrorModal;
