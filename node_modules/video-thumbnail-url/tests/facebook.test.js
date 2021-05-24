import {testService} from './util';

const VALID = [
    'https://www.facebook.com/oculusvr/videos/814277555340427/'
];

const INVALID = [
    'https://www.facebook.com/',
    'https://www.facebook.com/photo.php?v=426337427566302&type=2&theater'
];


testService('facebook', VALID, INVALID, /^https\:\/\/scontent\.xx\.fbcdn\.net\/v\//);

//https://graph.facebook.com/814277555340427
//https://scontent.xx.fbcdn.net/v/