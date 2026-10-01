## Iron Man Hydration

A futuristic desktop hydration reminder built with Electron, JavaScript, HTML, and CSS.

The application combines a lightweight hydration reminder system with an Iron Man-inspired HUD interface, animated visuals, interactive controls, and persistent user settings.

## Features

Iron Man-inspired futuristic HUD interface
Custom hydration reminder interval
Interactive "I DRANK" action
5-minute snooze functionality
Settings panel for reminder configuration
Persistent reminder settings
Animated Iron Man entrance
Animated HUD card
Neon cyan glow effects
SVG-based HUD graphics
Transparent desktop popup
Lightweight Electron desktop application


## How It Works

The application runs a reminder timer in the background.
When the configured reminder interval is reached, a desktop popup appears with the Iron Man-inspired hydration HUD.

The user can then:
Confirm that they drank water using the "I DRANK" button
Snooze the reminder for 5 minutes
Open Settings and change the reminder interval
The selected reminder interval is stored locally and loaded when the application starts again.

##  Tech Stack

Electron
JavaScript
HTML5
CSS3
SVG
Node.js


## Project Structure

iron-man-hydration/  
│  
├── assets/  
│   └── ironmain.png  
│  
├── node_modules/  
├── .gitignore  
├── main.js  
├── preload.js  
├── popup.html  
├── settings.html  
├── package.json  
├── package-lock.json  
└── README.md