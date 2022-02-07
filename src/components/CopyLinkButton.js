import Button from "./Button";

let messageTimer;

const CopyLinkButton = ({ setMessage }) => {
  if (navigator.clipboard === undefined) {
    return null;
  }

  const handleClick = (e) => {
    e.target.blur();
    navigator.clipboard.writeText(document.URL).then(() => {
      clearTimeout(messageTimer);
      setMessage({
        type: "success",
        content: "Copied. Share it with your friends. 🥳",
      });
      messageTimer = setTimeout(() => setMessage(null), 3000);
    });
  };

  return <Button onClick={handleClick}>Copy Link</Button>;
};

export default CopyLinkButton;
