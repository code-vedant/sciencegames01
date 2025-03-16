import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import foodChainsEasy from '../assets/foodChainsEasy.json'
import foodChainsMedium from '../assets/foodChainsMedium.json'
import foodChainsHard from '../assets/foodChainsHard.json'

const levels = {
  easy: [...foodChainsEasy],
  medium: [...foodChainsMedium],
  hard: [...foodChainsHard],
};

const ItemType = "ANIMAL";

const Animal = ({ name }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { name },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className="p-2 bg-blue-400 text-white rounded-md cursor-pointer"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {name}
    </div>
  );
};

const DropZone = ({ onDrop, index, filledSlots }) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemType,
    drop: (item) => onDrop(item.name, index),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className="w-24 h-10 border-2 border-dashed flex items-center justify-center"
      style={{ backgroundColor: isOver ? "lightblue" : "transparent" }}
    >
      {filledSlots[index] || "Drop Here"}
    </div>
  );
};

const Game = () => {
  const [level, setLevel] = useState("easy");
  const [currentChainIndex, setCurrentChainIndex] = useState(0);
  const [filledSlots, setFilledSlots] = useState([]);
  const [popup, setPopup] = useState(null);

  const handleDrop = (animal, index) => {
    const correctAnswers = levels[level][currentChainIndex].correct;
    if (correctAnswers.includes(animal) && !filledSlots.includes(animal)) {
      const newFilledSlots = [...filledSlots];
      newFilledSlots[index] = animal;
      setFilledSlots(newFilledSlots);

      if (newFilledSlots.filter(Boolean).length === correctAnswers.length) {
        setPopup("Correct!");
        setTimeout(() => {
          setPopup(null);
          setFilledSlots([]);
          setCurrentChainIndex((prev) => (prev + 1) % levels[level].length);
        }, 1000);
      }
    } else {
      setPopup("Wrong! Try Again");
      setTimeout(() => setPopup(null), 1000);
    }
  };

  const handleReplay = () => {
    setCurrentChainIndex(0);
    setFilledSlots([]);
    setPopup(null);
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl mb-4">Who Eats Who?</h1>
      <div className="flex gap-4 mb-4">
        {Object.keys(levels).map((lvl) => (
          <button
            key={lvl}
            onClick={() => {
              setLevel(lvl);
              setCurrentChainIndex(0);
              setFilledSlots([]);
            }}
            className={`px-4 py-2 rounded-md ${lvl === level ? "bg-blue-500" : "bg-gray-600"}`}
          >
            {lvl.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="flex gap-4">
        {levels[level][currentChainIndex].chain.map((animal, index) =>
          animal === "" ? (
            <DropZone key={index} index={index} onDrop={handleDrop} filledSlots={filledSlots} />
          ) : (
            <div key={index} className="p-2">{animal}</div>
          )
        )}
      </div>
      <div className="grid grid-cols-4 gap-4 mt-8">
        {levels[level][currentChainIndex].options.map((animal, index) => (
          <Animal key={index} name={animal} />
        ))}
      </div>
      {popup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md text-black">
            <p>{popup}</p>
            {popup !== "Correct!" && <button onClick={() => setPopup(null)}>Close</button>}
          </div>
        </div>
      )}
      <button onClick={handleReplay} className="mt-4 px-4 py-2 bg-red-500 rounded-md">Replay</button>
    </div>
  );
};

const WhoEatsWho = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Game />
    </DndProvider>
  );
};

export default WhoEatsWho;