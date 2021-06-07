module.exports = {
    hidden: true,
    
    // routes: {
    //     'assets://archive/comics/pxs/52-summerteen-romance/31.png': 'assets://archive/comics/pxs/52-summerteen-romance/31_old.png',
    // }

    edit(archive) {
        archive.comics.pxs.comics['summerteen-romance'].pages[31-1] = "/archive/comics/pxs/52-summerteen-romance/31_old.png"
    }
}
