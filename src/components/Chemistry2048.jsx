import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSwipeable } from "react-swipeable";

const initialAtoms = ["H", "O", "C", "Na", "Cl", "Fe", "S", "N"];
const gridSize = 4;
const initialGrid = Array(gridSize)
  .fill(null)
  .map(() => Array(gridSize).fill(null));

const moleculeMap = {
  "H+H": "H₂",
  "O+O": "O₂",
  "H₂+O": "H₂O",
  "C+O₂": "CO₂",
  "Na+Cl": "NaCl",
  "Fe+O₂": "Fe₂O₃",
  "C+H": "CH",
  "C+H₄": "CH₄",
  "H₂+S": "H₂S",
  "S+O₂": "SO₂",
  "N+O": "NO",
};

const getRandomAtom = () => initialAtoms[Math.floor(Math.random() * initialAtoms.length)];

const addRandomTile = (grid) => {
  let emptyCells = [];
  grid.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (!cell) emptyCells.push([rowIndex, colIndex]);
    });
  });
  if (emptyCells.length === 0) return grid;
  const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const newGrid = grid.map((row) => [...row]);
  newGrid[row][col] = getRandomAtom();
  return newGrid;
};

const moveGrid = (grid, direction) => {
  let newGrid = grid.map((row) => [...row]);
  if (direction === "left") {
    newGrid = newGrid.map((row) => mergeTiles(row));
  } else if (direction === "right") {
    newGrid = newGrid.map((row) => mergeTiles(row.reverse()).reverse());
  } else if (direction === "up" || direction === "down") {
    let transposed = transpose(newGrid);
    if (direction === "down") transposed = transposed.map((row) => row.reverse());
    transposed = transposed.map((row) => mergeTiles(row));
    if (direction === "down") transposed = transposed.map((row) => row.reverse());
    newGrid = transpose(transposed);
  }
  return addRandomTile(newGrid);
};

const mergeTiles = (row) => {
  let newRow = row.filter((tile) => tile);
  for (let i = 0; i < newRow.length - 1; i++) {
    const combo = `${newRow[i]}+${newRow[i + 1]}`;
    if (moleculeMap[combo]) {
      newRow[i] = moleculeMap[combo];
      newRow[i + 1] = null;
      i++; 
    }
  }
  newRow = newRow.filter((tile) => tile);
  return [...newRow, ...Array(gridSize - newRow.length).fill(null)];
};

const transpose = (grid) => grid[0].map((_, i) => grid.map((row) => row[i]));

const Chemistry2048 = () => {
  const [grid, setGrid] = useState(addRandomTile(initialGrid));
  
  const handlers = useSwipeable({
    onSwipedLeft: () => setGrid(moveGrid(grid, "left")),
    onSwipedRight: () => setGrid(moveGrid(grid, "right")),
    onSwipedUp: () => setGrid(moveGrid(grid, "up")),
    onSwipedDown: () => setGrid(moveGrid(grid, "down")),
  });

  return (
    <div {...handlers} className="w-screen h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-2xl mb-4">Chemistry 2048</h1>
      <div className="grid grid-cols-4 gap-1 p-4 bg-gray-800 rounded-lg">
        {grid.flat().map((item, index) => (
          <motion.div
            key={index}
            className={`w-16 h-16 flex items-center justify-center text-white font-bold rounded-md ${item ? "bg-teal-500" : "bg-gray-700"}`}
            whileTap={{ scale: 0.9 }}
          >
            {item || ""}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Chemistry2048;
