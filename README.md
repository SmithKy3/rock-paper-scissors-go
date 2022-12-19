# Rock, Paper, Scissors, GO!

A small 2D "game?" that allows the user to spawn some number of emoji entities.
Each emoji is either rock, paper or scissors.
These emojis then bounce around the screen and when they collide with
another emoji, an instant game of rock, paper, scissors takes place.
The losing emoji takes the form of the winner and they bounce off of one another.
May the best emoji win!

## Architecture

The app uses React, written in TypeScript, and the build tool is Vite. We're using
SCSS modules for styling.
All rendering is done manually by simply rendering emojis as text to an HTML5 canvas.
All "physics" is implemented using some simple 2D vector maths, no libraries used/needed.

## Running locally

Simply clone the repo, run `yarn`/`yarn install` followed by `yarn dev` to start up the
dev-server on port 3000.
Run `yarn build` to run in production mode.
