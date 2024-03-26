import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Flex, Heading, Image, Spacer, Text } from "@chakra-ui/react";
import { FaArrowLeft, FaArrowRight, FaArrowUp, FaArrowDown } from "react-icons/fa";

const PLAYER_SIZE = 50;
const ZOMBIE_SIZE = 40;
const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;
const ZOMBIE_SPEED = 1;

const Index = () => {
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 175 });
  const [zombiePositions, setZombiePositions] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameRef = useRef(null);

  useEffect(() => {
    const createZombie = () => {
      const newZombie = {
        x: GAME_WIDTH - ZOMBIE_SIZE,
        y: Math.random() * (GAME_HEIGHT - ZOMBIE_SIZE),
      };
      setZombiePositions((prevZombies) => [...prevZombies, newZombie]);
    };

    const gameLoop = setInterval(() => {
      setZombiePositions((prevZombies) =>
        prevZombies
          .map((zombie) => ({
            ...zombie,
            x: zombie.x - ZOMBIE_SPEED,
          }))
          .filter((zombie) => zombie.x > 0),
      );

      if (Math.random() < 0.02) {
        createZombie();
      }

      setScore((prevScore) => prevScore + 1);
    }, 20);

    return () => {
      clearInterval(gameLoop);
    };
  }, []);

  useEffect(() => {
    const checkCollision = () => {
      const collision = zombiePositions.some((zombie) => Math.abs(zombie.x - playerPos.x) < PLAYER_SIZE && Math.abs(zombie.y - playerPos.y) < PLAYER_SIZE);

      if (collision) {
        setGameOver(true);
      }
    };

    checkCollision();
  }, [playerPos, zombiePositions]);

  const movePlayer = (dx, dy) => {
    setPlayerPos((prevPos) => ({
      x: Math.min(Math.max(prevPos.x + dx, 0), GAME_WIDTH - PLAYER_SIZE),
      y: Math.min(Math.max(prevPos.y + dy, 0), GAME_HEIGHT - PLAYER_SIZE),
    }));
  };

  const resetGame = () => {
    setPlayerPos({ x: 50, y: 175 });
    setZombiePositions([]);
    setScore(0);
    setGameOver(false);
  };

  return (
    <Flex direction="column" align="center" justify="center" h="100vh">
      <Heading mb={4}>Cube Shooter Game</Heading>
      <Box ref={gameRef} position="relative" w={`${GAME_WIDTH}px`} h={`${GAME_HEIGHT}px`} bg="gray.200" overflow="hidden">
        <Box position="absolute" top={playerPos.y} left={playerPos.x} w={`${PLAYER_SIZE}px`} h={`${PLAYER_SIZE}px`} bg="blue.500" />
        {zombiePositions.map((zombie, index) => (
          <Box key={index} position="absolute" top={zombie.y} left={zombie.x} w={`${ZOMBIE_SIZE}px`} h={`${ZOMBIE_SIZE}px`} bg="green.500" />
        ))}
      </Box>
      <Text mt={4}>Score: {score}</Text>
      {gameOver && (
        <Box mt={4}>
          <Heading size="lg" color="red.500">
            Game Over!
          </Heading>
          <Button onClick={resetGame} mt={4}>
            Play Again
          </Button>
        </Box>
      )}
      <Flex mt={4}>
        <Button onClick={() => movePlayer(-5, 0)}>
          <FaArrowLeft />
        </Button>
        <Spacer />
        <Button onClick={() => movePlayer(5, 0)}>
          <FaArrowRight />
        </Button>
      </Flex>
      <Flex mt={2}>
        <Button onClick={() => movePlayer(0, -5)}>
          <FaArrowUp />
        </Button>
        <Spacer />
        <Button onClick={() => movePlayer(0, 5)}>
          <FaArrowDown />
        </Button>
      </Flex>
    </Flex>
  );
};

export default Index;
