<template>
<transition name="bookmarks">
	<div class="bookmarkShadow" v-if="isActive" tabindex="-1" @keydown.esc="close()">
		<div class="bookmarkWindow">
			<div class="header">
				<div>Game data</div>
				<div class="buttons">
					<button class="systemButton newSave" @click="newSave()"><span>＋</span></button>
					<button class="systemButton close" @click="close()"><span>✕</span></button>
				</div>
			</div>
			<div class="bookmarks">
				<div class="dragBookmark" ref="dragBookmark" tabindex="-1" v-show="showDragBookmark" >
					<a class="link">
						<span />
					</a>
					<div class="options">
						<span />
						<button class="systemButton editButton" ><fa-icon icon="pen" ></fa-icon></button>
					</div>
				</div>
				<transition-group tag="div" class="bookmarkList" name="bookmark-list" ref="bookmarks">
					<div v-for="(key, i) in $localData.saveData.saveList" class="bookmark" @focusout="(e)=>{blurBookmark(e, key)}" @mousedown.left="(e)=>{initDrag(e, key)}" tabindex="-1" :key="key" :ref="key">

						<div class="linkMode" :data-key="key" v-if="editKey != key"> 
							<a class="link" :href="$localData.saveData.saves[key].url" :title="`${unsanitizeHtml($localData.saveData.saves[key].name)}\n${$localData.saveData.saves[key].url}`">
								<span v-text="unsanitizeHtml($localData.saveData.saves[key].name)" />
							</a>
							<div class="options">
								<span class="bookmarkUrlDisplay" :href="$localData.saveData.saves[key].url" v-text="$localData.saveData.saves[key].url" />
								<button class="systemButton editButton" @click.capture.prevent="startEditSave(key)"><fa-icon icon="pen" ></fa-icon></button>
							</div>
						</div>
						
						<div class="editMode" v-else>
							<div class="inputs" @keydown.enter="editSave(key)" @keydown.esc.stop="(e)=>{blurBookmark(e, key)}">
								<input class="nameInput" spellcheck="false" v-model="nameField"/>
								<input class="urlInput" spellcheck="false" v-model="urlField"/>
							</div>
							<div class="buttons">
								<button class="systemButton" @click="deleteSave(key)"><fa-icon icon="trash"></fa-icon></button>
								<button class="systemButton" @click="editSave(key)"><fa-icon icon="save"></fa-icon></button>
							</div>
						</div>

					</div>
				</transition-group>
			</div>
		</div>
	</div>
</transition>
</template>

<script>

export default {
  name: 'bookmarks',
  props: [
		'tab'
	],
  data: function() {
    return {
			isActive: false,

			editKey: undefined,
			nameField: '',
			urlField: '',

			cursorYPrev: 0,
			threshold: undefined,
			thresholdDirection: undefined,
			clickAnchor: undefined,
			dragTarget: undefined,
			dragKey: undefined,
			showDragBookmark: false
    }
  },
  computed: {
  },
  methods:{
		open() {
			this.isActive = true
		},
		close(){
			this.isActive = false
		},
		toggle(){
      if (this.isActive) this.close()
      else this.open()
		},
	  sanitizeHtml(str) {
			return str
			.replace(/&/g, "&amp;")
			.replace(/"/g, "&quot;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
	  },
	  unsanitizeHtml(str) {
			return str
			.replace(/&quot;/g, "\"")
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">")
			.replace(/&amp;/g, "&")
	  },
	  newSave(){
			let key = this.$localData.root.SAVES_NEW(this.tab.title, this.tab.url)
			this.startEditSave(key)
	  },
	  deleteSave(key){
			this.editKey = undefined
			this.$localData.root.SAVES_DELETE(key)
	  },
	  startEditSave(key) {
		  this.editKey = key
		  this.nameField = this.unsanitizeHtml(this.$localData.saveData.saves[key].name)
			this.urlField = this.$localData.saveData.saves[key].url
		  this.$nextTick(()=>{
				if (this.$refs[key][0].querySelector('.nameInput')) this.$refs[key][0].querySelector('.nameInput').select()
				else console.warn(`${this.$refs[key][0]} isn't in edit mode`)
		  })
	  },
	  editSave(key){
		  let name = this.sanitizeHtml(this.nameField)
		  this.$localData.root.SAVES_EDIT(key, name, this.urlField)
		  this.editKey = undefined
	  },
	  cancelEditSave(key) {
		  this.editKey = undefined
	  },
	  blurBookmark(event, key) {
		  if (key == this.editKey && this.$refs[key][0]) {
				if (document.getElementById('contextMenu').contains(event.relatedTarget)) {
					this.$root.$children[0].$refs.contextMenu.lendFocus(event.target.tagName =='INPUT' ? event.target :this.$refs[key][0] )
				}
				else if (!this.$refs[key][0].contains(event.relatedTarget)) {
					this.cancelEditSave(this.editKey)
				}
			}
		},

    constrainYToBookmarkArea(bookmarkY) {
			let bookmarksOffsetTop = this.$refs.bookmarks.$el.getBoundingClientRect().top

      if (bookmarkY <= 0) {
        bookmarkY = 0
        this.threshold = bookmarksOffsetTop + this.clickAnchor
				this.thresholdDirection = 'top'
			}
			
      if (bookmarkY + this.$refs.dragBookmark.clientHeight >= this.$refs.bookmarks.$el.clientHeight - 1) {
        bookmarkY = (this.$refs.bookmarks.$el.clientHeight - 1) - this.$refs.dragBookmark.clientHeight
        this.threshold = bookmarksOffsetTop + bookmarkY + this.clickAnchor
        this.thresholdDirection = 'bottom'
      }
      return bookmarkY
    },

    initDrag(e, key) {
			e = e || window.event

      if (e.target.classList.contains('editButton') || e.target.closest('.editMode') || this.$localData.saveData.length <= 1) return

      this.clickAnchor = e.clientY
			this.dragTarget = this.$refs[key][0].querySelector('.linkMode')
			this.dragKey = key

      document.onmousemove = this.startDragBookmark
      document.onmouseup = this.closeDragElement
    },

    startDragBookmark(e) {
      e = e || window.event
			e.preventDefault()
			
      if (this.$localData.saveData.saveList.length > 1 && Math.abs(e.clientY - this.clickAnchor) > 5) {

        let snapDistance = e.clientY - this.clickAnchor
        this.clickAnchor -= this.dragTarget.getBoundingClientRect().top

        this.dragTarget.style.visibility = "hidden"

        this.$refs.dragBookmark.querySelector(".link span").innerHTML = this.dragTarget.querySelector(".link span").innerHTML
        this.$refs.dragBookmark.querySelector(".options span").innerHTML = this.dragTarget.querySelector(".options span").innerHTML

        this.showDragBookmark = true
				this.$refs.dragBookmark.style.height = this.dragTarget.clientHeight + 'px'
				this.$refs.dragBookmark.style.top = this.constrainYToBookmarkArea(this.dragTarget.closest('.bookmark').offsetTop + snapDistance) + "px"
			
        this.cursorYPrev = e.clientY
				document.onmousemove = this.elementDrag
				
				this.$nextTick(()=>{
          this.$refs.dragBookmark.focus()
          this.$refs.dragBookmark.onblur = this.closeDragElement
        })
      }
    },

    elementDrag(e) {
      e = e || window.event
      e.preventDefault()
			let bookmarkY, dragPos
      if (this.thresholdDirection){
        if ((this.thresholdDirection === 'top' && e.clientY > this.threshold) || (this.thresholdDirection === 'bottom' && e.clientY < this.threshold)){
					this.$refs.dragBookmark.style.top = (this.$refs.dragBookmark.offsetTop + e.clientY - this.threshold) + "px"
          this.thresholdDirection = undefined
        }
      }
      else {
				dragPos = this.cursorYPrev - e.clientY
				bookmarkY = this.constrainYToBookmarkArea(this.$refs.dragBookmark.offsetTop - dragPos)
				this.$refs.dragBookmark.style.top = bookmarkY + "px"
      }  
      
			this.cursorYPrev = e.clientY

			let yCenter = this.$refs.dragBookmark.offsetTop + ((this.$refs.dragBookmark.clientHeight) / 2)
			let targetTop = this.dragTarget.closest('.bookmark').offsetTop - 1
			let targetBottom = targetTop + this.dragTarget.closest('.bookmark').clientHeight + 1

			let direction = yCenter < targetTop ? -1 : yCenter > targetBottom ? 1 : 0

			let hoverKey = this.$localData.saveData.saveList[this.$localData.saveData.saveList.indexOf(this.dragKey) + direction]

      if (this.dragKey != hoverKey) {
				this.$localData.root.SAVES_SWAP(this.dragKey, hoverKey)
      }

    },

    closeDragElement() {
      document.onmouseup = null
			document.onmousemove = null
			this.$refs.dragBookmark.onblur = null

      if (this.dragTarget) this.dragTarget.style.visibility = "visible"
      this.showDragBookmark = false

      this.clickAnchor = this.thresholdDirection = this.dragTarget = this.dragKey = undefined
    }
	},
	watch: {
		'tab.url'() {
			this.close()
		}
	}  
}
</script>

<style lang="scss" scoped>
	.bookmarkShadow {
		z-index: 2;
		user-select: none;
		position: fixed;
		width: 350px;
		height: calc(100% - var(--headerHeight));
		overflow-y: hidden;
		overflow-x: hidden;
		pointer-events: none;

		color: var(--font-header);

		::-webkit-scrollbar {
		width: 6px;
		}
		::-webkit-scrollbar-track {
			background: var(--saves-border);
		}

		::-webkit-scrollbar-thumb {
			background: var(--saves-scroll);
			&:hover {
				background: var(--saves-scrollHover);
			}
		}

		.bookmarkWindow {
			width: 330px;
			height: 100%;
			pointer-events: auto;
			background: var(--saves-bg);
			box-shadow: -5px 0px 10px 7px rgba(0, 0, 0, 0.50);

			display: flex;
			justify-content: flex-start;
			flex-direction: column;
			
			.header {
				height: 30px;
				padding-left: 10px;
				background: var(--saves-tab);
				border-bottom: 1px solid var(--saves-border);

				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 20px;

				.buttons {
					display: flex;
					.systemButton {
						color: var(--font-header);
					}
					.newSave {
						display: flex;
						justify-content: center;
						align-items: center;
						width: 30px;
						height: 30px; 
						span {
							font-size: 28px;
							line-height: 20px;
						}
					}
					.close {
						width: 30px;
						height: 30px;
						span {
							font-size: 24px;
							line-height: 20px;
						}
					}
				}
			}
			.dragBookmark {
				position: absolute;
				width: 100%;
				height: 50px;
				background: var(--saves-tabHover);
				z-index: 1;
				cursor: grabbing;
				pointer-events: auto;
			}
			.bookmarks {
				position: relative;
				height: calc(100% - 30px);
				overflow-y: auto;
				overflow-x: hidden;
				width: 330px;

				.bookmarkList {
					width: 100%;
				}
				.bookmark {
					border-bottom: 1px solid var(--saves-border);
					position: relative;
					.linkMode:hover {
						background: var(--saves-tabHover);
						transition: background-color 0.1s;
						.systemButton {
							transform: translateX(0px);
							transition: transform 0.05s linear;
							
							&:hover{
								cursor: pointer;
								background: var(--header-buttonClickState) !important;
							}
						}
					}
					.linkMode:active {
						// background: var(--header-bg);
						transition: background-color 0.1s;
					}
				}
			}
			.linkMode, .dragBookmark {
				&:not(.dragBookmark) {
					background: var(--saves-tab);
				}
				.link {
					padding: 7px 30px 0 7px;
					display: block;
					height: 43px;
					line-height: 16px;
					font-size: 18px;
					text-decoration: none;
					color: var(--font-header);
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;

					&:after {
						display: none;
					}

					span {
						font-size: 14px;
						&:after {
							display: none;
						}
					}
					
				}

				.options {
					position: absolute;
					pointer-events: none;
					bottom: 0;
					left: 7px;
					width: calc(100% - 7px);
					display: flex;
					justify-content: space-between;
					line-height: 16px;
					font-size: 16px;
					color: var(--page-nav-meta);

					span {
						position: relative;
						top: 27px;
						left: 1px;
						text-overflow: ellipsis;
						white-space: nowrap;
						overflow: hidden;
						font-size: 12px;
						max-width: 285px;
						height: 15px;
					}
					.systemButton {
						color: var(--font-default);
						pointer-events: auto;
						font-size: 16px;
						width: 25px;
						height: 50px;
						background-color: var(--header-buttonHoverState);
						transform: translateX(30px);
						transition: transform 0.03s linear;
					}
				}
			}
			.editMode {
				background-color: var(--saves-tabHover);

				display: flex;

				.inputs {
					padding: 6px 5px;
				}
				input {
					color: var(--font-default);
					background: var(--header-buttonClickState);
					border: solid 1px var(--saves-border);
					font-family: 'Courier New', Courier, monospace;
					width: 100%;

					&.nameInput {
						font-weight: bolder;
						font-size: 14px;
					}
					&.urlInput {
						font-size: 12px;
					}
				}
				.buttons {
					display: flex;
					flex-direction: column;

					.systemButton {
						color: var(--font-default);
						margin-left: 5px;
						width: 25px;
						height: 25px;
					}
				}

			}
		}
	}

	.bookmarks-enter-active, .bookmarks-leave-active {
		transition: all .1s;
	}
	.bookmarks-enter, .bookmarks-leave-to {
		transform: translateX(-100%);
	}

	.bookmark-list-enter, .bookmark-list-leave-to {
		transform: translateX(-100%);
	}
	.bookmark-list-enter-active, .bookmark-list-leave-active {
		transition: transform 0.1s;
	}
	.bookmark-list-move {
		transition: transform 0.1s;
	}

	svg {
		pointer-events: none;
	}

</style>

