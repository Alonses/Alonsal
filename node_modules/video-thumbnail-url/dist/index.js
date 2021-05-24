'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getThumbnailURL;

var _url = require('url');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//extract id from url path
var RE_VIMEO = /^(?:\/video|\/channels\/[\w-]+|\/groups\/[\w-]+\/videos)?\/(\d+)$/;
var RE_YOUTUBE = /^(?:\/embed)?\/([\w-]{10,12})$/;
var RE_FACEBOOK = /^\/[\w-]+\/videos\/(\d+)(\/)?$/;

function getThumbnailURL(url) {
    return _bluebird2.default.try(function () {
        url = url || '';

        var urlobj = (0, _url.parse)(url, true);

        //youtube
        if (['www.youtube.com', 'youtube.com', 'youtu.be'].indexOf(urlobj.host) !== -1) {
            var video_id = null;
            if ('v' in urlobj.query) {
                if (urlobj.query.v && urlobj.query.v.match(/^[\w-]{10,12}$/)) {
                    video_id = urlobj.query.v;
                }
            } else {
                var match = RE_YOUTUBE.exec(urlobj.pathname);
                if (match) {
                    video_id = match[1];
                }
            }

            if (video_id) {
                return 'http://img.youtube.com/vi/' + video_id + '/hqdefault.jpg';
            }
        }

        //vimeo
        if (['www.vimeo.com', 'vimeo.com', 'player.vimeo.com'].indexOf(urlobj.host) !== -1) {
            var _match = RE_VIMEO.exec(urlobj.pathname);
            if (_match) {
                var _video_id = _match[1];
                return (0, _requestPromise2.default)({
                    uri: 'https://vimeo.com/api/v2/video/' + _video_id + '.json',
                    json: true
                }).then(function (data) {
                    if (data) {
                        return data[0].thumbnail_large;
                    }
                });
            }
        }

        //facebook
        if (['facebook.com', 'www.facebook.com'].indexOf(urlobj.host) !== -1) {
            var _match2 = RE_FACEBOOK.exec(urlobj.pathname);

            if (_match2) {
                var _video_id2 = _match2[1];
                return (0, _requestPromise2.default)({
                    uri: 'https://graph.facebook.com/' + _video_id2,
                    json: true
                }).then(function (data) {
                    if (data) {
                        return data.picture;
                    }
                });
            }
        }
        return null;
    });
}