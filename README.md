### flac-vs-others

*flac-vs-others.js* is a command-line tool that compresses sounds into various formats. The files are then decompressed back to WAV, so you cannot distinguish them, unless you look at the answers... Or figure them out by yourself. Made in NodeJS.

**Disclaimer: the script kinda works, but it's still a work in progress.**

### Requirements

* **Node.js**
* Command-line tools: **flac**, **lame** (for MP3 support), **oggenc**/**oggdec** (for OGG support)

Works fine on Linux. Can also work on other OSes if you install the dependencies and tweak the `config.js` accordingly (tested on Windows, without OGG support though).

### Usage

```
git clone https://github.com/mkalam-alami/flac-vs-others.git
npm install -g flac-vs-others/
flac-vs-others input [config file]
```

* ```input```: The input file can be either in **WAV** or **FLAC** format. Or MP3/OGG, but then you're slightly missing the point. The output sounds (and the answers file) are generated in **out/** by default.
* ```config file```: You can use a custom configuration file by specifying its path. Just copy the default ```config.js``` where you want and customize it to your needs.

### Relevant

* [What Data Compression Does To Your Music](http://www.soundonsound.com/sos/apr12/articles/lost-in-translation.htm) on SoundOnSound
