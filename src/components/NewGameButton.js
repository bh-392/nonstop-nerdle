import Button from "./Button";

const NewGameButton = ({ startNewGame }) => {
  const handleClick = (e) => {
    e.target.blur();
    startNewGame();
  };

  return <Button onClick={handleClick}>New Game</Button>;
};

export default NewGameButton;
