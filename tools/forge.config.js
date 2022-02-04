// Forge Configuration
const path = require('path');
const rootDir = process.cwd();
const iconPath = path.join(rootDir, 'assets', 'icon', 'icon.ico');

module.exports = {
  packagerConfig: {
    asar: false,
    icon: iconPath
  },
  // Forge Makers
  makers: [
    {
      // Squirrel.Windows is a no-prompt, no-hassle, no-admin method of installing
      // Windows applications and is therefore the most user friendly you can get.
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'BotLab',
        setupExe: 'BotLab Setup.exe',
        setupIcon: iconPath,
        iconUrl: iconPath
      },
    },
  ],
  plugins: [
    [
      "@electron-forge/plugin-webpack",
      {
        mainConfig: path.join(rootDir, "tools", "main.webpack.js"),
        renderer: {
          config: path.join(rootDir, "tools", "renderer.webpack.js"),
          entryPoints: [
            {
              html: path.join(rootDir, "public", "index.html"),
              js: path.join(rootDir, "src", "index.tsx"),
              name: "main_window",
              preload: {
                js: path.join(rootDir, "main", "preload.ts")
              }
            }
          ]
        }
      }
    ]
  ]
};
