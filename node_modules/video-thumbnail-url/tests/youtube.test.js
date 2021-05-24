import { testService } from './util';

const VALID = [
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'https://youtu.be/dQw4w9WgXcQ',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ&feature=youtu.be',
    'https://www.youtube.com/watch?feature=related&v=dQw4w9WgXcQ'
];

const INVALID = [
    'http://www.delfi.lt/news/ringas/lit/a-tapinas-viena-ministres-diena.d?id=71476806',
    'https://www.youture.com/watch?v=dQw4w9WgXcQ',
    'https://www.youtube.com/watch?v=',
    'https://www.youtube.com/watch?v=dQw4w9',
    'https://www.youtube.com'
];

testService('youtube', VALID, INVALID, /^http(s)?\:\/\/img\.youtube\.com\/vi\/([\w-]{10,12})\/hqdefault\.jpg$/);
