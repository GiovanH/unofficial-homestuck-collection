var hq_pages = [
    "001977", "001988", "001990", "002037", "002122", "002146", "002153", "002150", "002288", 
    "002322", "002376", "002544", "002551", "002565", "002655", "002657", "002733", 
    "002736", "002743", "002771", "002779", "002818", "002838", "002848", "002879", 
    "002880", "002926", "002970", "002973", "003049", "003167", "003307", "003541", 
    "003556", "003568", "003701", "003831", "003840", "pony", "004478", "004526", 
    "004687", "004748", "004827", "004888", "004901", "004979", "004987", "005197", 
    "005221", "005338", "005420", "005579", "005596", "005595", "005618", "005625", 
    "005644", "005985", "006011", "006009", "006013", "006175", "006273", "006290", 
    "006386", "006472", "006517", "006565", "006720", "006725", "006727", "006842", 
    "006844", "006927", "007138", "007152", "007161", "007327", "007338", "007412", 
    "007555", "007881", "007966", "008131", "darkcage", "pony2", "008178", "008300", 
    "008801", "008998", "009348", "009349", "009828", "009859"
]

var two_track_flashes = ['00980', '03435', '04370']

var looping_flashes = [
    ['00980_1', '00980_2', '07921']
]

var hq_baked_in = [
    "00077", "00088", "00090", "00253", "00338", "00250", "00388", "00422", "00476", 
    "00836", "00843", "00871", "00879", "00918", "00938", "03000", "03077", "03715", 
    "03722", "04817", "04822", "04824", "06397", "07445"
]

module.exports = {
    hidden: true,
    
    edit(archive) {
        console.log("Setting HQ audio")
        archive.flags['HQAUDIO'] = true
        hq_pages.forEach(page_num => {
            const page = archive.mspa.story[page_num]

            const filename = page.media[0].split('/').pop()
            const plainname = filename.split(".").slice(0, -1).join(".")
            const base_url = page.media[0].split("/").slice(0, -1).join("/")
            const ext = filename.split('.').pop()

            // audiodata is keyed to the normal swf path, not _hq.swf.
            if (two_track_flashes.includes(plainname)){ 
                archive.audioData[page.media[0]] = [
                    {
                        href: `${base_url}/${plainname}_1.mp3`, 
                        loop: (looping_flashes.includes(`${plainname}_1`))
                    },
                    {
                        href: `${base_url}/${plainname}_2.mp3`, 
                        loop: (looping_flashes.includes(`${plainname}_2`))
                    }
                ]
            } else if (plainname == '04106'){
                archive.audioData[page.media[0]] = [] 
                for (var i = 1; i <= 5; i++) 
                    archive.audioData[page.media[0]].push({
                        href: `${base_url}/cascade_segment${i}.mp3`, 
                        loop: (looping_flashes.includes(`cascade_segment${i}`))
                    })
            } else if (hq_baked_in.includes(plainname)) {
                archive.mspa.story[page_num].media[0] = `${base_url}/${plainname}_hqbaked.${ext}`
            } else {
                archive.audioData[page.media[0]] = [
                    {
                        href: `${base_url}/${plainname}.mp3`,
                        loop: (looping_flashes.includes(plainname))
                    },
                ]
            }
        })
    }
}