module.exports = {
 
  /*
  ==================
  ENVIRONMENT CONFIG
  ==================
  */
   
  // The path to your conversion executables
  // (ex: 'lame' or 'C:/Program Files/lame/lame.exe')
  COMMANDS: {
    FLAC: 'flac', 
    LAME: 'lame',
    OGGENC: 'oggenc',
    OGGDEC: 'oggdec'
  },

  // Where to put the intermediate, compressed files
  DIR_TMP: 'tmp',
  
  // Where to put the final test files
  DIR_OUT: 'out',
  
  /*
  ===========
  TEST CONFIG
  ===========
  */
  
  // The files to include in the test
  COMPRESSIONS: [
    {format: 'WAV', bitrate: ''},
    {format: 'MP3', bitrate: '128'}, // Old-school MP3
    {format: 'MP3', bitrate: '320'}, // High-quality MP3
    {format: 'OGG', bitrate: '160'} // Spotify
  ],
  
  /*
  =============
  MISCELLANEOUS
  =============
  */
   
  // Delete the intermediate files
  AUTO_DELETE_TMP: true,

  // Trace all commands
  VERBOSE: false

};
