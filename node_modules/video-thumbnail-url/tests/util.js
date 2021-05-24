import should from 'should';
import getThumbnailURL from '../index';

export function testService(service, valid_urls, invalid_urls, thumb_url) {
    describe(service, function() {

    valid_urls.forEach(url => {
        it(`should get thumb url for ${url}`, () => {
            return getThumbnailURL(url).then(result => {
                should.exist(result);
                result.should.match(thumb_url);
            });
        });
    });

    invalid_urls.forEach(url => {
        it(`should not get thumb url for ${url}`, () => {
            return getThumbnailURL(url).then(should.not.exist);
        });
    });
});
}

