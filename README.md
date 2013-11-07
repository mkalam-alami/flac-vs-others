### flac-vs-others.js

> So, you think MP3 sucks. But could you actually spot the difference with FLAC quality? Let's test your ears!

**flac-vs-others.js* is a Node script that generates sounds compressed in various formats. They are decompressed back to WAV so you cannot distinguish them, unless you look at the answers... Or figure them out by yourself.

**Note: the script kinda works, but it's still a work in progress.**

### Requirements

* **Node.js**
* Command-line tools: **lame**, **oggenc**/**oggdec**, **flac**

Only tested on Linux, but tweaking `config.js` should make it work on other OSes.

### Usage

```
./flac-vs-others.js [INPUT FILE]
```

The input file can be either in **WAV** or **FLAC** format. Or MP3/OGG, but then you're slightly missing the point. The output sounds (and the answers file) are generated in **out/**, but you can tweak this (and other stuff) in `config.js`.

### Relevant

* [What Data Compression Does To Your Music](http://www.soundonsound.com/sos/apr12/articles/lost-in-translation.htm) on SoundOnSound
