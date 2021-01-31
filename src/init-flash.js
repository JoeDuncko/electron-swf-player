const { app } = require('electron');
const path = require('path');

const getPlugin = () => {
  if (process.platform === 'win32') {
    if (process.arch === 'x64') {
      return {
        pluginPath: 'pepflashplayer64_32_0_0_363.dll',
        version: '32.0.0.363',
      };
    }

    return {
      pluginPath: 'pepflashplayer32_32_0_0_363.dll',
      version: '32.0.0.363',
    };
  }

  if (process.platform === 'darwin') {
    return {
      pluginPath: 'PepperFlashPlayer.plugin',
      version: '30.0.0.127',
    };
  }

  return null;
};

module.exports = () => {
  const plugin = getPlugin();

  if (plugin === null) {
    return;
  }

  const { pluginPath, version } = plugin;

  app.commandLine.appendSwitch(
    'ppapi-flash-path',
    path.join(__dirname, 'pepper-flash-player', pluginPath)
  );

  app.commandLine.appendSwitch('ppapi-flash-version', version);
};
