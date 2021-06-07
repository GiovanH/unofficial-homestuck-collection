module.exports = {
    hidden: true,
    
    edit(archive) {
        archive.mspa.story['007623'].media[1] = archive.mspa.story['007623'].media[1].replace('scraps/fruitone', '05720_2')
        archive.mspa.story['007623'].content = archive.mspa.story['007623'].content.replace('PEACHY.gif', 'CAUCASIAN.gif')
    }
}