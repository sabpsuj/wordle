import "./PrivacyModal.scss"

type PrivacyModalProps = {
  onClose: () => void
  isOpen: boolean
}

export function PrivacyModal({isOpen, onClose}: PrivacyModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="privacy-modal">
      <p className="privacy-modal__content">This site does not gather, keep, or handle any personal information, and it does not use cookies. However, because it is hosted on <a href="https://pages.github.com/" target="_blank">GitHub Pages</a>, the <a href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement" target="_blank">GitHub Privacy Statement</a> still applies. Additionally, for statistical insights, <a href="https://www.cloudflare.com/en-gb/web-analytics/" target="_blank">Cloudflare Web Analytics</a> is employed.</p>
      <button onClick={onClose} className="privacy-modal__button">OK</button>
    </div>
  )
}