import Image from 'next/image'
import styles from '../../styles/Home.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <a
        href="https://mattered.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        Powered by &nbsp;<strong>mattered</strong>
        <span className={styles.logo}>
          <Image src="/mattered_logo.png" alt="Mattered Logo" width={16} height={16} />
        </span>
      </a>
    </footer>
  )
}
