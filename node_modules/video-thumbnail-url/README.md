[![Build Status](https://travis-ci.org/Producters/video-thumbnail-url.svg?branch=master)](https://travis-ci.org/Producters/video-thumbnail-url)

video-thumbnail-url
===========================

Get thumbnail URL for a given video URL. Supports youtube, vimeo and facebook.


# Install

```sh
npm install video-thumbnail-url
```

# Usage

```javascript
import getThumb from 'video-thumbnail-url';

getThumb('https://www.youtube.com/watch?v=dQw4w9WgXcQ').then(thumb_url => { // thumb_url is  url or null
    console.log(thumb_url); // http://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg
});

```

# Recognized video urls

```
Youtube:

https://www.youtube.com/embed/[video-id]'
https://youtu.be/[video-id]'
https://www.youtube.com/watch?v=[video-id]'

Vimeo:

http://vimeo.com/[video-id]
http://player.vimeo.com/video/[video-id]
https://vimeo.com/channels/[channel]/[video-id]
https://vimeo.com/groups/[group]/videos/[video-id]

Facebook:

https://www.facebook.com/[user]/videos/[video-id]/

```

# Test

```sh
npm test
```