import styles from "./DevelopmentLog.module.css";

const DevelopmentLog = ({ log }) => {
  return <div className={styles.log}>{log}</div>;
};

export default DevelopmentLog;
