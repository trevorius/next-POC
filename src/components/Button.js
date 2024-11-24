import styles from '@/styles/components/Button.module.scss';

export default function Button({ children, ...props }) {
  return (
    <button className={styles.customButton} {...props}>
      {children}
    </button>
  );
}
