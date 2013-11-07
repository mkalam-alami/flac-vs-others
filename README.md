### I hate MP3

> Okay. But hey, can you actually spot the difference between MP3 and FLAC quality ? Let's test your ears :)

*I hate MP3* is a Node script that generates sounds compressed in various formats. They are decompressed back to WAV so you cannot distinguish them, unless you look at the answers... Or figure them out by yourself.

### Requirements

* **Node.js**
* Command-line tools: **lame**, **oggenc**/**oggdec**, **flac**

### Usage

```
./i_hate_mp3.js [INPUT FILE]
```

The input file can be either in **WAV** or **FLAC** format. Or MP3/OGG, but then you're slightly missing the point.

### Relevant

* [What Data Compression Does To Your Music](http://www.soundonsound.com/sos/apr12/articles/lost-in-translation.htm) on SoundOnSound
