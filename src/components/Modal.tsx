import "./Modal.scss";
import closeIcon from "../assets/closeIcon.svg"

type ModalProps = {
  children: React.ReactNode
  closeModal: () => void
}

export function Modal ({children, closeModal}: ModalProps) {

  return (
    <div className="modal">
      <div className="modal__content">
        <button className="modal__close-button" onClick={closeModal}><img src={closeIcon} /></button>
        <div className="modal__children">
          {children}
        </div>
      </div>
    </div>
  )
}