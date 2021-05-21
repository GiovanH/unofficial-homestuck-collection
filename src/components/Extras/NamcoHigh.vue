<template>
  <div class="gameBody" v-if="this.routeParams.play == 'play'">
    <iframe class="gameFrame" ref="game" :src="frameSrc" :width="`${gameWidth}px`" :height="`${gameHeight}px`" @load="initLocalStorage"/>
  </div>
  <div class="pageBody" v-else>
    <div class="header">
      <NavBanner />
    </div>
		<div class="content">
			<div class="main_visual">
				<h2 class="text_lead"><Media alt="FROM HOMESTUCK CREATOR ANDREW HUSSIE" url="/archive/namcohigh/text_lead.png" width="748" height="24" /></h2>
				<div class="namco_high"><Media alt="NAMCO HIGH" url="/archive/namcohigh/logo_namcohigh_tm.png" width="259" height="156" /></div>
			</div>
			<div class="png_bg reservation_area">
				<div>
					<h3><Media alt="PLAY NAMCO HIGH NOW" url="/archive/namcohigh/text_namcohigh_01.png" width="288" height="19" /></h3>
					<p>Namco High now available to play! All you need is a modern HTML5-capable web browser and a lot of free time. This is the browser-based video game character high school dating sim you have always been waiting for!</p>
				</div>
				<a href="/namcohigh/play"><Media alt="play now" class="btn btn_reservation" url="/archive/namcohigh/btn_play.png" width="291" /></a>
			</div>
			<a class="overview_area_anchor"></a>
			<div class="png_bg overview_area">
				<div>
					<h3><Media alt="Overview" url="/archive/namcohigh/text_overview_01.png" width="320" height="55" /></h3>
					<p>From Homestuck creator Andrew Hussie and universally-acclaimed video game developer NAMCO BANDAI Games comes an all new gaming experience: NAMCO HIGH! As a cousin to the Prince from Katamari Damacy, you will meet total strangers with whom you have nothing in common, but before the school year is over you'll break rules, bare your soul, and touch each other in ways you never dreamed.</p>
				</div>
			</div>
			<a class="recommend_area_anchor"></a>
			<div class="png_bg recommend_area">
				<h3>
          <Media alt="Students" url="/archive/namcohigh/text_students_01.png" width="296" height="57" />
        </h3>
				<div class="bx-wrapper" style="width:1000px; position:relative;">
          <div class="bx-window" style="position:relative; overflow:hidden; width:1000px;">
            <ul class="multiple clearfix slides" :style="`width: 999999px; position: relative; left: ${studentIndex * -1000}px;`" ref="students">
              <li class="slide" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students students_19">
                  <div class="desc_students">
                    <h4>Davesprite</h4>
                    <p class="desc">One of those weird exchange students who is absolutely the coolest kid-from-a-failed-timeline-who-is-now-a-game-guide you know.</p>
                    <p class="from">From: Homestuck</p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students students_01">
                  <div class="desc_students">
                    <h4>Cousin - YOU</h4>
                    <p class="desc">A new student at Namco High, you've managed to get yourself into trouble rather quickly… hopefully detention won't be as harrowing as the legends say. Either way, you're finding that nothing at this school rolls that easily.</p>
                    <p class="from">From: Katamari series</p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students students_02">
                  <div class="desc_students">
                    <h4>Galaga</h4>
                    <p class="desc">THE GALAGA SHIP IS THE MOST ALLURING, CAPTIVATING, AND ENCHANTING THING IN THE UNIVERSE.</p>
                    <p class="from">From: Galaga</p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students students_03">
                  <div class="desc_students">
                    <h4>Lolo</h4>
                    <p class="desc">It is so hard to get a read on this girl; does she care about anything? What could possibly have happened to her to make her so distant...?</p>
                    <p class="from">From: Klonoa</p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students students_04">
                  <div class="desc_students">
                    <h4>Valkyrie</h4>
                    <p class="desc">A fun-loving, manic pixel dream girl if you ever saw one, she's a true warrior who’s always looking for the next bit of excitement.</p>
                    <p class="from">From: Valkyrie</p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students students_05">
                  <div class="desc_students">
                    <h4>Anti-Bravoman</h4>
                    <p class="desc">A mysterious new student at Namco High. He seems to be hiding a dark past, if the rumors going around school are any indication...</p>
                    <p class="from">From: Bravoman</p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students students_06">
                  <div class="desc_students">
                    <h4>Meowkie</h4>
                    <p class="desc">A diligent, by-the-books student, for some reason she just keeps getting into trouble… but what do you expect from someone whose parents came from "that" part of town?</p>
                    <p class="from">From: Mappy</p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students students_07">
                  <div class="desc_students">
                    <h4>Terezi Pyrope</h4>
                    <p class="desc">One of those weird exchange students who seems to have a real obsession with justice.</p>
                    <p class="from">From: Homestuck</p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students students_08">
                  <div class="desc_students">
                    <h4>Donko</h4>
                    <p class="desc">Like, totally the most popular person at school, no one would dare say a mean word about them, gosh.</p>
                    <p class="from">From: Taiko Drum Master</p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students students_09">
                  <div class="desc_students">
                    <h4>Albatross</h4>
                    <p class="desc">AL. B. TROSS is supposedly just another ordinary high school student but why does it seem like he has an ulterior motive?</p>
                    <p class="from">From: Rolling Thunder</p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students students_10">
                  <div class="desc_students">
                    <h4>Nidia</h4>
                    <p class="desc">A strong willed warrior who is seemingly bound by the will of destiny...</p>
                    <p class="from">From: Dragon Spirit</p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students students_11">
                  <div class="desc_students">
                    <h4>Mr. Driller</h4>
                    <p class="desc">A guy who seems to be in shadow of the his dad - at school and in life. You hear he wants to dig out a name for himself.</p>
                    <p class="from">From: Mr. Driller</p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students students_12">
                  <div class="desc_students">
                    <h4>Blue Max</h4>
                    <p class="desc">A military history nerd that's supposedly got plans to finally stand up to the bullies.</p>
                    <p class="from">From: Sky Kid</p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students students_13">
                  <div class="desc_students">
                    <h4>Hiromi</h4>
                    <p class="desc">They say, "It's a town full of losers, and I'm pulling out of here to win."</p>
                    <p class="from">From: Burning Force</p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students students_14">
                  <div class="desc_students">
                    <h4>Akiho Matsuo (Amazona)</h4>
                    <p class="desc">What is a top of the class student like her doing getting mixed up with a crowd like this?</p>
                    <p class="from">From: Wonder Momo</p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students students_15">
                  <div class="desc_students">
                    <h4>Taira</h4>
                    <p class="desc">An undead samurai warrior who captain's the school wrestleball team. Seems scary but maybe there's something more beneath his rough exterior?</p>
                    <p class="from">From: Genpei Tomaden</p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students students_16">
                  <div class="desc_students">
                    <h4>Jane Crocker</h4>
                    <p class="desc">One of those weird exchange students who's always out to get the scoop.</p>
                    <p class="from">From: Homestuck</p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students students_17">
                  <div class="desc_students">
                    <h4>Tomari</h4>
                    <p class="desc">A top of the line engineer and roboticist who takes one too many liberties with school property...</p>
                    <p class="from">From: Ordyne</p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students students_18">
                  <div class="desc_students">
                    <h4>Richard Miller</h4>
                    <p class="desc">Where did this guy come from so fast and why does he seem to have information on everyone?!</p>
                    <p class="from">From: Time Crisis</p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students students_19">
                  <div class="desc_students">
                    <h4>Davesprite</h4>
                    <p class="desc">One of those weird exchange students who is absolutely the coolest kid-from-a-failed-timeline-who-is-now-a-game-guide you know.</p>
                    <p class="from">From: Homestuck</p>
                  </div>
                </div>
              </li>
              <li class="slide" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students students_01">
                  <div class="desc_students">
                    <h4>Cousin - YOU</h4>
                    <p class="desc">A new student at Namco High, you've managed to get yourself into trouble rather quickly… hopefully detention won't be as harrowing as the legends say. Either way, you're finding that nothing at this school rolls that easily.</p>
                    <p class="from">From: Katamari series</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="bx-pager">
            <div v-for="i in 19" @click="slidesJump(i, true)" :class="[`pager-link`, `pager-${i}`, `${studentIndex == i ? 'pager-active' : undefined}`]"/>
          </div>
          <div @click="slidesLeft(true)" class="bx-prev"><Media class="btn" url="/archive/namcohigh/recommend_left_btn.png" alt="" width="52" height="51" /></div>
          <div @click="slidesRight(true)" class="bx-next"><Media class="btn" url="/archive/namcohigh/recommend_right_btn.png" alt="" width="52" height="51" /></div>
        </div>
      </div>
			<a class="artist_area_anchor"></a>
			<div class="png_bg artist_area_slide">
				<h3><Media alt="The Team" url="/archive/namcohigh/text_artist_01.png" width="314" height="57" /></h3>
        <div class="bx-wrapper" style="width:1000px; position:relative;">
          <div class="bx-window" style="position:relative; overflow:hidden; width:1000px;">
            <ul class="multiple clearfix slides_03" :style="`width: 999999px; position: relative; left: ${artistIndex * -1000}px;`" ref="artists">
              <li class="slide" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students artist_26">
                  <div class="desc_students">
                    <h4>Der-Shing Helmer - Tomari</h4>
                    <p class="desc">Der-shing works on many things, but mostly they are games, comics and science related. She lives in California in a hole in the ground and uses tiny hairs on her forelegs to sense the vibration of approaching prey. That's when she strikes.<a href="http://www.meekcomic.com/" target="_blank">www.meekcomic.com</a></p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students artist_01">
                  <div class="desc_students">
                    <h4>ANDREW HUSSIE - CREATIVE DIRECTOR</h4>
                    <p class="desc">Andrew Hussie is the author and illustrator of Homestuck on <a href="/" target="_blank">mspaintadventures.com</a>, a webcomic epic told in various media styles including text, illustrations, animations, music and video games. Nearing 7,000 pages of near-daily updates since April 2009, Homestuck has garnered a fandom of passionate readers from all over the world.</p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students artist_02">
                  <div class="desc_students">
                    <h4>ANANTH PANAGARIYA – HEAD WRITER</h4>
                    <p class="desc">Ananth Panagariya is a writer and designer who has worked with Oni Press, BOOM!, First Second, and Dark Horse, and he is currently co-writing an Adventure Time miniseries called “Candy Capers.” He posts comics twice a week to johnnywander.com (currently serializing the graphic novel Lucky Penny). He's probably eating ice cream right now.</p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students artist_03">
                  <div class="desc_students">
                    <h4>MAGNOLIA PORTER - WRITER</h4>
                    <p class="desc">Magnolia Porter is a writer and cartoonist living in Brooklyn. She likes weird birds and movies about old people. She is drawing a comic about kids who have scary pet monsters (<a href="http://www.monster-pulse.com/" target="_blank">www.monster-pulse.com</a>), and she often wishes she had a scary pet monster herself.</p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students artist_04">
                  <div class="desc_students">
                    <h4>BRIAN CLEVINGER - WRITER</h4>
                    <p class="desc">Brian Clevinger writes comics in Richmond, Virginia.</p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students artist_05">
                  <div class="desc_students">
                    <h4>CAT SZE - UI DESIGN</h4>
                    <p class="desc">Otherwise known as akanekun, Cat also enjoys game design, drawing, needle felting, story creation, editing and sewing on top of UI design. She can be found in her natural habitat in the mountains of Los Angeles dabbling away at something new every day. <a href="http://games.scarybunny.net/" target="_blank">http://games.scarybunny.net</a></p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students artist_06">
                  <div class="desc_students">
                    <h4>LINDSAY WOODS - BACKGROUNDS</h4>
                    <p class="desc">Lindsay is an animator and illustrator in New York City, and is currently working as the Art Director for Date Nighto. In-between playing and making visual novels, she draws Paracite Knights (<a href="http://paraciteknights.com/" target="_blank">http://paraciteknights.com/</a>) and tweets too much.</p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students artist_07">
                  <div class="desc_students">
                    <h4>YUKO OTA - COUSIN, TAIRA</h4>
                    <p class="desc">Yuko Ota is a cartoonist, designer, and illustrator based out of Brooklyn, NY. In addition to her online comic Johnny Wander (<a href="http://www.johnnywander.com/" target="_blank">johnnywander.com</a>), she has worked with companies such as Dark Horse Inc., Oni Press, Lerner Publishing, and BOOM!, and is currently co-writing the Adventure Time comic series “Candy Capers.” Yuko has two obnoxious cats and drinks too much coffee.</p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students artist_08">
                  <div class="desc_students">
                    <h4>RICH STEVENS – GALAGA</h4>
                    <p class="desc">IS A ROBOT</p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students artist_09">
                  <div class="desc_students">
                    <h4>J.N. WIEDLE – LOLO &amp; JANE CROCKER</h4>
                    <p class="desc">J.N. Wiedle is an actual skeleton in real life, but don’t worry. They wear a human suit for the personal comfort of those around them. They also write and draw a comic about existential skeletons, which is not as lame as it sounds… probably. <a href="http://helvetica.jnwiedle.com/" target="_blank">http://helvetica.jnwiedle.com</a></p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students artist_10">
                  <div class="desc_students">
                    <h4>ASHLEY DAVIS - VALKYRIE</h4>
                    <p class="desc">Ashley Davis is an illustrator who specializes in the cute and colorful. She draws and writes the Legend of the Valkyrie webcomic whenever she's not playing video games! She currently lives in Dallas, Texas with her husband and pet bird. <a href="http://oddlookingbird.com/" target="_blank">http://oddlookingbird.com/</a></p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students artist_11">
                  <div class="desc_students">
                    <h4>GENEVA HODGSON - MEOWKIE</h4>
                    <p class="desc">Geneva is a cartoonist from the midwest living in Los Angeles. She works in the animation industry and also makes comics. She loves yelling and bad cartoons. <a href="http://cartoonfuntime.tumblr.com/" target="_blank">http://cartoonfuntime.tumblr.com/</a></p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students artist_12">
                  <div class="desc_students">
                    <h4>DAX GORDINE - ANTI-BRAVOMAN</h4>
                    <p class="desc">Dax "D-Gee" Gordine is a cartoonist and animator who lives way up north in St. Catharines, Canada. Currently, he works for ShiftyLook as the artist for their longest-running webcomic, Bravoman. He also serves as the character designer and art supervisor on the Bravoman animated web series. This guy knows his Bravoman! <a href="http://d-gee.deviantart.com/" target="_blank">http://d-gee.deviantart.com</a></p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students artist_13">
                  <div class="desc_students">
                    <h4>Alexandra Douglass - Terezi Pyrope</h4>
                    <p class="desc">Alexandra (Lexxy) Douglass is a level 28 fantasy and sci-fi illustrator who has recently cross-classed into comics. When she's not drawing chain mail and ray guns for games, she's working on her own tale of kids in peril, The Cloud Factory. Lexxy likes to watch anime and play video games in her spare time, and lives wherever someone will tolerate her mess. <a href="http://www.cloudfactorycomics.com/" target="_blank">http://www.cloudfactorycomics.com</a></p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students artist_14">
                  <div class="desc_students">
                    <h4>E.N. - Donko &amp; Davesprite</h4>
                    <p class="desc">Is an art machine.</p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students artist_15">
                  <div class="desc_students">
                    <h4>Tessa Stone - Albatross &amp; Richard Miller</h4>
                    <p class="desc">Exists to draw, write, then draw some more in an attempt to bring forth nuggets of joy. Has drawn for Oni Press (Buzz! with Ananth Panagariya) and dabbles in self publishing. Responds well to cathugs.</p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students artist_16">
                  <div class="desc_students">
                    <h4>Noelle Stevenson - Nidia</h4>
                    <p class="desc">Noelle Stevenson is an illustrator and comic artist, known among internet circles as Gingerhaze! She is the author of NIMONA, a twice-weekly webcomic that can be read at gingerhaze.com/nimona. Or you can find her on Tumblr at gingerhaze.tumblr.com, drawing mostly superheroes in tight pants. <a href="http://gingerhaze.com/" target="_blank">gingerhaze.com</a></p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students artist_17">
                  <div class="desc_students">
                    <h4>Gigi D.G. - Mr. Driller</h4>
                    <p class="desc">Gigi D.G. is a freelance illustrator from Los Angeles, California. Her passions are sweets and cute video games. She spends most of her time writing and illustrating Cucumber Quest, a fun adventure webcomic. <a href="http://cucumber.gigidigi.com/" target="_blank">http://cucumber.gigidigi.com/</a></p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students artist_18">
                  <div class="desc_students">
                    <h4>Audra Furuichi - Blue Max</h4>
                    <p class="desc">Audra Furuichi hails from hot and sunny Honolulu, Hawaii. She draws and co-writes the online comic, nemu*nemu. Aloha! <a href="http://www.nemu-nemu.com/" target="_blank">www.nemu-nemu.com</a></p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students artist_19">
                  <div class="desc_students">
                    <h4>OMOCAT - Hiromi</h4>
                    <p class="desc">OMOCAT is a freelance illustrator, known on the internet for her fanwork of video games and anime that have been featured on over a million blogs all over the world (Thanks Tumblr.) She designs apparel, posters, comic books, pins, and other kick-ass stuff that she sells in her online store; and is currently working on her own original game: OMORIBOY. <a href="http://www.omo-cat.com/" target="_blank">http://www.omo-cat.com/</a></p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students artist_20">
                  <div class="desc_students">
                    <h4>Tyson Hesse - Akiho Matsuo</h4>
                    <p class="desc">Tyson Hesse is an animator/illustrator that has worked on video games like Skullgirls, cartoon shows like Bravest Warriors, and comic books like Archie's Megaman, Dark Horse's Rotten Apple, UbiWorks' Assasin's Creed and more. He draws very accurate self portraits, and runs a webcomic called Boxer Hockey (http://www.boxerhockey.com) that almost updates TOO often. <a href="http://www.boxerhockey.com/" target="_blank">www.boxerhockey.com</a></p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students artist_21">
                  <div class="desc_students">
                    <h4>Conrad Kreyling - Lead Developer</h4>
                    <p class="desc">Conrad Kreyling is founder of Date Nighto (<a href="http://www.datenighto.com/" target="_blank">www.datenighto.com</a>), a company aiming to bring interactive narrative to the web with cutting-edge HTML5 tech. A veteran of Muse Games, he worked on Guns of Icarus Online as a software engineer, and lead the team behind the puzzle-platformer CreaVures. He claims to have once seen a ghost, but is lying.<a href="http://www.datenighto.com/" target="_blank">http://www.datenighto.com</a></p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students artist_22">
                  <div class="desc_students">
                    <h4>Charmwitch - Character Design (Support Characters)</h4>
                    <p class="desc">Although born and raised in Puerto Rico, charmwitch is a 2D artist who currently works for a swanky video game company in Los Angeles. She is also the artist and writer for the webcomic Solstoria (<a href="http://solstoria.net/" target="_blank">http://solstoria.net/</a>) and on her spare time charmwitch can be seen sobbing viciously over fictional characters and their fictional love lives. <a href="http://solstoria.net/" target="_blank">http://solstoria.net/</a></p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students artist_23">
                  <div class="desc_students">
                    <h4>Ryan Francis - Composer</h4>
                    <p class="desc">Ryan A. Francis is a composer and an avid gamer. He recently wrote an orchestral piece about Manhattan's High Line park, and a piece for a string orchestra in Cairo, Egypt. He has also spent too much time of late playing the board game Eclipse. Ryan splits his time between Brooklyn and Portland.</p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students artist_24">
                  <div class="desc_students">
                    <h4>George Rohac - Co-Producer</h4>
                    <p class="desc">George Rohac is a Director of Business Development for What Pumpkin Studios, a workaholic, and is wanted for several (alleged!) infractions of time law he (might!) may have broken to get all his work done..<a href="http://www.whatpumpkin.com/" target="_blank">http://www.whatpumpkin.com</a></p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students artist_25">
                  <div class="desc_students">
                    <h4>Rob Pereyda - Producer</h4>
                    <p class="desc">Rob is the Producer &amp; Editor-in-Chief of ShiftyLook, having launched it at video games giant NAMCO BANDAI Games back in 2012. He produces all of ShiftyLook's animation, music, and games, directs/designs/debugs on the side, and lives in Tokyo, Japan. #ANIMU #YOLO <a href="http://shiftylook.com/" target="_blank">http://shiftylook.com</a></p>
                  </div>
                </div>
              </li>
              <!--==== .set ====-->
              <li class="slide pager" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students artist_26">
                  <div class="desc_students">
                    <h4>Der-Shing Helmer - Tomari</h4>
                    <p class="desc">Der-shing works on many things, but mostly they are games, comics and science related. She lives in California in a hole in the ground and uses tiny hairs on her forelegs to sense the vibration of approaching prey. That's when she strikes.<a href="http://www.meekcomic.com/" target="_blank">www.meekcomic.com</a></p>
                  </div>
                </div>
              </li>
              <li class="slide" style="width: 1000px; float: left; list-style: outside none none;">
                <div class="students artist_01">
                  <div class="desc_students">
                    <h4>ANDREW HUSSIE - CREATIVE DIRECTOR</h4>
                    <p class="desc">Andrew Hussie is the author and illustrator of Homestuck on <a href="http://mspaintadventures.com/" target="_blank">mspaintadventures.com</a>, a webcomic epic told in various media styles including text, illustrations, animations, music and video games. Nearing 7,000 pages of near-daily updates since April 2009, Homestuck has garnered a fandom of passionate readers from all over the world.</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="bx-pager">
            <div v-for="i in 26" @click="slidesJump(i, false)" :class="[`pager-link`, `pager-${i}`, `${artistIndex == i ? 'pager-active' : undefined}`]"/>
          </div>
          <div @click="slidesLeft(false)" class="bx-prev"><Media class="btn" url="/archive/namcohigh/recommend_left_btn.png" alt="" width="52" height="51" /></div>
          <div @click="slidesRight(false)" class="bx-next"><Media class="btn" url="/archive/namcohigh/recommend_right_btn.png" alt="" width="52" height="51" /></div>
        </div>
      </div>
		</div><!--==== /.content ====-->
		<div class="footer">
			<div class="footer_inner_attention">
				<Media class="bng-logo hide-for-mobile png_bg" url="/archive/namcohigh/bng-logo.png" width="58" height="58" />
				<p>NAMCO BANDAI Games Inc. Presents In Association With What Pumpkin Studios</p>
				<p>A ShiftyLook Game Developed by Date Nighto LLC “NAMCO HIGH”</p>
				<p>©NAMCO BANDAI Games Inc.</p>
			</div>
		</div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBanner from '@/components/UIElements/NavBanner.vue'
import Media from '@/components/UIElements/MediaEmbed.vue'
import Resources from "@/resources.js"

export default {
  name: 'NamcoHigh',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, Media
  },
  data: function() {
    return {
      gameWidth: undefined,
      gameHeight: undefined,

      studentIndex: 1,

      artistIndex: 1,
    }
  },
  computed: {
    frameSrc(){
      // We have to do this in MediaEmbed too
      return Resources.resolveURL("assets://archive/namcohigh/game/index2.html")
    }
  },
  methods:{
    // The slideshow functions have two modes of operation: Student, and Artist. The bool tells it which box to affect
    slidesJump(index, isStudent = false) {
      if (isStudent) this.studentIndex = index
      else this.artistIndex = index
    },
    slidesLeft(isStudent = false) {
      if (isStudent) this.studentIndex = this.studentIndex <= 1 ? 19 : this.studentIndex - 1
      else this.artistIndex = this.artistIndex <= 1 ? 26 : this.artistIndex - 1
    },
    slidesRight(isStudent = false) {
      if (isStudent) this.studentIndex = this.studentIndex >= 19 ? 1 : this.studentIndex + 1
      else this.artistIndex = this.artistIndex >= 26 ? 1 : this.artistIndex + 1
    },
    handleResize() {
      let windowWidth = this.$el.offsetWidth
      let windowHeight = this.$el.offsetHeight

      if (windowWidth < (4/3)*windowHeight) {
        this.gameWidth = windowWidth
        this.gameHeight = (3/4)*windowWidth
      }
      else {
        this.gameWidth = (4/3)*windowHeight
        this.gameHeight = windowHeight
      }
    },
    initLocalStorage(e) {
      let payload = []
      Object.keys(localStorage).forEach(key => {
        if (/datenighto/.test(key)) payload.push({key, value: localStorage.getItem(key)})
      })
      this.$refs.game.contentWindow.postMessage({namcoHigh: true, payload}, '*')
    },
    saveGame(e) {
      if (e.data.namcoHigh) {
        if (e.data.method == 'setItem') localStorage.setItem(e.data.params[0], e.data.params[1])
        else if (e.data.method == 'removeItem') localStorage.removeItem(e.data.params[0])
        else if (e.data.method == 'clear') localStorage.clear()
      }
    }
  },
  updated() {
    this.handleResize()
  },
  mounted(){
    window.addEventListener("message", this.saveGame)
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  beforeDestroy() {
    window.removeEventListener('message', this.handleResize)
    window.removeEventListener('resize', this.handleResize)
  }

}
</script>

<style scoped lang="scss">
.pageBody {  
  background: #ccdbed url(assets://archive/namcohigh/bg.jpg) no-repeat fixed center / cover;
  text-align: center;

	font-size: 11.2px;
	color: #575757;
  font-family: Meiryo, Verdana, sans-serif;
	letter-spacing: 1;
  text-align: center;
  font-weight: normal;

  h1, h2, h3, h4, h5, h6,
  div, p, pre, ul, ol, dl, dt, dd,
  th, td, address, form, blockquote {
    line-height: 1.5em;
    margin: 0;
    padding: 0;
    text-align: left;
  }
  
  h1, h2, h3, h4, h5, h6,
  p, pre, ul, ol, dl, th, td, caption,
  address, blockquote {
    font-size: 1.3em;
  }

  h1, h2, h3, h4, h5, h6 {
    line-height: 1.2;
  }

  ul, ol, dl {
    list-style-type: none;
  }
  
  img {
    vertical-align: bottom;
    border: none;
  }

  .clearfix {
    zoom: 1;
    &::after {
      content: ""; 
      display: block; 
      clear: both;
    }
  }
  .navBanner {
    margin: 0 auto;
  }
  .content {
    width: 1072px;
    margin: 0 auto;

    .main_visual {
      width: 1000px;
      margin: 0 0 0 35px;
      text-align: center;

      .text_lead {
        width: 748px;
	      margin: 50px auto 0;
      }
      .namco_high {
        width: 241px;
	      margin: 75px auto 0;
      }
    }

    .reservation_area {
      background: url(assets://archive/namcohigh/reservation_area2.png) center top no-repeat;
      margin: 64px auto 0;
      position: relative;
      width: 1072px;
      height: 267px;
      
      div {
        width: 400px;
        position: absolute;
        top: 61px;
        left: 329px;
      }

      p {
        padding: 17px 30px 0 0;
        line-height: 1.6;
      }

      .btn_reservation {
        width: 291px;
        position: absolute;
        cursor: pointer;
        top: 99px;
        right: 66px;
      }
    }

    .overview_area {
      width: 1072px;
      height: 640px;
      position: relative;
      margin: 20px auto 0;
      background: url(assets://archive/namcohigh/overview_area.png) center top no-repeat;

      div {
        width: 505px;
        position: absolute;
        top: 183px;
        left: 82px;
      }
      p {
        margin: 55px 30px 0 2px;
        color: #fff;
        line-height: 1.6;
      }
    }

    .recommend_area {
      width: 1072px;
      height: 600px;
      position: relative;
      margin: 30px auto 0;
      padding: 30px 0 0 0;
      text-align: center;
      background: url(assets://archive/namcohigh/bg_students.png) center top no-repeat;

      h3{
        width: 296px;
        position: absolute;
        top:100px;
        left:481px;
        z-index: 1;
      }
      .bx-wrapper {
	      margin: 0 0 0 34px;
      }
      .slides {
        transition: left 0.4s;
        
        .slide {
          float: left;
          width: 1000px;
          text-align: center;

          h4 {
            color: #fff;
            font-size:29px;
            font-weight:bold;
          }
          p {
            color: #fff;
            line-height: 1.6;
          }
        }
        div {
          &.students {
            width: 1000px;
            height: 600px;
            position: relative;
            margin:0 auto;
          }
          &.desc_students{
            width: 446px;
            position: absolute;
            top: 157px;
            left: 448px;

            .desc{
              margin: 25px 0 0 1px;
              font-size: 1em;
            }
            .from{
              margin: 8px 0 0 1px;
              font-size: 1em;
            }
          }
          &.students_01 {
            background: url(assets://archive/namcohigh/students/img_students_01.jpg) center top no-repeat;
          }
          &.students_02 {
            background: url(assets://archive/namcohigh/students/img_students_02.jpg) center top no-repeat;
          }
          &.students_03 {
            background: url(assets://archive/namcohigh/students/img_students_03.jpg) center top no-repeat;
          }
          &.students_04 {
            background: url(assets://archive/namcohigh/students/img_students_04.jpg) center top no-repeat;
          }
          &.students_05 {
            background: url(assets://archive/namcohigh/students/img_students_05.jpg) center top no-repeat;
          }
          &.students_06 {
            background: url(assets://archive/namcohigh/students/img_students_06.jpg) center top no-repeat;
          }
          &.students_07 {
            background: url(assets://archive/namcohigh/students/img_students_07.jpg) center top no-repeat;
          }
          &.students_08 {
            background: url(assets://archive/namcohigh/students/img_students_08.jpg) center top no-repeat;
          }
          &.students_09 {
            background: url(assets://archive/namcohigh/students/img_students_09.jpg) center top no-repeat;
          }
          &.students_10 {
            background: url(assets://archive/namcohigh/students/img_students_10.jpg) center top no-repeat;
          }
          &.students_11 {
            background: url(assets://archive/namcohigh/students/img_students_11.jpg) center top no-repeat;
          }
          &.students_12 {
            background: url(assets://archive/namcohigh/students/img_students_12.jpg) center top no-repeat;
          }
          &.students_13 {
            background: url(assets://archive/namcohigh/students/img_students_13.jpg) center top no-repeat;
          }
          &.students_14 {
            background: url(assets://archive/namcohigh/students/img_students_14.jpg) center top no-repeat;
          }
          &.students_15 {
            background: url(assets://archive/namcohigh/students/img_students_15.jpg) center top no-repeat;
          }
          &.students_16 {
            background: url(assets://archive/namcohigh/students/img_students_16.jpg) center top no-repeat;
          }
          &.students_17 {
            background: url(assets://archive/namcohigh/students/img_students_17.jpg) center top no-repeat;
          }
          &.students_18 {
            background: url(assets://archive/namcohigh/students/img_students_18.jpg) center top no-repeat;
          }
          &.students_19 {
            background: url(assets://archive/namcohigh/students/img_students_19.jpg) center top no-repeat;
          }
        }
      }

      div.bx-prev{
        cursor: pointer;
        display: block;
        position: absolute;
        top: 250px;
        left: 14px;
        width: 52px;
        height: 51px;
      }
      div.bx-next{
        cursor: pointer;
        display: block;
        position: absolute;
        top: 250px;
        right: 14px;
        width: 52px;
        height: 51px;
      }
      .bx-pager {
        position: absolute;
        top: 376px;
        left: 450px;

        div {
          cursor: pointer;

          &.pager-link {
            display:block;
            width:55px;
            height:0;
            padding-top:55px;
            background-position:0 0;
            float:left;
            position: relative;
            &:hover{
              background-position:0 -55px;
            }
          }
          &.pager-active {
            background-position:0 -55px;
          }
          &.pager-1 {
            background-image:url(assets://archive/namcohigh/students/pagination_students_01.png);
            margin: 0 10px 0 0;
          }
          &.pager-2 {
            background-image:url(assets://archive/namcohigh/students/pagination_students_02.png);
            margin: 0 10px 0 0;
          }
          &.pager-3 {
            background-image:url(assets://archive/namcohigh/students/pagination_students_03.png);
            margin: 0 10px 0 0;
          }
          &.pager-4 {
            background-image:url(assets://archive/namcohigh/students/pagination_students_04.png);
            margin: 0 10px 0 0;
          }
          &.pager-5 {
            background-image:url(assets://archive/namcohigh/students/pagination_students_05.png);
            margin: 0 10px 0 0;
          }
          &.pager-6 {
            background-image:url(assets://archive/namcohigh/students/pagination_students_06.png);
            margin: 0 10px 0 0;
          }
          &.pager-7 {
            background-image:url(assets://archive/namcohigh/students/pagination_students_07.png);
            margin: 0 10px 0 0;
          }
          &.pager-8 {
            background-image:url(assets://archive/namcohigh/students/pagination_students_08.png);
            margin: 0 10px 0 0;
          }
          &.pager-9 {
            background-image:url(assets://archive/namcohigh/students/pagination_students_09.png);
            margin: 0 10px 0 -34px;
          }
          &.pager-10 {
            background-image:url(assets://archive/namcohigh/students/pagination_students_10.png);
            margin: 0 12px 0 0;
          }
          &.pager-11 {
            background-image:url(assets://archive/namcohigh/students/pagination_students_11.png);
            margin: 0 12px 0 0;
          }
          &.pager-12 {
            background-image:url(assets://archive/namcohigh/students/pagination_students_12.png);
            margin: 0 10px 0 0;
          }
          &.pager-13 {
            background-image:url(assets://archive/namcohigh/students/pagination_students_13.png);
            margin: 0 10px 0 0;
          }
          &.pager-14 {
            background-image:url(assets://archive/namcohigh/students/pagination_students_14.png);
            margin: 0 10px 0 0;
          }
          &.pager-15 {
            background-image:url(assets://archive/namcohigh/students/pagination_students_15.png);
            margin: 0 10px 0 0;
          }
          &.pager-16 {
            background-image:url(assets://archive/namcohigh/students/pagination_students_16.png);
            margin: 0 0 0 0;
          }
          &.pager-17 {
            background-image:url(assets://archive/namcohigh/students/pagination_students_17.png);
            margin: 0 0 0 10px;
          }
          &.pager-18 {
            background-image:url(assets://archive/namcohigh/students/pagination_students_18.png);
            margin: 0 0 0 0;
          }
          &.pager-19 {
            background-image:url(assets://archive/namcohigh/students/pagination_students_19.png);
            margin: 0 0 0 10px;
          }
        }
      }
    }

    .artist_area_slide {
      width: 1072px;
      height: 600px;
      position: relative;
      margin: 30px auto 0;
      padding: 30px 0 0 0;
      text-align: center;
      background: url(assets://archive/namcohigh/bg_students.png) center top no-repeat;

      h3{
        width: 296px;
        position: absolute;
        top:94px;
        left:147px;
        z-index: 1;
      }
      .bx-wrapper {
	      margin: 0 0 0 34px;
      }
      .slides_03 {
        transition: left 0.4s;

        .slide {
          float: left;
          width: 1000px;
          text-align: center;

          h4 {
            color: #fff;
            font-size:29px;
            font-weight:bold;
          }
          p {
            color: #fff;
            line-height: 1.6;
            
            a {
              color: #ffff00;
              text-decoration: none;
              background: url(assets://archive/namcohigh/dot_01.png) left bottom repeat-x;
            }
          }
        }
        div {
          &.students {
            width: 1000px;
            height: 600px;
            position: relative;
            margin:0 auto;
          }
          &.desc_students{
            width: 580px;
            position: absolute;
            top: 167px;
            left: 342px;

            .desc{
              margin: 25px 0 0 1px;
              font-size: 1em;
            }
            .from{
              margin: 8px 0 0 1px;
              font-size: 1em;
            }
          }
          &.artist_01 {
            background: url(assets://archive/namcohigh/artists/img_artist_01.jpg) center top no-repeat;
          }
          &.artist_02 {
            background: url(assets://archive/namcohigh/artists/img_artist_02.jpg) center top no-repeat;
          }
          &.artist_03 {
            background: url(assets://archive/namcohigh/artists/img_artist_03.jpg) center top no-repeat;
          }
          &.artist_04 {
            background: url(assets://archive/namcohigh/artists/img_artist_04.jpg) center top no-repeat;
          }
          &.artist_05 {
            background: url(assets://archive/namcohigh/artists/img_artist_05.jpg) center top no-repeat;
          }
          &.artist_06 {
            background: url(assets://archive/namcohigh/artists/img_artist_06.jpg) center top no-repeat;
          }
          &.artist_07 {
            background: url(assets://archive/namcohigh/artists/img_artist_07.jpg) center top no-repeat;
          }
          &.artist_08 {
            background: url(assets://archive/namcohigh/artists/img_artist_08.jpg) center top no-repeat;
          }
          &.artist_09 {
            background: url(assets://archive/namcohigh/artists/img_artist_09.jpg) center top no-repeat;
          }
          &.artist_10 {
            background: url(assets://archive/namcohigh/artists/img_artist_10.jpg) center top no-repeat;
          }
          &.artist_11 {
            background: url(assets://archive/namcohigh/artists/img_artist_11.jpg) center top no-repeat;
          }
          &.artist_12 {
            background: url(assets://archive/namcohigh/artists/img_artist_12.jpg) center top no-repeat;
          }
          &.artist_13 {
            background: url(assets://archive/namcohigh/artists/img_artist_13.jpg) center top no-repeat;
          }
          &.artist_14 {
            background: url(assets://archive/namcohigh/artists/img_artist_14.jpg) center top no-repeat;
          }
          &.artist_15 {
            background: url(assets://archive/namcohigh/artists/img_artist_15.jpg) center top no-repeat;
          }
          &.artist_16 {
            background: url(assets://archive/namcohigh/artists/img_artist_16.jpg) center top no-repeat;
          }
          &.artist_17 {
            background: url(assets://archive/namcohigh/artists/img_artist_17.jpg) center top no-repeat;
          }
          &.artist_18 {
            background: url(assets://archive/namcohigh/artists/img_artist_18.jpg) center top no-repeat;
          }
          &.artist_19 {
            background: url(assets://archive/namcohigh/artists/img_artist_19.jpg) center top no-repeat;
          }
          &.artist_20 {
            background: url(assets://archive/namcohigh/artists/img_artist_20.jpg) center top no-repeat;
          }
          &.artist_21 {
            background: url(assets://archive/namcohigh/artists/img_artist_21.jpg) center top no-repeat;
          }
          &.artist_22 {
            background: url(assets://archive/namcohigh/artists/img_artist_22.jpg) center top no-repeat;
          }
          &.artist_23 {
            background: url(assets://archive/namcohigh/artists/img_artist_23.jpg) center top no-repeat;
          }
          &.artist_24 {
            background: url(assets://archive/namcohigh/artists/img_artist_24.jpg) center top no-repeat;
          }
          &.artist_25 {
            background: url(assets://archive/namcohigh/artists/img_artist_25.jpg) center top no-repeat;
          }
          &.artist_26 {
            background: url(assets://archive/namcohigh/artists/img_artist_26.jpg) center top no-repeat;
          }
        }
      }

      div.bx-prev{
        cursor: pointer;
        display: block;
        position: absolute;
        top: 250px;
        left: 14px;
        width: 52px;
        height: 51px;
      }
      div.bx-next{
        cursor: pointer;
        display: block;
        position: absolute;
        top: 250px;
        right: 14px;
        width: 52px;
        height: 51px;
      }
      .bx-pager {
        position: absolute;
        width: 880px;
        top: 386px;
        left: 112px;

        ul {
          width: 510px;
        }

        div {
          cursor: pointer;

          &.pager-link {
            display:block;
            width:55px;
            height:0;
            padding-top:55px;
            background-position:0 0;
            float:left;
            position: relative;
            &:hover{
              background-position:0 -55px;
            }
          }
          &.pager-active {
            background-position:0 -110px;
          }
          &.pager-1 {
            background-image:url(assets://archive/namcohigh/artists/pagination_artist_01.png);
            margin: 0 10px 0 32px;
          }
          &.pager-2 {
            background-image:url(assets://archive/namcohigh/artists/pagination_artist_02.png);
            margin: 0 10px 0 0;
          }
          &.pager-3 {
            background-image:url(assets://archive/namcohigh/artists/pagination_artist_03.png);
            margin: 0 10px 0 0;
          }
          &.pager-4 {
            background-image:url(assets://archive/namcohigh/artists/pagination_artist_04.png);
            margin: 0 10px 0 0;
          }
          &.pager-5 {
            background-image:url(assets://archive/namcohigh/artists/pagination_artist_05.png);
            margin: 0 10px 0 0;
          }
          &.pager-6 {
            background-image:url(assets://archive/namcohigh/artists/pagination_artist_06.png);
            margin: 0 10px 0 0;
          }
          &.pager-7 {
            background-image:url(assets://archive/namcohigh/artists/pagination_artist_07.png);
            margin: 0 10px 0 0;
          }
          &.pager-8 {
            background-image:url(assets://archive/namcohigh/artists/pagination_artist_08.png);
            margin: 0 10px 0 0;
          }
          &.pager-9 {
            background-image:url(assets://archive/namcohigh/artists/pagination_artist_09.png);
            margin: 0 10px 0 0;
          }
          &.pager-10 {
            background-image:url(assets://archive/namcohigh/artists/pagination_artist_10.png);
            margin: 0 10px 0 0;
          }
          &.pager-11 {
            background-image:url(assets://archive/namcohigh/artists/pagination_artist_11.png);
            margin: 0 10px 0 0;
          }
          &.pager-12 {
            background-image:url(assets://archive/namcohigh/artists/pagination_artist_12.png);
            margin: 0 70px 0 0;
          }
          &.pager-13 {
            background-image:url(assets://archive/namcohigh/artists/pagination_artist_13.png);
            margin: 0 10px 0 0;
          }
          &.pager-14 {
            background-image:url(assets://archive/namcohigh/artists/pagination_artist_14.png);
            margin: 0 10px 0 0;
          }
          &.pager-15 {
            background-image:url(assets://archive/namcohigh/artists/pagination_artist_15.png);
            margin: 0 10px 0 0;
          }
          &.pager-16 {
            background-image:url(assets://archive/namcohigh/artists/pagination_artist_16.png);
            margin: 0 10px 0 0;
          }
          &.pager-17 {
            background-image:url(assets://archive/namcohigh/artists/pagination_artist_17.png);
            margin: 0 10px 0 0;
          }
          &.pager-18 {
            background-image:url(assets://archive/namcohigh/artists/pagination_artist_18.png);
            margin: 0 10px 0 0;
          }
          &.pager-19 {
            background-image:url(assets://archive/namcohigh/artists/pagination_artist_19.png);
            margin: 0 10px 0 0;
          }
          &.pager-20 {
            background-image:url(assets://archive/namcohigh/artists/pagination_artist_20.png);
            margin: 0 10px 0 0;
          }
          &.pager-21 {
            background-image:url(assets://archive/namcohigh/artists/pagination_artist_21.png);
            margin: 0 10px 0 0;
          }
          &.pager-22 {
            background-image:url(assets://archive/namcohigh/artists/pagination_artist_22.png);
            margin: 0 10px 0 0;
          }
          &.pager-23 {
            background-image:url(assets://archive/namcohigh/artists/pagination_artist_23.png);
            margin: 0 10px 0 0;
          }
          &.pager-24 {
            background-image:url(assets://archive/namcohigh/artists/pagination_artist_24.png);
            margin: 0 10px 0 0;
          }
          &.pager-25 {
            background-image:url(assets://archive/namcohigh/artists/pagination_artist_25.png);
            margin: 0 10px 0 0;
          }
          &.pager-26 {
            background-image:url(assets://archive/namcohigh/artists/pagination_artist_26.png);
            margin: 0 10px 0 32px;
          }
        }
      }
    }
  }
  .footer {
    margin: 24px auto 0;
    background: #000;
    color:#fff; 
    text-align: center;
    font-size: 10px;
    .bng-logo {
      float: right;
      text-align: right;
      margin: 0;
    }
    .footer_inner_attention{
      width: 1000px;
      margin: 0 auto;
      padding: 30px 0 30px;
    }
  }
}

.gameBody {
  background: #ccdbed url(assets://archive/namcohigh/bg.jpg) no-repeat fixed center / cover;
  justify-content: center;
  align-items: center;
  display: flex;

  .gameFrame {
    box-shadow: 0px 0px 14px 8px rgba(0,0,0,0.6), inset 0px 0px 1px 1px #000;
    position: absolute;
    max-height: 100%;
    max-width: 100%;
  }
}
</style>

