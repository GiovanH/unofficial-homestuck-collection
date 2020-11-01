import Vue from 'vue'
import App from './App'
import router from './router'
import localData from './store/localData'
import fs from 'fs'
import path from 'path'

const Store = require('electron-store')
const store = new Store()

import { library } from '@fortawesome/fontawesome-svg-core'
import { faExternalLinkAlt, faChevronUp, faChevronRight, faChevronDown, faChevronLeft, faSearch, faEdit, faSave, faTrash, faTimes, faPlus, faPen, faMusic, faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { defaultCipherList } from 'constants'

library.add([faExternalLinkAlt, faChevronUp, faChevronRight, faChevronDown, faChevronLeft, faSearch, faEdit, faSave, faTrash, faTimes, faPlus, faPen, faMusic, faLock])

Vue.component('fa-icon', FontAwesomeIcon)

Vue.config.productionTip = false

Vue.use(localData, {
  store: new localData.Store(store.get('localData'))
})

const {shell, ipcRenderer} = require('electron')
let { port, archive } = ipcRenderer.sendSync('STARTUP_REQUEST')

Vue.mixin({
  data(){
    return {
      $appVersion: '1.0.0',
      $expectedAssetVersion: '1'
    }
  },
  computed: {
    $localhost: () => `http://127.0.0.1:${port}/`,
    $archive: () => archive,
    $isNewReader() {
      return this.$localData.settings.newReader.current && this.$localData.settings.newReader.limit
    }
  },
  methods: {
    $resolvePath(to){
      let route = this.$router.resolve(to).route
      let resolvedUrl = route.path
      let base = route.path.slice(1).split("/")[0]
      let vizBases = ['jailbreak', 'bard-quest', 'blood-spade', 'problem-sleuth', 'beta', 'homestuck']
      if (!this.$localData.settings.mspaMode && base == 'mspa') {
        let vizNums = this.$mspaToViz(route.params.p)
        if (vizNums) resolvedUrl = `/${vizNums.s}/${vizNums.p}`
      }
      else if (this.$localData.settings.mspaMode ) {
        if (base == 'mspa') {
          if (route.params.p.padStart(6, '0') in this.$archive.mspa.story) resolvedUrl =  `/mspa/${route.params.p.padStart(6, '0')}` 
        }
        else if (vizBases.includes(base)) {
          let mspaNums = this.$vizToMspa(base, route.params.p)
          if (mspaNums.p) resolvedUrl = `/mspa/${mspaNums.p}`
        }
      }
      return resolvedUrl
    },
    $openLink(url, auxClick = false) {
      let urlObject = new URL(url.replace(/(localhost:8080|app:\/\/\.\/)index\.html\??/, '$1'))
      let to = (/mspaintadventures/.test(urlObject.href) && !!urlObject.search) ? urlObject.href : urlObject.pathname
      to = to.replace(/.*mspaintadventures.com\/(\w*\.php)?\?s=(\w*)&p=(\w*)/, "/mspa/$3")
            .replace(/.*mspaintadventures.com\/\?s=(\w*)/, "/mspa/$1")

      if (!/(app:\/\/\.(index)?|\/\/localhost:8080)/.test(urlObject.origin)) {
        shell.openExternal(urlObject.href)
      }
      else if (/\.(html|pdf)$/i.test(to)){
        shell.openExternal(this.$mspaURL(to))
      }
      else if (/\.(jpg|png|gif|swf|txt|mp3|wav|mp4|webm)$/i.test(to)){
        this.$root.$children[0].$refs[this.$localData.tabData.activeTabKey][0].$refs.modal.open(to)
      }
      else if (auxClick) {
        this.$localData.root.TABS_NEW(to, true)
      }
      else {
        this.$pushURL(to)
      }
    },
    $pushURL(to, key = this.$localData.tabData.activeTabKey){
      let url = this.$resolvePath(to.toLowerCase())
      this.$localData.root.TABS_PUSH_URL(url, key)
    },
    $filterURL(url){
      return url
        .replace(/^.+:\/\/(www\.|cdn\.)?mspaintadventures\.com\/?((scratch|trickster|ACT6ACT5ACT1x2CO|ACT6ACT6)\.php)?/, "")
        .replace(/^(.+:\/\/127.0.0.1:\d*\/|.+:\/\/localhost:\d*\/|app:\/\/\.|)/, "")
        .replace(/^extras\/(ps\d{6})\.html/, "/unlock\/$1")
        // .replace(/\.html$/, "")
        .replace(/sweetbroandhellajeff\/(?:comoc\.php)?\?cid=0(\d{2})\.jpg/, "/sbahj/$1")
        .replace(/storyfiles\/hs2\/(waywardvagabond\/\w+\/)$/, "/$1")
        .replace(/\?s=(\w*)&p=(\w*)/, "/mspa/$2")
        .replace(/\?s=(\w*)/, "/mspa/$1")
        .replace(/\/Sfiles/, "")
        .replace(/%20/g, " ")
    },
    $mspaFileStream(url) {
      return path.join(this.$localData.assetDir, this.$filterURL(url))
    },
    $mspaURL(url) {
      let resource = this.$filterURL(url)
      if (resource.charAt(0) == '/') resource = resource.slice(1)
      return this.$localhost + resource
    },
    $getStory(pageNumber){
      pageNumber = parseInt(pageNumber) || pageNumber

      //JAILBREAK
      if (pageNumber <= 135 || pageNumber == "jb2_000000"){
        return 1
      }      
      //BARD QUEST
      else if (pageNumber >= 136 && pageNumber <= 216) {
        return 2
      }
      //BLOOD SPADE
      else if (pageNumber == "mc0001") {
        return 3
      }      
      //PROBLEM SLEUTH
      else if (pageNumber >= 219 && pageNumber <= 1892){
        return 4
      }      
      //HOMESTUCK BETA
      else if (pageNumber >= 1893 && pageNumber <= 1900){
        return 5
      }      
      //HOMESTUCK
      else if (pageNumber >= 1901 && pageNumber <= 10030 || (pageNumber == "pony" || pageNumber == "pony2" || pageNumber == "darkcage" || pageNumber == "darkcage2")){
        return 6
      }

      return undefined

    },
    $vizToMspa(vizStory, vizPage) {
      let mspaPage
      let vizNum = !isNaN(vizPage) ? parseInt(vizPage) : undefined

      switch(vizStory){
        case 'jailbreak':
          mspaPage = (vizNum == 135) ? 'jb2_000000' : (vizNum + 1).toString().padStart(6, '0')
          if (1 > vizNum || vizNum > 135 || !(mspaPage in this.$archive.mspa.story)) return {s: undefined, p: undefined}
          break
        case 'bard-quest':
          mspaPage = (vizNum == 1) ? "000136" : (vizNum + 169).toString().padStart(6, '0')
          if (1 > vizNum || vizNum > 47 || !(mspaPage in this.$archive.mspa.story)) return {s: undefined, p: undefined}
          break
        case 'blood-spade':
          if (vizNum == 1) mspaPage = "mc0001"
          else return {s: undefined, p: undefined}
          break
        case 'problem-sleuth':
          mspaPage = (vizNum + 218).toString().padStart(6, '0')
          if (1 > vizNum || vizNum > 1674 || !(mspaPage in this.$archive.mspa.story)) return {s: undefined, p: undefined}
          break
        case 'beta':
          mspaPage = (vizNum + 1892).toString().padStart(6, '0')
          if (1 > vizNum || vizNum > 8 || !(mspaPage in this.$archive.mspa.story)) return {s: undefined, p: undefined}
          break
        case 'homestuck':
          mspaPage = vizNum ? (vizNum + 1900).toString().padStart(6, '0') : vizPage
          if (1 > vizNum || vizNum > 8130 || !(mspaPage in this.$archive.mspa.story)) return {s: undefined, p: undefined}
          break
        case 'ryanquest':
          mspaPage = vizNum.toString().padStart(6, '0')
          if (1 > vizNum || vizNum > 15 || !(mspaPage in this.$archive.mspa.ryanquest)) return {s: undefined, p: undefined}
          break
        
      }
      return {s: vizStory == 'ryanquest' ? 'ryanquest' : this.$getStory(mspaPage), p: mspaPage}
    },
    $mspaToViz(mspaInput, isRyanquest = false){
      let mspaPage = (mspaInput.padStart(6, '0') in this.$archive.mspa.story) ? mspaInput.padStart(6, '0') : mspaInput
      let mspaStory = this.$getStory(mspaPage)
      let vizStory, vizPage

      if (isRyanquest) {
        if (!(mspaPage in this.$archive.mspa.ryanquest)) return undefined
        return {s: 'ryanquest', p: parseInt(mspaPage).toString() }
      }
      else if (!(mspaPage in this.$archive.mspa.story)) return undefined
      else {
        switch(mspaStory){
          case 1:
            vizStory = "jailbreak"
            vizPage = (mspaPage == 'jb2_000000') ? '135' : (parseInt(mspaPage) - 1).toString()
            break
          case 2:
            vizStory = "bard-quest"
            if (parseInt(mspaPage) == 136) vizPage = "1"
            else vizPage = (parseInt(mspaPage) - 169).toString()
            break
          case 3:
            vizStory = "blood-spade"
            vizPage = "1"
            break
          case 4:
            vizStory = "problem-sleuth"
            vizPage = (parseInt(mspaPage) - 218).toString()
            break
          case 5:
            vizStory = "beta"
            vizPage = (parseInt(mspaPage) - 1892).toString()
            break
          case 6:
            vizStory = "homestuck"
            vizPage = isNaN(mspaPage) ? mspaPage : (parseInt(mspaPage) - 1900).toString()
            break
        }
        return {s: vizStory, p: vizPage}
      }
    },
    $isVizBase(base){
      return ['jailbreak', 'bard-quest', 'blood-spade', 'problem-sleuth', 'beta', 'homestuck', 'ryanquest'].includes(base)
    },
    $mspaOrVizNumber(mspaId){
      return !(mspaId in this.$archive.mspa.story) || this.$localData.settings.mspaMode ? mspaId : this.$mspaToViz(mspaId).p
    },
    $updateNewReader(thisPageId, forceOverride = false) {
      let isSetupMode = !this.$archive
      if (!/\D/.test(thisPageId) && '001901' <= thisPageId && thisPageId <= '010030' && (isSetupMode || thisPageId in this.$archive.mspa.story)) {
        let nextLimit

        //Some pages don't directly link to the next page. These are manual exceptions to catch them up to speed
        //murder me for this horrible block of if-statements if you want, but stack overflow tells me its faster than the switch I was originall working with so shrug
        if (!isSetupMode) {
          //DISC TRANSITIONS + CASCADE SCRAPBOOK
          if (thisPageId == '005643') nextLimit = '005644'
          else if (thisPageId == '005984') nextLimit = '005985'
          else if (thisPageId == '006000') nextLimit = '006001'

          //A6 CHARACTER SELECTS
          else if ('006021' <= thisPageId  && thisPageId <= '006094') nextLimit = '006095' // Jane+Jake
          else if ('006369' <= thisPageId  && thisPageId <= '006468') nextLimit = '006469' // Roxy+Dirk

          //A6A5A1x2 COMBO
          else if ('007688' <= thisPageId && thisPageId <='007825') {
            //Sets the next page an extra step ahead to account for the x2 shittery
            let isLeftPage = !(thisPageId % 2)
            let page = this.$archive.mspa.story[thisPageId]
            let nextPageOver = this.$archive.mspa.story[page.next[0]].next[0]
            let nextPageId 
            if (isLeftPage) {
              nextPageId = this.$archive.mspa.story[nextPageOver].next[0]
            }
            else {
              nextPageId = nextPageOver
            }
            nextLimit = nextPageId
          }

          //JOHN CURSOR
          else if (thisPageId == '008105') nextLimit = '008106'

          //HOMOSUCK PIANO
          else if (thisPageId == '008143') nextLimit = '008144'

          //A6A6I1 GLITCHED CHARACTER SELECTS
          else if (thisPageId == '008282') nextLimit = '008283'
          else if (thisPageId == '008297') nextLimit = '008298'
          else if (thisPageId == '008301') nextLimit = '008302'
          else if (thisPageId == '008305') nextLimit = '008306'
          else if (thisPageId == '008316') nextLimit = '008317'

          //TEREZI RETCON QUEST
          else if (thisPageId == '009057') nextLimit = '009058'
          else if (thisPageId == '009108') nextLimit = '009109'
          else if (thisPageId == '009134') nextLimit = '009135'
          else if (thisPageId == '009149') nextLimit = '009150'
          else if (thisPageId == '009187') nextLimit = '009188'
          else if (thisPageId == '009203') nextLimit = '009204'
          else if (thisPageId == '009221') nextLimit = '009222'
          else if (thisPageId == '009262') nextLimit = '009263'
            
          //CREDITS
          else if (thisPageId == '010029') nextLimit = '010030'
          else if (thisPageId == '010030') this.$localData.root.NEW_READER_CLEAR()

          //IF NEXT PAGE ID IS LARGER THAN WHAT WE STARTED WITH, JUST USE THAT
          //On normal pages, always pick the lowest next-pageId available. The higher one is a Terezi password 100% of the time
          else nextLimit = [...this.$archive.mspa.story[thisPageId].next].sort()[0]
        }
        //Safeguard to catch an unset nextLimit
        if (isSetupMode || !nextLimit) nextLimit = thisPageId

        if (thisPageId == '010030') {
          this.$root.$children[0].$refs.notifications.allowEndOfHomestuck()
        }
        else {
          let resultCurrent = (forceOverride || !this.$localData.settings.newReader.current || this.$localData.settings.newReader.current < thisPageId) ? thisPageId : false
          let resultLimit = (forceOverride || !this.$localData.settings.newReader.limit || this.$localData.settings.newReader.limit < nextLimit) ? nextLimit :  false

          //slap some retcons in there as well cause it's not like this function was long enough already
          if (resultCurrent) {
            this.$localData.settings.retcon1 = resultCurrent >= '007999'
            this.$localData.settings.retcon2 = resultCurrent >= '008053'
            this.$localData.settings.retcon3 = resultCurrent >= '008317'
            this.$localData.settings.retcon4 = resultCurrent >= '008991'
            this.$localData.settings.retcon5 = resultCurrent >= '009026'
            this.$localData.settings.retcon6 = resultCurrent >= '009057'
          }
          
          if (resultCurrent || resultLimit) {
            this.$localData.root.NEW_READER_SET(resultCurrent, resultLimit)
            if (!isSetupMode) this.$popNotifFromPageId(resultCurrent)
          }
        }
      }
      else console.warn("Invalid page ID, not setting")
    },
    $popNotif(id) {
      this.$root.$children[0].$refs.notifications.queueNotif(id)
    },
    $popNotifFromPageId(pageId) {
      this.$root.$children[0].$refs.notifications.queueFromPageId(pageId)
    },
    $pageIsSpoiler(page, useLimit = false) {
      //The new-reader setting is split into two values: "current", and "limit"
      //"current" is the highest page the reader has actually visited. By setting "useLimit" to false, you can use this function to only display content up to a point the reader has seen.
      //"limit" is the highest page the reader is *allowed* to visit. This is generally set one page ahead of the current page, but in some circumstances like character select screens, it can go much further.
      let parsedLimit = parseInt(this.$localData.settings.newReader[useLimit ? 'limit' : 'current'])
      let parsedPage = parseInt(page)
      return this.$isNewReader && (
        (page in this.$archive.mspa.story && (
          (!!parsedPage && parsedLimit < parsedPage) ||
          (page == 'pony' && parsedLimit < (useLimit ? 2839 : 2838)) ||
          (page == 'darkcage' && parsedLimit < (useLimit ? 6274 : 6273)) ||
          (page == 'pony2' && parsedLimit < (useLimit ? 6518 : 6517)) ||
          (page == 'darkcage2' && parsedLimit < (useLimit ? 6928 : 6927))
        )) || page.includes('Hiveswap Friendsim: ') || page.includes('Pesterquest: ')
      )
    },
    $trackIsSpoiler(ref) {
      if (this.$isNewReader && ref in this.$archive.music.tracks) {
        let track = this.$archive.music.tracks[ref]
        //Try to find a single linked page or album that isn't a spoiler. If we can't, block it.
        //if it's referenced by an unreleased track, that's not good enough. it has to be reference that unreleased track *itself* 
        //From the unreleased track's perspective: if it's referenced by a known track, it's ok. Whether or not it references a known track shouldn't affect it.
        
        return !(
          (track.pages && track.pages.find(page => !this.$pageIsSpoiler(page))) ||
          (track.album && track.album.find(album => {
            if (album == 'unreleased-tracks' && track.referencedBy) {
              return track.referencedBy.find(track => !this.$trackIsSpoiler(track))
            }
            else return !this.$albumIsSpoiler(album)
          }))
        )
      }
      else return false
    },
    $albumIsSpoiler(ref) {
      if (this.$isNewReader && ref in this.$archive.music.albums && this.$archive.music.albums[ref].date) {
        //It's a spoiler if it belongs to an album with a more recent timestamp than the current page
        let date

        if (ref == 'homestuck-vol-1') date = this.$archive.mspa.story['002340'].timestamp //During third Rose GameFAQs, after Nanna expodump
        else if (ref == 'homestuck-vol-5') date = this.$archive.mspa.story['003841'].timestamp //Curtains after [S] Descend
        else if (ref == 'homestuck-vol-6') date = this.$archive.mspa.story['005127'].timestamp //During LE/Recap 3 Huss interruption
        else if (ref == 'song-of-skaia') date = this.$archive.mspa.story['006291'].timestamp //Immediately after EOA6I1
        else if (ref == 'colours-and-mayhem-universe-b') date = this.$archive.mspa.story['006716'].timestamp //Immediately after DOTA, before EOY3 shown
        else if (ref == 'homestuck-vol-9') date = this.$archive.mspa.story['006928'].timestamp //After Terry: FF to Liv, before cherub chess
        else if (ref == 'symphony-impossible-to-play') date = this.$archive.mspa.story['007162'].timestamp //Just after Caliborn: Enter, before openbound 1
        else if (ref == 'one-year-older') date = this.$archive.mspa.story['007162'].timestamp //Just after Caliborn: Enter, before openbound 1
        else if (ref == 'cherubim') date = this.$archive.mspa.story['007882'].timestamp //After Interfishin, right when Caliborn/Calliope expodump begins

        else date = new Date(this.$archive.music.albums[ref].date).getTime()/1000
        console.log(ref, this.$archive.mspa.story['006716'].timestamp)
        return date > this.$archive.mspa.story[this.$localData.settings.newReader.current].timestamp
      }
      else return false
    }
  } 
})

window.vm = new Vue({
  data(){
    return {
      theme: 'default'
    }
  },
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
