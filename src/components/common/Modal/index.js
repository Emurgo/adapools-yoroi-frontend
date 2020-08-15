// @flow
import React, { useState, useRef, useEffect } from 'react';
import ReactDom from 'react-dom';
import { StyledModal } from './styles';
import closeIcon from '../../../assets/close-icon.svg';

const modalRoot = document.getElementById('modal-root');

type Props = {
  children: any,
  id: string,
  modalSize?: string,
  modalClass?: string,
  onClose: Function,
  isOpen: Function,
  setSuccessMode: Function,
  title: string,
  success: boolean,
};

const Index = ({
  children,
  id,
  modalSize = 'md',
  modalClass = '',
  onClose,
  isOpen,
  title,
  success,
  setSuccessMode,
}: Props) => {
  const [fadeType, setFadeType] = useState(null);

  const background = useRef(null);

  useEffect(() => {
    const onEscKeyDown = (e) => {
      if (e.key !== 'Escape') return;
      setFadeType('out');
      onClose();
    };
    window.addEventListener('keydown', onEscKeyDown, false);
    // setTimeout(() => setFadeType('in'), 0);

    if (isOpen) setFadeType('in');
    if (!isOpen) setFadeType('out');
    return () => {
      window.removeEventListener('keydown', onEscKeyDown, false);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (success === true) {
      setTimeout(() => {
        setFadeType('out');
        setSuccessMode(false);
      }, 2000);
    }
  }, [success, setSuccessMode]);

  const handleClick = () => {
    // e.preventDefault();
    setFadeType('out');
    onClose();
  };

  const transitionEnd = (e) => {
    if (e.propertyName !== 'opacity' || fadeType === 'in') return;

    if (fadeType === 'out') {
      onClose();
    }
  };

  return ReactDom.createPortal(
    <StyledModal
      id={id}
      modalSize={modalSize}
      className={`wrapper fade-${String(fadeType)} ${modalClass}`}
      onTransitionEnd={transitionEnd}
    >
      <div className="box-dialog" style={{ height: '100%' }}>
        <div className="box-header">
          <h4 className="box-title">{title}</h4>
          <button type="button" onClick={handleClick} className="x-close">
            <img src={closeIcon} alt="" />
          </button>
        </div>
        <div className="box-content">{children}</div>
      </div>
      <div
        role="button"
        tabIndex={0}
        className="background"
        onMouseDown={handleClick}
        ref={background}
      />
    </StyledModal>,
    modalRoot
  );
};

export default Index;
