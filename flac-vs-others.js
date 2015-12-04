#! /usr/bin/env node

// Init

var config = require('./config.js');
var Q = require('q');
var util = require('util');
var fs = require('fs');
var exec = require('child_process').exec;
var mime = require('mime');

var inputFile = process.argv[2];
config.PATH_SOUND_RAW = config.DIR_TMP + '/raw.wav';

// Processing

var chain = removeDir(config.DIR_TMP)
  .then(function() { return removeDir(config.DIR_OUT) })
  .then(function() { return makeDir(config.DIR_TMP) })
  .then(function() { return makeDir(config.DIR_OUT) })
  .then(function() { return convert(inputFile, config.PATH_SOUND_RAW, 'WAV') });

var solutions = "";

var inputSounds = [];
for (id in config.COMPRESSIONS) {
  var compression = config.COMPRESSIONS[id];
  var compressedSound = config.DIR_TMP + '/' + ((compression.bitrate) ? compression.bitrate : 'sound') + '.' + compression.format.toLowerCase();
  chain = chain.then(buildCompressionFunction(compression, compressedSound));
  inputSounds.push({path: compressedSound, compression: compression});
}

function buildCompressionFunction(compression, compressedSound) {
  return function() {
    return convert(config.PATH_SOUND_RAW, compressedSound, compression.format, compression.bitrate);
  };
};

inputSounds = shuffle(inputSounds);
var solutions = "";
for (id in inputSounds) {
  var outSound = config.DIR_OUT + '/' + (parseInt(id)+1) + '.wav';
  chain = chain.then(buildDecompressionFunction(inputSounds[id], outSound));
  solutions += outSound + ' = ' + inputSounds[id].compression.format + inputSounds[id].compression.bitrate + '\n';
}

function buildDecompressionFunction(inputSound, outSound) {
  return function() {
    return convert(inputSound.path, outSound, 'WAV');
  };
};

if (config.AUTO_DELETE_TMP) {
  chain = chain.then(function() { return removeDir(config.DIR_TMP) });
}

chain = chain.then(function() { return writeToFile(config.DIR_OUT + '/solutions.txt', solutions) })
  .then(function() {
    console.log("Done.");
    process.exit(0);
  }, function(error) {
    console.error("ERROR: " + error);
    process.exit(-1);
  });

// Promises

function convert(path, output, format, bitrate) {
  format = format.toUpperCase();
  
  var deferred = Q.defer();
  var resolveConversion = function() {
    deferred.resolve();
  };
    
  fetchMimetype(path)
    .then(function(mimetype) {
      if (mimetype == 'audio/x-flac' || mimetype == 'audio/flac') {
        switch (format) {
          case 'FLAC': copy(path, output).then(resolveConversion); break;
          case 'WAV': promiseExec(config.COMMANDS.FLAC + ' -fds "' + path + '" -o ' + output).then(resolveConversion); break;
          default: deferred.reject('Cannot convert "' + path + '" from FLAC to ' + format);
        }
      }
      else if (mimetype == 'audio/x-wav') {
        switch (format) {
          case 'WAV': copy(path, output).then(resolveConversion); break;
          case 'MP3': promiseExec(config.COMMANDS.LAME + ' --quiet --preset ' + bitrate + ' "' + path + '" ' + output).then(resolveConversion); break;
          case 'OGG': promiseExec(config.COMMANDS.OGGENC + ' -b ' + bitrate + ' "' + path + '" -o ' + output).then(resolveConversion); break;
          default: deferred.reject('Cannot convert "' + path + '" from WAV to ' + format);
        }
      }
      else if (mimetype == 'audio/mpeg') {
        switch (format) {
          case 'MP3': copy(path, output).then(resolveConversion); break;
          case 'WAV': promiseExec(config.COMMANDS.LAME + ' --quiet --decode "' + path + '" ' + output).then(resolveConversion); break;
          default: deferred.reject('Cannot convert "' + path + '" from MP3 to ' + format); break;
        }
      }
      else if (mimetype == 'audio/x-vorbis+ogg') {
        switch (format) {
          case 'OGG': copy(path, output).then(resolveConversion); break;
          case 'WAV': promiseExec(config.COMMANDS.OGGDEC + ' "' + path + '" -o ' + output).then(resolveConversion); break;
          default: deferred.reject('Cannot convert "' + path + '" from OGG to ' + format); break;
        }
      }
      else {
        deferred.reject('Unsupported media type: "' + mimetype + '"');
      }
    })
    .catch(function(error) {
      deferred.reject(error);
    });
      
  return deferred.promise;
}

function fetchMimetype(path) {
  return Q.promise(function(resolve, reject, notify) {
    try {
      var mimeType = mime.lookup(path);
      resolve(mimeType);
    }
    catch (e) {
      reject(e);
    }
  });
}

function removeDir(path) {
  return promiseExec('rm -rf ' + path + '/');
}

function makeDir(path) {
  return promiseExec('mkdir ' + path);
}

function copy(path, output) {
  return promiseExec('cp "' + path + '" ' + output);
}

function promiseExec(command) {
  return Q.promise(function(resolve, reject, notify) {
    if (config.VERBOSE) {
      process.stdout.write(command);
    }
    exec(command, function (error, stdout, stderr) {
      if (error !== null) {
        console.error(error + command);
        reject(error);
      }
      else {
        if (config.VERBOSE) {
          console.log(' [OK]');
        }
        else {
          process.stdout.write('.');
        }
        resolve(stdout.trim());
      }
    });
  });
}

function writeToFile(path, string) {
  return Q.promise(function(resolve, reject, notify) {
    fs.writeFile(path, string, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  }); 
}

// Utils

function shuffle(o) { 
    // (Source: http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript)
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};
