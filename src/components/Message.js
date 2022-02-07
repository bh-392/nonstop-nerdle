import styles from "./Message.module.css";

const Message = ({ message: { type, content } }) => {
  const className = `${styles.container} ${styles[type]}`;

  return (
    <div className={className}>
      <div>{content}</div>
    </div>
  );
};

export default Message;
