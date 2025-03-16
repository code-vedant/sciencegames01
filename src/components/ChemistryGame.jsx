import React, { useEffect, useRef, useState } from "react";
import { Engine, Render, World, Bodies, Runner, Composite } from "matter-js";

const ChemistryGame = () => {
  const scene = useRef(null);
  const engine = useRef(Engine.create());
  const [liquids, setLiquids] = useState([]);

  useEffect(() => {
    const { world } = engine.current;
    const render = Render.create({
      element: scene.current,
      engine: engine.current,
      options: { width: 800, height: 600, wireframes: false },
    });

    // Create test tubes (Static Bodies)
    const testTubes = [
      Bodies.rectangle(200, 500, 50, 200, { isStatic: true, label: "tube1" }),
      Bodies.rectangle(400, 500, 50, 200, { isStatic: true, label: "tube2" }),
      Bodies.rectangle(600, 500, 50, 200, { isStatic: true, label: "tube3" }),
    ];
    World.add(world, testTubes);

    // Create liquid particles inside the first test tube
    const liquidParticles = [];
    for (let i = 0; i < 20; i++) {
      const particle = Bodies.circle(200, 400 - i * 5, 5, {
        restitution: 0.5,
        render: { fillStyle: "red" },
        label: "liquid",
      });
      liquidParticles.push(particle);
    }
    Composite.add(world, liquidParticles);
    setLiquids(liquidParticles);

    // Run the engine
    Runner.run(engine.current);
    Render.run(render);

    return () => {
      Render.stop(render);
      World.clear(world);
      Engine.clear(engine.current);
    };
  }, []);

  return (
    <div
      ref={scene}
      style={{
        border: "1px solid black",
        margin: "20px auto",
        width: "800px",
        height: "600px",
      }}
    />
  );
};

export default ChemistryGame;