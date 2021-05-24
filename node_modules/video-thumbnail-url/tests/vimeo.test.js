import { testService } from './util';

const VALID = [
    'http://vimeo.com/167195274',
    'http://vimeo.com/167195274?foo=bar',
    'http://player.vimeo.com/video/167195274',
    'http://player.vimeo.com/video/167195274?title=0&amp;byline=0&amp;portrait=0',
    'https://vimeo.com/channels/staffpicks/167195274',
    'https://vimeo.com/groups/motion/videos/169674362'
];

const INVALID = [
    'http://www.delfi.lt/news/ringas/lit/a-tapinas-viena-ministres-diena.d?id=71476806',
    'http://video.com/6701902',
    'http://vimeo.com',
    'http://vimeo.com/videoschool',
    'http://vimeo.com/videoschool/archive/behind_the_scenes',
    'http://vimeo.com/forums/screening_room',
    'http://vimeo.com/forums/screening_room/topic:42708'
];

testService('vimeo', VALID, INVALID, /^http(s)?\:\/\/i\.vimeocdn\.com\/video\/(\d)+\_640\.jpg$/);