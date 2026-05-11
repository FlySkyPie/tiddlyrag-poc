# Mistreevous Visualiser

An interactive web-based visualiser and playground for [Mistreevous](https://github.com/nikkorn/mistreevous), a behaviour tree library written in TypeScript.

Define behaviour trees using MDSL (Mistreevous Domain Specific Language) or JSON, wire up an agent, and watch the tree execute in real time with a visual node graph.

## Features

- Write behaviour tree definitions in MDSL or JSON with syntax highlighting
- Auto-detection of definition format (MDSL/JSON)
- Convert MDSL definitions to JSON
- Define agent classes with custom actions, conditions, and guards
- Step through tree execution visually with play, replay, and stop controls
- Interactive canvas with auto-layout and fit-to-screen
- Built-in examples covering leaf nodes, composites, decorators, guards, callbacks, and more

## Getting Started

### Prerequisites

This project depends on a local copy of the `mistreevous` package (linked via `file:../mistreevous` in `package.json`). Make sure you have the [mistreevous](https://github.com/nikkorn/mistreevous) repository cloned as a sibling directory before installing dependencies.

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
```

Builds the app for production into the `build` folder and copies the output to `docs` for GitHub Pages deployment.

## Usage

1. Write a behaviour tree definition in the **Definition** panel (left side) using MDSL or JSON.
2. Define an **Agent** class in the panel below with the actions and conditions referenced in your tree.
3. Press the **Play** button to step through the tree and watch nodes transition between states on the canvas.
4. Use the **Examples** menu to load pre-built demonstrations of different node types and patterns.

### Example (MDSL)

```
root {
    selector {
        sequence {
            condition [HasDollars, 15]
            action [OrderFood, "Pizza"]
        }
        sequence {
            condition [HasIngredient, "Egg"]
            action [CookFood, "Omelette"]
        }
        action [Starve]
    }
}
```

## Tech Stack

- React 18 + TypeScript
- Material UI 5
- Ace Editor (code editing with custom MDSL mode)
- ELK.js (graph layout)

## License

MIT — see [LICENSE](./LICENSE) for details.
