<template>
  <GenericPage noPageContent>
    <div class="pageContent psMap" v-if="isPSMap">
      <h2 class="pageTitle">Problem Sleuth Map</h2>
      <Media :url="psMap" useMap="#problemSleuth"/>
      <map name="problemSleuth">
        <area shape="rect" href="/unlock/PS_titlescreen" coords="18,17,190,140">
        <area shape="rect" href="/mspa/000219" v-if="!$pageIsSpoiler('000219')" coords="223,2,413,167">
        <area shape="rect" href="/mspa/000302" v-if="!$pageIsSpoiler('000302')" coords="440,-9,630,185">
        <area shape="rect" href="/mspa/000402" v-if="!$pageIsSpoiler('000402')" coords="382,226,627,399">
        <area shape="rect" href="/mspa/000448" v-if="!$pageIsSpoiler('000448')" coords="83,180,336,304">
        <area shape="rect" href="/mspa/000546" v-if="!$pageIsSpoiler('000546')" coords="-4,327,294,466">
        <area shape="rect" href="/mspa/000604" v-if="!$pageIsSpoiler('000604')" coords="51,489,351,629">
        <area shape="rect" href="/mspa/000666" v-if="!$pageIsSpoiler('000666')" coords="389,415,612,596">
        <area shape="rect" href="/mspa/000742" v-if="!$pageIsSpoiler('000742')" coords="365,608,654,801">
        <area shape="rect" href="/mspa/000816" v-if="!$pageIsSpoiler('000816')" coords="-10,628,334,809">
        <area shape="rect" href="/mspa/000873" v-if="!$pageIsSpoiler('000873')" coords="-10,820,183,1026">
        <area shape="rect" href="/mspa/000953" v-if="!$pageIsSpoiler('000953')" coords="221,813,363,987">
        <area shape="rect" href="/mspa/001030" v-if="!$pageIsSpoiler('001030')" coords="394,808,627,1014">
        <area shape="rect" href="/mspa/001069" v-if="!$pageIsSpoiler('001069')" coords="394,1023,601,1230">
        <area shape="rect" href="/mspa/001149" v-if="!$pageIsSpoiler('001149')" coords="204,1029,379,1211">
        <area shape="rect" href="/mspa/001257" v-if="!$pageIsSpoiler('001257')" coords="-10,1030,169,1213">
        <area shape="rect" href="/mspa/001299" v-if="!$pageIsSpoiler('001299')" coords="52,1245,307,1429">
        <area shape="rect" href="/mspa/001406" v-if="!$pageIsSpoiler('001406')" coords="351,1252,620,1511">
        <area shape="rect" href="/mspa/001466" v-if="!$pageIsSpoiler('001466')" coords="227,1575,402,1687">
        <area shape="rect" href="/mspa/001507" v-if="!$pageIsSpoiler('001507')" coords="56,1759,238,1945">
        <area shape="rect" href="/mspa/001589" v-if="!$pageIsSpoiler('001589')" coords="345,1728,602,1934">
        <area shape="rect" href="/mspa/001655" v-if="!$pageIsSpoiler('001655')" coords="189,1977,435,2168">
        <area shape="rect" href="/mspa/001708" v-if="!$pageIsSpoiler('001708')" coords="53,2202,563,2443">
      </map>
    </div>
    <div class="pageContent hsMap" v-else-if="isHSMap">
      <h2 class="pageTitle">Homestuck Map</h2>
      <div class="mapFrame" :key="$newReaderCurrent">

        <div class="sides" v-if="!$isNewReader">
          <Media class="side1" url="/maps/map_side1.gif" />
          <Media class="side2" url="/maps/map_side2.gif" />
        </div>

        <div class="parts" v-if="!$pageIsSpoiler('003889')" >
          <Media class="part1" url="/maps/map_part1.gif" />
          <Media class="part2" url="/maps/map_part2b.gif" v-if="!$pageIsSpoiler('006013')" />
          <Media class="part3" url="/maps/map_part3.gif" v-if="!$pageIsSpoiler('008131')" />
          <Media class="part4" url="/maps/map_part4.gif" v-if="!$pageIsSpoiler('009987')" />
        </div>

        <div class="acts">
          <div class="act act1">
            <a class="banner" href="/mspa/001901" ><Media url="/maps/map_06_01.gif" /></a>
            <div class="row" v-if="!$pageIsSpoiler('001934')" >
              <a href="/mspa/001934" ><Media url="/maps/map_06_01_2.gif" /></a>
              <a href="/mspa/001982" v-show="!$pageIsSpoiler('001982')" ><Media url="/maps/map_06_01_3.gif" /></a>
              <a href="/mspa/002026" v-show="!$pageIsSpoiler('002026')" ><Media url="/maps/map_06_01_4.gif" /></a>
              <a href="/mspa/002086" v-show="!$pageIsSpoiler('002086')" ><Media url="/maps/map_06_01_5.gif" /></a>
              <a href="/mspa/002114" v-show="!$pageIsSpoiler('002114')" ><Media url="/maps/map_06_01_6.gif" /></a>
            </div>
          </div>

          <div class="act act2" v-if="!$pageIsSpoiler('002148')" >
            <a class="banner" href="/mspa/002148" ><Media url="/maps/map_06_02.gif" /></a>
            <div class="row" v-if="!$pageIsSpoiler('002209')" >
              <a href="/mspa/002209" ><Media url="/maps/map_06_02_2.gif" /></a>
              <a href="/mspa/002288" v-show="!$pageIsSpoiler('002288')" ><Media url="/maps/map_06_02_3.gif" /></a>
              <a href="/mspa/002322" v-show="!$pageIsSpoiler('002322')" ><Media url="/maps/map_06_02_4.gif" /></a>
              <a href="/mspa/002359" v-show="!$pageIsSpoiler('002359')" ><Media url="/maps/map_06_02_5.gif" /></a>
              <a href="/mspa/002395" v-show="!$pageIsSpoiler('002395')" ><Media url="/maps/map_06_02_6.gif" /></a>
            </div>
            <div class="row" v-if="!$pageIsSpoiler('002433')" >
              <a href="/mspa/002433" ><Media url="/maps/map_06_02_7.gif" /></a>
              <a href="/mspa/002507" v-show="!$pageIsSpoiler('002507')" ><Media url="/maps/map_06_02_8.gif" /></a>
              <a href="/mspa/002535" v-show="!$pageIsSpoiler('002535')" ><Media url="/maps/map_06_02_9.gif" /></a>
              <a href="/mspa/002565" v-show="!$pageIsSpoiler('002565')" ><Media url="/maps/map_06_02_10.gif" /></a>
              <a href="/mspa/002621" v-show="!$pageIsSpoiler('002621')" ><Media url="/maps/map_06_02_11.gif" /></a>
            </div>
          </div>

          <div class="act act3" v-if="!$pageIsSpoiler('002659')" >
            <a class="banner" href="/mspa/002659" ><Media url="/maps/map_06_03.gif" /></a>
            <div class="row" v-if="!$pageIsSpoiler('002697')" >
              <a href="/mspa/002697" ><Media url="/maps/map_06_03_02.gif" /></a>
              <a href="/mspa/002759" v-show="!$pageIsSpoiler('002759')" ><Media url="/maps/map_06_03_03.gif" /></a>
              <a href="/mspa/002792" v-show="!$pageIsSpoiler('002792')" ><Media url="/maps/map_06_03_04.gif" /></a>
              <a href="/mspa/002842" v-show="!$pageIsSpoiler('002842')" ><Media url="/maps/map_06_03_05.gif" /></a>
              <a href="/mspa/002875" v-show="!$pageIsSpoiler('002875')" ><Media url="/maps/map_06_03_06.gif" /></a>
            </div>
            <div class="row" v-if="!$pageIsSpoiler('002905')" >
              <a href="/mspa/002905" ><Media url="/maps/map_06_03_07.gif" /></a>
              <a href="/mspa/002947" v-show="!$pageIsSpoiler('002947')" ><Media url="/maps/map_06_03_08.gif" /></a>
              <a href="/mspa/002981" v-show="!$pageIsSpoiler('002981')" ><Media url="/maps/map_06_03_09.gif" /></a>
              <a href="/mspa/003000" v-show="!$pageIsSpoiler('003000')" ><Media url="/maps/map_06_03_10.gif" /></a>
              <a href="/mspa/003029" v-show="!$pageIsSpoiler('003029')" ><Media url="/maps/map_06_03_11.gif" /></a>
            </div>
          </div>

          <div class="act int" v-if="!$pageIsSpoiler('003054')" >
            <a class="banner" href="/mspa/003054" ><Media url="/maps/map_06_int.gif" /></a>
            <div class="row" v-if="!$pageIsSpoiler('003088')" >
              <a href="/mspa/003088" ><Media url="/maps/map_06_int_02.gif" /></a>
              <a href="/mspa/003136" v-show="!$pageIsSpoiler('003136')" ><Media url="/maps/map_06_int_03.gif" /></a>
              <a href="/mspa/003167" v-show="!$pageIsSpoiler('003167')" ><Media url="/maps/map_06_int_04.gif" /></a>
              <a href="/mspa/003195" v-show="!$pageIsSpoiler('003195')" ><Media url="/maps/map_06_int_05.gif" /></a>
              <a href="/mspa/003224" v-show="!$pageIsSpoiler('003224')" ><Media url="/maps/map_06_int_06.gif" /></a>
            </div>
          </div>

          <div class="act act4" v-if="!$pageIsSpoiler('003258')" >
            <a class="banner" href="/mspa/003258" ><Media url="/maps/map_06_04.gif" /></a>
            <div class="row" v-if="!$pageIsSpoiler('003307')" >
              <a href="/mspa/003307" ><Media url="/maps/map_06_04_2.gif" /></a>
              <a href="/mspa/003354" v-show="!$pageIsSpoiler('003354')" ><Media url="/maps/map_06_04_3.gif" /></a>
              <a href="/mspa/003404" v-show="!$pageIsSpoiler('003404')" ><Media url="/maps/map_06_04_4.gif" /></a>
              <a href="/mspa/003456" v-show="!$pageIsSpoiler('003456')" ><Media url="/maps/map_06_04_5.gif" /></a>
              <a href="/mspa/003500" v-show="!$pageIsSpoiler('003500')" ><Media url="/maps/map_06_04_6.gif" /></a>
            </div>
            <div class="row" v-if="!$pageIsSpoiler('003568')" >
              <a href="/mspa/003568" ><Media url="/maps/map_06_04_7.gif" /></a>
              <a href="/mspa/003597" v-show="!$pageIsSpoiler('003597')" ><Media url="/maps/map_06_04_8.gif" /></a>
              <a href="/mspa/003652" v-show="!$pageIsSpoiler('003652')" ><Media url="/maps/map_06_04_9.gif" /></a>
              <a href="/mspa/003701" v-show="!$pageIsSpoiler('003701')" ><Media url="/maps/map_06_04_10.gif" /></a>
              <a href="/mspa/003751" v-show="!$pageIsSpoiler('003751')" ><Media url="/maps/map_06_04_11.gif" /></a>
            </div>
            <div class="row" v-if="!$pageIsSpoiler('003765')" >
              <a href="/mspa/003765" ><Media url="/maps/map_06_04_12.gif" /></a>
              <a href="/mspa/003790" v-show="!$pageIsSpoiler('003790')" ><Media url="/maps/map_06_04_13.gif" /></a>
              <a href="/mspa/003802" v-show="!$pageIsSpoiler('003802')" ><Media url="/maps/map_06_04_14.gif" /></a>
              <a href="/mspa/003822" v-show="!$pageIsSpoiler('003822')" ><Media url="/maps/map_06_04_15.gif" /></a>
              <a href="/mspa/003840" v-show="!$pageIsSpoiler('003840')" ><Media url="/maps/map_06_04_16.gif" /></a>
            </div>
          </div>

          <div class="actSeparator" v-if="!$pageIsSpoiler('004526')">
            <Media class="split1" url="/maps/map_bifurcate.gif" />
          </div>

          <div class="act act51" v-if="!$pageIsSpoiler('003889')" >
            <a class="banner" href="/mspa/003889" >
              <Media v-if="$pageIsSpoiler('004526')" url="/maps/map_06_05.gif" />
              <Media v-else url="/maps/map_06_051.gif" />
            </a>
            <div class="row" v-if="!$pageIsSpoiler('003933')" >
              <a href="/mspa/003933" ><Media url="/maps/map_06_051_2.gif" /></a>
              <a href="/mspa/003973" v-show="!$pageIsSpoiler('003973')" ><Media url="/maps/map_06_051_3.gif" /></a>
              <a href="/mspa/004008" v-show="!$pageIsSpoiler('004008')" ><Media url="/maps/map_06_051_4.gif" /></a>
              <a href="/mspa/004050" v-show="!$pageIsSpoiler('004050')" ><Media url="/maps/map_06_051_5.gif" /></a>
              <a href="/mspa/004089" v-show="!$pageIsSpoiler('004089')" ><Media url="/maps/map_06_051_6.gif" /></a>
            </div>
            <div class="row" v-if="!$pageIsSpoiler('004138')" >
              <a href="/mspa/004138" ><Media url="/maps/map_06_051_7.gif" /></a>
              <a href="/mspa/004177" v-show="!$pageIsSpoiler('004177')" ><Media url="/maps/map_06_051_8.gif" /></a>
              <a href="/mspa/004223" v-show="!$pageIsSpoiler('004223')" ><Media url="/maps/map_06_051_9.gif" /></a>
              <a href="/mspa/004265" v-show="!$pageIsSpoiler('004265')" ><Media url="/maps/map_06_051_10.gif" /></a>
              <a href="/mspa/004322" v-show="!$pageIsSpoiler('004322')" ><Media url="/maps/map_06_051_11.gif" /></a>
            </div>
            <div class="row" v-if="!$pageIsSpoiler('004370')" >
              <a href="/mspa/004370" ><Media url="/maps/map_06_051_12.gif" /></a>
              <a href="/mspa/004416" v-show="!$pageIsSpoiler('004416')" ><Media url="/maps/map_06_051_13.gif" /></a>
              <a href="/mspa/004452" v-show="!$pageIsSpoiler('004452')" ><Media url="/maps/map_06_051_14.gif" /></a>
              <a href="/mspa/004478" v-show="!$pageIsSpoiler('004478')" ><Media url="/maps/map_06_051_15.gif" /></a>
              <a href="/mspa/004490" v-show="!$pageIsSpoiler('004490')" ><Media url="/maps/map_06_051_16.gif" /></a>
            </div>
          </div>

          <div class="act act52" v-if="!$pageIsSpoiler('004526')" >
            <a class="banner" href="/mspa/004526" ><Media url="/maps/map_06_052.gif" /></a>
            <div class="row" v-if="!$pageIsSpoiler('004567')" >
              <a href="/mspa/004567" ><Media url="/maps/map_06_052_2.gif" /></a>
              <a href="/mspa/004626" v-show="!$pageIsSpoiler('004626')" ><Media url="/maps/map_06_052_3.gif" /></a>
              <a href="/mspa/004658" v-show="!$pageIsSpoiler('004658')" ><Media url="/maps/map_06_052_4.gif" /></a>
              <a href="/mspa/004692" v-show="!$pageIsSpoiler('004692')" ><Media url="/maps/map_06_052_5.gif" /></a>
              <a href="/mspa/004740" v-show="!$pageIsSpoiler('004740')" ><Media url="/maps/map_06_052_6.gif" /></a>
            </div>
            <div class="row" v-if="!$pageIsSpoiler('004787')" >
              <a href="/mspa/004787" ><Media url="/maps/map_06_052_7.gif" /></a>
              <a href="/mspa/004827" v-show="!$pageIsSpoiler('004827')" ><Media url="/maps/map_06_052_8.gif" /></a>
              <a href="/mspa/004869" v-show="!$pageIsSpoiler('004869')" ><Media url="/maps/map_06_052_9.gif" /></a>
              <a href="/mspa/004906" v-show="!$pageIsSpoiler('004906')" ><Media url="/maps/map_06_052_10.gif" /></a>
              <a href="/mspa/004935" v-show="!$pageIsSpoiler('004935')" ><Media url="/maps/map_06_052_11.gif" /></a>
            </div>
            <div class="row" v-if="!$pageIsSpoiler('004979')" >
              <a href="/mspa/004979" ><Media url="/maps/map_06_052_12.gif" /></a>
              <a href="/mspa/005019" v-show="!$pageIsSpoiler('005019')" ><Media url="/maps/map_06_052_13.gif" /></a>
              <a href="/mspa/005072" v-show="!$pageIsSpoiler('005072')" ><Media url="/maps/map_06_052_14.gif" /></a>
              <a href="/mspa/005118" v-show="!$pageIsSpoiler('005118')" ><Media url="/maps/map_06_052_15.gif" /></a>
              <a href="/mspa/005172" v-show="!$pageIsSpoiler('005172')" ><Media url="/maps/map_06_052_16.gif" /></a>
            </div>
            <div class="row" v-if="!$pageIsSpoiler('005221')" >
              <a href="/mspa/005221" ><Media url="/maps/map_06_052_17.gif" /></a>
              <a href="/mspa/005264" v-show="!$pageIsSpoiler('005264')" ><Media url="/maps/map_06_052_17_2.gif" /></a>
              <a href="/mspa/005314" v-show="!$pageIsSpoiler('005314')" ><Media url="/maps/map_06_052_18.gif" /></a>
              <a href="/mspa/005338" v-show="!$pageIsSpoiler('005338')" ><Media url="/maps/map_06_052_19.gif" /></a>
              <a href="/mspa/005379" v-show="!$pageIsSpoiler('005379')" ><Media url="/maps/map_06_052_20.gif" /></a>
            </div>
            <div class="row" v-if="!$pageIsSpoiler('005420')" >
              <a href="/mspa/005420" ><Media url="/maps/map_06_052_21.gif" /></a>
              <a href="/mspa/005465" v-show="!$pageIsSpoiler('005465')" ><Media url="/maps/map_06_052_22.gif" /></a>
              <a href="/mspa/005513" v-show="!$pageIsSpoiler('005513')" ><Media url="/maps/map_06_052_23.gif" /></a>
              <a href="/mspa/005559" v-show="!$pageIsSpoiler('005559')" ><Media url="/maps/map_06_052_24.gif" /></a>
              <a href="/mspa/005595" v-show="!$pageIsSpoiler('005595')" ><Media url="/maps/map_06_052_25.gif" /></a>
            </div>
            <div class="row" v-if="!$pageIsSpoiler('005644')" >
              <a href="/mspa/005644" ><Media url="/maps/map_06_052_26.gif" /></a>
              <a href="/mspa/005660" v-show="!$pageIsSpoiler('005660')" ><Media url="/maps/map_06_052_27.gif" /></a>
              <a href="/mspa/005720" v-show="!$pageIsSpoiler('005720')" ><Media url="/maps/map_06_052_28.gif" /></a>
              <a href="/mspa/005760" v-show="!$pageIsSpoiler('005760')" ><Media url="/maps/map_06_052_29.gif" /></a>
              <a href="/mspa/005774" v-show="!$pageIsSpoiler('005774')" ><Media url="/maps/map_06_052_30.gif" /></a>
            </div>
            <div class="row" v-if="!$pageIsSpoiler('005795')" >
              <a href="/mspa/005795" ><Media url="/maps/map_06_052_31.gif" /></a>
              <a href="/mspa/005836" v-show="!$pageIsSpoiler('005836')" ><Media url="/maps/map_06_052_32.gif" /></a>
              <a href="/mspa/005874" v-show="!$pageIsSpoiler('005874')" ><Media url="/maps/map_06_052_33.gif" /></a>
              <a href="/mspa/005902" v-show="!$pageIsSpoiler('005902')" ><Media url="/maps/map_06_052_34.gif" /></a>
              <a href="/mspa/005919" v-show="!$pageIsSpoiler('005919')" ><Media url="/maps/map_06_052_35.gif" /></a>
            </div>
            <div class="row" v-if="!$pageIsSpoiler('005943')" >
              <a href="/mspa/005943" ><Media url="/maps/map_06_052_36.gif" /></a>
              <a href="/mspa/005953" v-show="!$pageIsSpoiler('005953')" ><Media url="/maps/map_06_052_37.gif" /></a>
              <a href="/mspa/005961" v-show="!$pageIsSpoiler('005961')" ><Media url="/maps/map_06_052_38.gif" /></a>
              <a href="/mspa/005973" v-show="!$pageIsSpoiler('005973')" ><Media url="/maps/map_06_052_39.gif" /></a>
              <a href="/mspa/005981" v-show="!$pageIsSpoiler('005981')" ><Media url="/maps/map_06_052_40.gif"  noncritical /></a>
            </div>
            <a class="banner" href="/mspa/006009" v-show="!$pageIsSpoiler('006009')" ><Media url="/maps/map_06_cascade.gif" /></a>
            <a class="banner" href="/mspa/006011" v-show="!$pageIsSpoiler('006011')" ><Media url="/maps/map_06_int2.gif" noncritical /></a>
          </div>

          <div class="actSeparator" v-if="!$pageIsSpoiler('006195')">
            <Media class="split2" url="/maps/map_splitA6.gif" />
          </div>

          <div class="act act61" v-if="!$pageIsSpoiler('006013')" >
            <a class="banner" href="/mspa/006013" >
              <Media v-if="$pageIsSpoiler('006195')" url="/maps/map_06_06.gif" />
              <Media v-else url="/maps/map_06_061.gif" />
            </a>
            <div class="row" v-if="!$pageIsSpoiler('006030')" >
              <a href="/mspa/006030" ><Media url="/maps/map_06_061_41.gif" /></a>
              <a href="/mspa/006074" v-show="!$pageIsSpoiler('006074')" ><Media url="/maps/map_06_061_42.gif" /></a>
              <a href="/mspa/006115" v-show="!$pageIsSpoiler('006115')" ><Media url="/maps/map_06_061_43.gif" /></a>
              <a href="/mspa/006147" v-show="!$pageIsSpoiler('006147')" ><Media url="/maps/map_06_061_44.gif" /></a>
              <a href="/mspa/006182" v-show="!$pageIsSpoiler('006182')" ><Media url="/maps/map_06_061_45.gif" /></a>
            </div>
          </div>

          <div class="act act61I" v-if="!$pageIsSpoiler('006195')" >
            <a class="banner" href="/mspa/006195" ><Media url="/maps/map_06_I1.gif" /></a>
            <div class="row" v-if="!$pageIsSpoiler('006206')" >
              <a href="/mspa/006206" ><Media url="/maps/map_06_I1_01.gif" /></a>
              <a href="/mspa/006229" v-show="!$pageIsSpoiler('006229')" ><Media url="/maps/map_06_I1_02.gif" /></a>
              <a href="/mspa/006255" v-show="!$pageIsSpoiler('006255')" ><Media url="/maps/map_06_I1_03.gif" /></a>
              <a href="/mspa/006273" v-show="!$pageIsSpoiler('006273')" ><Media url="/maps/map_06_I1_04.gif" /></a>
              <a href="/mspa/006290" v-show="!$pageIsSpoiler('006290')" ><Media url="/maps/map_06_I1_05.gif" /></a>
            </div>
          </div>

          <div class="act act62" v-if="!$pageIsSpoiler('006319')" >
            <a class="banner" href="/mspa/006319" ><Media url="/maps/map_06_062b.gif" /></a>
            <div class="row" v-if="!$pageIsSpoiler('006353')" >
              <a href="/mspa/006353" ><Media url="/maps/map_06_062_46.gif" /></a>
              <a href="/mspa/006386" v-show="!$pageIsSpoiler('006386')" ><Media url="/maps/map_06_062_47.gif" /></a>
              <a href="/mspa/006426" v-show="!$pageIsSpoiler('006426')" ><Media url="/maps/map_06_062_48.gif" /></a>
              <a href="/mspa/006441" v-show="!$pageIsSpoiler('006441')" ><Media url="/maps/map_06_062_49.gif" /></a>
              <a href="/mspa/006472" v-show="!$pageIsSpoiler('006472')" ><Media url="/maps/map_06_062_50.gif" /></a>
            </div>
            <div class="row" v-if="!$pageIsSpoiler('006482')" >
              <a href="/mspa/006482" ><Media url="/maps/map_06_062_51.gif" /></a>
              <a href="/mspa/006500" v-show="!$pageIsSpoiler('006500')" ><Media url="/maps/map_06_062_52.gif" /></a>
              <a href="/mspa/006517" v-show="!$pageIsSpoiler('006517')" ><Media url="/maps/map_06_062_53.gif" /></a>
              <a href="/mspa/006543" v-show="!$pageIsSpoiler('006543')" ><Media url="/maps/map_06_062_54.gif" /></a>
              <a href="/mspa/006565" v-show="!$pageIsSpoiler('006565')" ><Media url="/maps/map_06_062_55.gif" /></a>
            </div>
          </div>

          <div class="act act62I" v-if="!$pageIsSpoiler('006567')" >
            <a class="banner" href="/mspa/006567" ><Media url="/maps/map_06_I2.gif" /></a>
            <div class="row" v-if="!$pageIsSpoiler('006584')" >
              <a href="/mspa/006584" ><Media url="/maps/map_06_I2_06.gif" /></a>
              <a href="/mspa/006629" v-show="!$pageIsSpoiler('006629')" ><Media url="/maps/map_06_I2_07.gif" /></a>
              <a href="/mspa/006663" v-show="!$pageIsSpoiler('006663')" ><Media url="/maps/map_06_I2_08.gif" /></a>
              <a href="/mspa/006704" v-show="!$pageIsSpoiler('006704')" ><Media url="/maps/map_06_I2_09.gif" /></a>
              <a href="/mspa/006715" v-show="!$pageIsSpoiler('006715')" ><Media url="/maps/map_06_I2_10.gif" /></a>
            </div>
          </div>

          <div class="act act63" v-if="!$pageIsSpoiler('006720')" >
            <a class="banner" href="/mspa/006720" ><Media url="/maps/map_06_063b.gif" /></a>
            <div class="row" v-if="!$pageIsSpoiler('006757')" >
              <a href="/mspa/006757" ><Media url="/maps/map_06_063_56.gif" /></a>
              <a href="/mspa/006781" v-show="!$pageIsSpoiler('006781')" ><Media url="/maps/map_06_063_57.gif" /></a>
              <a href="/mspa/006813" v-show="!$pageIsSpoiler('006813')" ><Media url="/maps/map_06_063_58.gif" /></a>
              <a href="/mspa/006844" v-show="!$pageIsSpoiler('006844')" ><Media url="/maps/map_06_063_59.gif" /></a>
              <a href="/mspa/006889" v-show="!$pageIsSpoiler('006889')" ><Media url="/maps/map_06_063_60.gif" /></a>
            </div>
            <div class="row" v-if="!$pageIsSpoiler('006930')" >
              <a href="/mspa/006930" ><Media url="/maps/map_06_063_61.gif" /></a>
              <a href="/mspa/006964" v-show="!$pageIsSpoiler('006964')" ><Media url="/maps/map_06_063_62.gif" /></a>
              <a href="/mspa/006997" v-show="!$pageIsSpoiler('006997')" ><Media url="/maps/map_06_063_63.gif" /></a>
              <a href="/mspa/007037" v-show="!$pageIsSpoiler('007037')" ><Media url="/maps/map_06_063_64.gif" /></a>
              <a href="/mspa/007071" v-show="!$pageIsSpoiler('007071')" ><Media url="/maps/map_06_063_65.gif" /></a>
            </div>
            <div class="row" v-if="!$pageIsSpoiler('007102')" >
              <a href="/mspa/007102" ><Media url="/maps/map_06_063_66.gif" /></a>
              <a href="/mspa/007116" v-show="!$pageIsSpoiler('007116')" ><Media url="/maps/map_06_063_67.gif" /></a>
              <a href="/mspa/007138" v-show="!$pageIsSpoiler('007138')" ><Media url="/maps/map_06_063_68.gif" /></a>
              <a href="/mspa/007152" v-show="!$pageIsSpoiler('007152')" ><Media url="/maps/map_06_063_69.gif" /></a>
              <a href="/mspa/007161" v-show="!$pageIsSpoiler('007161')" ><Media url="/maps/map_06_063_70.gif" /></a>
            </div>
          </div>

          <div class="act act63I" v-if="!$pageIsSpoiler('007163')" >
            <a class="banner" href="/mspa/007163" ><Media url="/maps/map_06_I3.gif" /></a>
            <div class="row" v-if="!$pageIsSpoiler('007208')" >
              <a href="/mspa/007208" ><Media url="/maps/map_06_I3_11.gif" /></a>
              <a href="/mspa/007240" v-show="!$pageIsSpoiler('007240')" ><Media url="/maps/map_06_I3_12.gif" /></a>
              <a href="/mspa/007298" v-show="!$pageIsSpoiler('007298')" ><Media url="/maps/map_06_I3_13.gif" /></a>
              <a href="/mspa/007307" v-show="!$pageIsSpoiler('007307')" ><Media url="/maps/map_06_I3_14.gif" /></a>
              <a href="/mspa/007327" v-show="!$pageIsSpoiler('007327')" ><Media url="/maps/map_06_I3_15.gif" /></a>
            </div>
          </div>

          <div class="act act64" v-if="!$pageIsSpoiler('007338')" >
            <a class="banner" href="/mspa/007338" ><Media url="/maps/map_06_064.gif" /></a>
          </div>

          <div class="act act64I" v-if="!$pageIsSpoiler('007341')" >
            <a class="banner" href="/mspa/007341" ><Media url="/maps/map_06_I4.gif" /></a>
            <div class="row" v-if="!$pageIsSpoiler('007343')" >
              <a href="/mspa/007343" ><Media url="/maps/map_06_I4_16.gif" /></a>
              <a href="/mspa/007355" v-show="!$pageIsSpoiler('007355')" ><Media url="/maps/map_06_I4_17.gif" /></a>
              <a href="/mspa/007371" v-show="!$pageIsSpoiler('007371')" ><Media url="/maps/map_06_I4_18.gif" /></a>
              <a href="/mspa/007395" v-show="!$pageIsSpoiler('007395')" ><Media url="/maps/map_06_I4_19.gif" /></a>
              <a href="/mspa/007398" v-show="!$pageIsSpoiler('007398')" ><Media url="/maps/map_06_I4_20.gif" /></a>
            </div>
          </div>

          <div class="act act65" v-if="!$pageIsSpoiler('007412')" >
            <a class="banner" href="/mspa/007412" ><Media url="/maps/map_06_065.gif" /></a>
            <div class="row" v-if="!$pageIsSpoiler('007420')" >
              <a href="/mspa/007420" ><Media url="/maps/map_06_065_71.gif" /></a>
              <a href="/mspa/007443" v-show="!$pageIsSpoiler('007443')" ><Media url="/maps/map_06_065_72.gif" /></a>
              <a href="/mspa/007459" v-show="!$pageIsSpoiler('007459')" ><Media url="/maps/map_06_065_73.gif" /></a>
              <a href="/mspa/007472" v-show="!$pageIsSpoiler('007472')" ><Media url="/maps/map_06_065_74.gif" /></a>
              <a href="/mspa/007505" v-show="!$pageIsSpoiler('007505')" ><Media url="/maps/map_06_065_75.gif" /></a>
            </div>
            <div class="row" v-if="!$pageIsSpoiler('007527')" >
              <a href="/mspa/007527" ><Media url="/maps/map_06_065_76.gif" /></a>
              <a href="/mspa/007555" v-show="!$pageIsSpoiler('007555')" ><Media url="/maps/map_06_065_77.gif" /></a>
              <a href="/mspa/007596" v-show="!$pageIsSpoiler('007596')" ><Media url="/maps/map_06_065_78.gif" /></a>
              <a href="/mspa/007611" v-show="!$pageIsSpoiler('007611')" ><Media url="/maps/map_06_065_79.gif" /></a>
              <a href="/mspa/007663" v-show="!$pageIsSpoiler('007663')" ><Media url="/maps/map_06_065_80.gif" /></a>
            </div>
            <div class="row" v-if="!$pageIsSpoiler('007678')" >
              <a href="/mspa/007678" ><Media url="/maps/map_06_065_81.gif" /></a>
              <a href="/mspa/007720" v-show="!$pageIsSpoiler('007720')" ><Media url="/maps/map_06_065_82.gif" /></a>
              <a href="/mspa/007748" v-show="!$pageIsSpoiler('007748')" ><Media url="/maps/map_06_065_83.gif" /></a>
              <a href="/mspa/007768" v-show="!$pageIsSpoiler('007768')" ><Media url="/maps/map_06_065_84.gif" /></a>
              <a href="/mspa/007790" v-show="!$pageIsSpoiler('007790')" ><Media url="/maps/map_06_065_85.gif" /></a>
            </div>
          </div>

          <div class="act act65I" v-if="!$pageIsSpoiler('007827')" >
            <a class="banner" href="/mspa/007827" ><Media url="/maps/map_06_I5.gif" /></a>
            <div class="row" v-if="!$pageIsSpoiler('007839')" >
              <a href="/mspa/007839" ><Media url="/maps/map_06_I5_21.gif" /></a>
              <a href="/mspa/007866" v-show="!$pageIsSpoiler('007866')" ><Media url="/maps/map_06_I5_22.gif" /></a>
              <a href="/mspa/007897" v-show="!$pageIsSpoiler('007897')" ><Media url="/maps/map_06_I5_23.gif" /></a>
              <a href="/mspa/007924" v-show="!$pageIsSpoiler('007924')" ><Media url="/maps/map_06_I5_24.gif" /></a>
              <a href="/mspa/007962" v-show="!$pageIsSpoiler('007962')" ><Media url="/maps/map_06_I5_25.gif" /></a>
            </div>
            <div class="row" v-if="!$pageIsSpoiler('007998')" >
              <a href="/mspa/007998" ><Media url="/maps/map_06_I5_26.gif" /></a>
              <a href="/mspa/008044" v-show="!$pageIsSpoiler('008044')" ><Media url="/maps/map_06_I5_27.gif" /></a>
              <a href="/mspa/008092" v-show="!$pageIsSpoiler('008092')" ><Media url="/maps/map_06_I5_28.gif" /></a>
              <a href="/mspa/008123" v-show="!$pageIsSpoiler('008123')" ><Media url="/maps/map_06_I5_29.gif" /></a>
              <a href="/mspa/008131" v-show="!$pageIsSpoiler('008131')" ><Media url="/maps/map_06_I5_30.gif" /></a>
            </div>
          </div>

          <div class="actSeparator" v-if="!$pageIsSpoiler('008143')" >
            <Media class="split3" url="/maps/map_splitA6_6.gif" />
          </div>

          <div class="act act661" v-if="!$pageIsSpoiler('008143')">
            <a class="banner" href="/mspa/008143" ><Media url="/maps/map_06_0661.gif" /></a>
            <div class="row" v-show="!$pageIsSpoiler('008144')">
              <a href="/mspa/008144" ><Media url="/maps/map_06_0661_01.gif" /></a>
              <a href="/mspa/008150" v-show="!$pageIsSpoiler('008150')" ><Media url="/maps/map_06_0661_02.gif" /></a>
              <a href="/mspa/008156" v-show="!$pageIsSpoiler('008156')" ><Media url="/maps/map_06_0661_03.gif" /></a>
              <a href="/mspa/008161" v-show="!$pageIsSpoiler('008161')" ><Media url="/maps/map_06_0661_04.gif" /></a>
              <a href="/mspa/008172" v-show="!$pageIsSpoiler('008172')" ><Media url="/maps/map_06_0661_05.gif" /></a>
            </div>
          </div>

          <div class="act act661I" v-if="!$pageIsSpoiler('008178')" >
            <a class="banner" href="/mspa/008178" ><Media url="/maps/map_06_0661_I1.gif" /></a>
            <div class="row" v-if="!$pageIsSpoiler('008179')" >
              <a href="/mspa/008179" ><Media url="/maps/map_06_0661_I1_01.gif" /></a>
              <a href="/mspa/008195" v-show="!$pageIsSpoiler('008195')" ><Media url="/maps/map_06_0661_I1_02.gif" /></a>
              <a href="/mspa/008214" v-show="!$pageIsSpoiler('008214')" ><Media url="/maps/map_06_0661_I1_03.gif" /></a>
              <a href="/mspa/008233" v-show="!$pageIsSpoiler('008233')" ><Media url="/maps/map_06_0661_I1_04.gif" /></a>
              <a href="/mspa/008247" v-show="!$pageIsSpoiler('008247')" ><Media url="/maps/map_06_0661_I1_05.gif" /></a>
            </div>
            <div class="row" v-if="!$pageIsSpoiler('008272')" >
              <a href="/mspa/008272" ><Media url="/maps/map_06_0661_I1_06.gif" /></a>
              <a href="/mspa/008286" v-show="!$pageIsSpoiler('008286')" ><Media url="/maps/map_06_0661_I1_07.gif" /></a>
              <a href="/mspa/008300" v-show="!$pageIsSpoiler('008300')" ><Media url="/maps/map_06_0661_I1_08.gif" /></a>
              <a href="/mspa/008315" v-show="!$pageIsSpoiler('008315')" ><Media url="/maps/map_06_0661_I1_09.gif" /></a>
              <a href="/mspa/008330" v-show="!$pageIsSpoiler('008330')" ><Media url="/maps/map_06_0661_I1_10.gif" /></a>
            </div>
            <div class="row" v-if="!$pageIsSpoiler('008342')" >
              <a href="/mspa/008342" ><Media url="/maps/map_06_0661_I1_11.gif" /></a>
              <a href="/mspa/008351" v-show="!$pageIsSpoiler('008351')" ><Media url="/maps/map_06_0661_I1_12.gif" /></a>
              <a href="/mspa/008359" v-show="!$pageIsSpoiler('008359')" ><Media url="/maps/map_06_0661_I1_13.gif" /></a>
              <a href="/mspa/008365" v-show="!$pageIsSpoiler('008365')" ><Media url="/maps/map_06_0661_I1_14.gif" /></a>
              <a href="/mspa/008372" v-show="!$pageIsSpoiler('008372')" ><Media url="/maps/map_06_0661_I1_15.gif" /></a>
            </div>
          </div>

          <div class="act act662" v-if="!$pageIsSpoiler('008375')" >
            <a class="banner" href="/mspa/008375" ><Media url="/maps/map_06_0662.gif" /></a>
            <div class="row" v-if="!$pageIsSpoiler('008384')" >
              <a href="/mspa/008384" ><Media url="/maps/map_06_0662_01.gif" /></a>
              <a href="/mspa/008394" v-show="!$pageIsSpoiler('008394')" ><Media url="/maps/map_06_0662_02.gif" /></a>
              <a href="/mspa/008407" v-show="!$pageIsSpoiler('008407')" ><Media url="/maps/map_06_0662_03.gif" /></a>
              <a href="/mspa/008422" v-show="!$pageIsSpoiler('008422')" ><Media url="/maps/map_06_0662_04.gif" /></a>
              <a href="/mspa/008429" v-show="!$pageIsSpoiler('008429')" ><Media url="/maps/map_06_0662_05.gif" /></a>
            </div>
          </div>

          <div class="act act662I" v-if="!$pageIsSpoiler('008431')" >
            <a class="banner" href="/mspa/008431" ><Media url="/maps/map_06_0662_I2.gif" /></a>
            <div class="row" v-if="!$pageIsSpoiler('008449')" >
              <a href="/mspa/008449" ><Media url="/maps/map_06_0662_I2_01.gif" /></a>
              <a href="/mspa/008473" v-show="!$pageIsSpoiler('008473')" ><Media url="/maps/map_06_0662_I2_02.gif" /></a>
              <a href="/mspa/008493" v-show="!$pageIsSpoiler('008493')" ><Media url="/maps/map_06_0662_I2_03.gif" /></a>
              <a href="/mspa/008511" v-show="!$pageIsSpoiler('008511')" ><Media url="/maps/map_06_0662_I2_04.gif" /></a>
              <a href="/mspa/008528" v-show="!$pageIsSpoiler('008528')" ><Media url="/maps/map_06_0662_I2_05.gif" /></a>
            </div>
            <div class="row" v-if="!$pageIsSpoiler('008551')" >
              <a href="/mspa/008551" ><Media url="/maps/map_06_0662_I2_06.gif" /></a>
              <a href="/mspa/008572" v-show="!$pageIsSpoiler('008572')" ><Media url="/maps/map_06_0662_I2_07.gif" /></a>
              <a href="/mspa/008593" v-show="!$pageIsSpoiler('008593')" ><Media url="/maps/map_06_0662_I2_08.gif" /></a>
              <a href="/mspa/008613" v-show="!$pageIsSpoiler('008613')" ><Media url="/maps/map_06_0662_I2_09.gif" /></a>
              <a href="/mspa/008636" v-show="!$pageIsSpoiler('008636')" ><Media url="/maps/map_06_0662_I2_10.gif" /></a>
            </div>
            <div class="row" v-if="!$pageIsSpoiler('008663')" >
              <a href="/mspa/008663" ><Media url="/maps/map_06_0662_I2_11.gif" /></a>
              <a href="/mspa/008681" v-show="!$pageIsSpoiler('008681')" ><Media url="/maps/map_06_0662_I2_12.gif" /></a>
              <a href="/mspa/008707" v-show="!$pageIsSpoiler('008707')" ><Media url="/maps/map_06_0662_I2_13.gif" /></a>
              <a href="/mspa/008728" v-show="!$pageIsSpoiler('008728')" ><Media url="/maps/map_06_0662_I2_14.gif" /></a>
              <a href="/mspa/008751" v-show="!$pageIsSpoiler('008751')" ><Media url="/maps/map_06_0662_I2_15.gif" /></a>
            </div>
          </div>

          <div class="act act663" v-if="!$pageIsSpoiler('008753')" >
            <a class="banner" href="/mspa/008753" ><Media url="/maps/map_06_0663.gif" /></a>
            <div class="row" v-if="!$pageIsSpoiler('008764')" >
              <a href="/mspa/008764" ><Media url="/maps/map_06_0663_01.gif" /></a>
              <a href="/mspa/008771" v-show="!$pageIsSpoiler('008771')" ><Media url="/maps/map_06_0663_02.gif" /></a>
              <a href="/mspa/008781" v-show="!$pageIsSpoiler('008781')" ><Media url="/maps/map_06_0663_03.gif" /></a>
              <a href="/mspa/008785" v-show="!$pageIsSpoiler('008785')" ><Media url="/maps/map_06_0663_04.gif" /></a>
              <a href="/mspa/008799" v-show="!$pageIsSpoiler('008799')" ><Media url="/maps/map_06_0663_05.gif" /></a>
            </div>
          </div>

          <div class="act act663I" v-if="!$pageIsSpoiler('008801')" >
            <a class="banner" href="/mspa/008801" ><Media url="/maps/map_06_0663_I3.gif" /></a>
            <div class="row" v-if="!$pageIsSpoiler('008802')" >
              <a href="/mspa/008802" ><Media url="/maps/map_06_0663_I3_01.gif" /></a>
              <a href="/mspa/008805" v-show="!$pageIsSpoiler('008805')" ><Media url="/maps/map_06_0663_I3_02.gif" /></a>
              <a href="/mspa/008811" v-show="!$pageIsSpoiler('008811')" ><Media url="/maps/map_06_0663_I3_03.gif" /></a>
              <a href="/mspa/008814" v-show="!$pageIsSpoiler('008814')" ><Media url="/maps/map_06_0663_I3_04.gif" /></a>
              <a href="/mspa/008819" v-show="!$pageIsSpoiler('008819')" ><Media url="/maps/map_06_0663_I3_05.gif" /></a>
            </div>
          </div>

          <div class="act act664" v-if="!$pageIsSpoiler('008821')" >
            <a class="banner" href="/mspa/008821" ><Media url="/maps/map_06_0664.gif" /></a>
            <div class="row" v-if="!$pageIsSpoiler('008822')" >
              <a href="/mspa/008822" ><Media url="/maps/map_06_0664_01.gif" /></a>
              <a href="/mspa/008829" v-show="!$pageIsSpoiler('008829')" ><Media url="/maps/map_06_0664_02.gif" /></a>
              <a href="/mspa/008837" v-show="!$pageIsSpoiler('008837')" ><Media url="/maps/map_06_0664_03.gif" /></a>
              <a href="/mspa/008840" v-show="!$pageIsSpoiler('008840')" ><Media url="/maps/map_06_0664_04.gif" /></a>
              <a href="/mspa/008842" v-show="!$pageIsSpoiler('008842')" ><Media url="/maps/map_06_0664_05.gif" /></a>
            </div>
          </div>

          <div class="act act664I" v-if="!$pageIsSpoiler('008844')" >
            <a class="banner" href="/mspa/008844" ><Media url="/maps/map_06_0664_I4.gif" /></a>
            <div class="row" v-if="!$pageIsSpoiler('008846')" >
              <a href="/mspa/008846" ><Media url="/maps/map_06_0664_I4_01.gif" /></a>
              <a href="/mspa/008864" v-show="!$pageIsSpoiler('008864')" ><Media url="/maps/map_06_0664_I4_02.gif" /></a>
              <a href="/mspa/008881" v-show="!$pageIsSpoiler('008881')" ><Media url="/maps/map_06_0664_I4_03.gif" /></a>
              <a href="/mspa/008904" v-show="!$pageIsSpoiler('008904')" ><Media url="/maps/map_06_0664_I4_04.gif" /></a>
              <a href="/mspa/008920" v-show="!$pageIsSpoiler('008920')" ><Media url="/maps/map_06_0664_I4_05.gif" /></a>
            </div>
            <div class="row" v-if="!$pageIsSpoiler('008935')" >
              <a href="/mspa/008935" ><Media url="/maps/map_06_0664_I4_06.gif" /></a>
              <a href="/mspa/008947" v-show="!$pageIsSpoiler('008947')" ><Media url="/maps/map_06_0664_I4_07.gif" /></a>
              <a href="/mspa/008962" v-show="!$pageIsSpoiler('008962')" ><Media url="/maps/map_06_0664_I4_08.gif" /></a>
              <a href="/mspa/008983" v-show="!$pageIsSpoiler('008983')" ><Media url="/maps/map_06_0664_I4_09.gif" /></a>
              <a href="/mspa/008998" v-show="!$pageIsSpoiler('008998')" ><Media url="/maps/map_06_0664_I4_10.gif" /></a>
            </div>
            <div class="row" v-if="!$pageIsSpoiler('009020')" >
              <a href="/mspa/009020" ><Media url="/maps/map_06_0664_I4_11.gif" /></a>
              <a href="/mspa/009039" v-show="!$pageIsSpoiler('009039')" ><Media url="/maps/map_06_0664_I4_12.gif" /></a>
              <a href="/mspa/009059" v-show="!$pageIsSpoiler('009059')" ><Media url="/maps/map_06_0664_I4_13.gif" /></a>
              <a href="/mspa/009080" v-show="!$pageIsSpoiler('009080')" ><Media url="/maps/map_06_0664_I4_14.gif" /></a>
              <a href="/mspa/009105" v-show="!$pageIsSpoiler('009105')" ><Media url="/maps/map_06_0664_I4_15.gif" /></a>
            </div>
            <div class="row" v-if="!$pageIsSpoiler('009117')" >
              <a href="/mspa/009117" ><Media url="/maps/map_06_0664_I4_16.gif" /></a>
              <a href="/mspa/009140" v-show="!$pageIsSpoiler('009140')" ><Media url="/maps/map_06_0664_I4_17.gif" /></a>
              <a href="/mspa/009155" v-show="!$pageIsSpoiler('009155')" ><Media url="/maps/map_06_0664_I4_18.gif" /></a>
              <a href="/mspa/009175" v-show="!$pageIsSpoiler('009175')" ><Media url="/maps/map_06_0664_I4_19.gif" /></a>
              <a href="/mspa/009195" v-show="!$pageIsSpoiler('009195')" ><Media url="/maps/map_06_0664_I4_20.gif" /></a>
            </div>
            <div class="row" v-if="!$pageIsSpoiler('009219')" >
              <a href="/mspa/009219" ><Media url="/maps/map_06_0664_I4_21.gif" /></a>
              <a href="/mspa/009234" v-show="!$pageIsSpoiler('009234')" ><Media url="/maps/map_06_0664_I4_22.gif" /></a>
              <a href="/mspa/009248" v-show="!$pageIsSpoiler('009248')" ><Media url="/maps/map_06_0664_I4_23.gif" /></a>
              <a href="/mspa/009267" v-show="!$pageIsSpoiler('009267')" ><Media url="/maps/map_06_0664_I4_24.gif" /></a>
              <a href="/mspa/009274" v-show="!$pageIsSpoiler('009274')" ><Media url="/maps/map_06_0664_I4_25.gif" /></a>
            </div>
            <div class="row" v-if="!$pageIsSpoiler('009280')" >
              <a href="/mspa/009280" ><Media url="/maps/map_06_0664_I4_26.gif" /></a>
              <a href="/mspa/009288" v-show="!$pageIsSpoiler('009288')" ><Media url="/maps/map_06_0664_I4_27.gif" /></a>
              <a href="/mspa/009294" v-show="!$pageIsSpoiler('009294')" ><Media url="/maps/map_06_0664_I4_28.gif" /></a>
              <a href="/mspa/009305" v-show="!$pageIsSpoiler('009305')" ><Media url="/maps/map_06_0664_I4_29.gif" /></a>
              <a href="/mspa/009307" v-show="!$pageIsSpoiler('009307')" ><Media url="/maps/map_06_0664_I4_30.gif" /></a>
            </div>
          </div>

          <div class="act act665" v-if="!$pageIsSpoiler('009309')" >
            <a class="banner" href="/mspa/009309" ><Media url="/maps/map_06_0665.gif" /></a>
            <div class="row" v-if="!$pageIsSpoiler('009319')" >
              <a href="/mspa/009319" ><Media url="/maps/map_06_0665_01.gif" /></a>
              <a href="/mspa/009323" v-show="!$pageIsSpoiler('009323')" ><Media url="/maps/map_06_0665_02.gif" /></a>
              <a href="/mspa/009334" v-show="!$pageIsSpoiler('009334')" ><Media url="/maps/map_06_0665_03.gif" /></a>
              <a href="/mspa/009346" v-show="!$pageIsSpoiler('009346')" ><Media url="/maps/map_06_0665_04.gif" /></a>
              <a href="/mspa/009348" v-show="!$pageIsSpoiler('009348')" ><Media url="/maps/map_06_0665_05.gif" /></a>
            </div>
          </div>

          <div class="act act665I" v-if="!$pageIsSpoiler('009349')" >
            <a class="banner" href="/mspa/009349" ><Media url="/maps/map_06_0665_I5.gif" /></a>
            <div class="row" v-if="!$pageIsSpoiler('009350')" >
              <a href="/mspa/009350" ><Media url="/maps/map_06_0665_I5_01.gif" /></a>
              <a href="/mspa/009356" v-show="!$pageIsSpoiler('009356')" ><Media url="/maps/map_06_0665_I5_02.gif" /></a>
              <a href="/mspa/009376" v-show="!$pageIsSpoiler('009376')" ><Media url="/maps/map_06_0665_I5_03.gif" /></a>
              <a href="/mspa/009388" v-show="!$pageIsSpoiler('009388')" ><Media url="/maps/map_06_0665_I5_04.gif" /></a>
              <a href="/mspa/009411" v-show="!$pageIsSpoiler('009411')" ><Media url="/maps/map_06_0665_I5_05.gif" /></a>
            </div>
            <div class="row" v-if="!$pageIsSpoiler('009426')" >
              <a href="/mspa/009426" ><Media url="/maps/map_06_0665_I5_06.gif" /></a>
              <a href="/mspa/009445" v-show="!$pageIsSpoiler('009445')" ><Media url="/maps/map_06_0665_I5_07.gif" /></a>
              <a href="/mspa/009463" v-show="!$pageIsSpoiler('009463')" ><Media url="/maps/map_06_0665_I5_08.gif" /></a>
              <a href="/mspa/009477" v-show="!$pageIsSpoiler('009477')" ><Media url="/maps/map_06_0665_I5_09.gif" /></a>
              <a href="/mspa/009499" v-show="!$pageIsSpoiler('009499')" ><Media url="/maps/map_06_0665_I5_10.gif" /></a>
            </div>
            <div class="row" v-if="!$pageIsSpoiler('009526')" >
              <a href="/mspa/009526" ><Media url="/maps/map_06_0665_I5_11.gif" /></a>
              <a href="/mspa/009545" v-show="!$pageIsSpoiler('009545')" ><Media url="/maps/map_06_0665_I5_12.gif" /></a>
              <a href="/mspa/009560" v-show="!$pageIsSpoiler('009560')" ><Media url="/maps/map_06_0665_I5_13.gif" /></a>
              <a href="/mspa/009576" v-show="!$pageIsSpoiler('009576')" ><Media url="/maps/map_06_0665_I5_14.gif" /></a>
              <a href="/mspa/009588" v-show="!$pageIsSpoiler('009588')" ><Media url="/maps/map_06_0665_I5_15.gif" /></a>
            </div>
            <div class="row" v-if="!$pageIsSpoiler('009608')" >
              <a href="/mspa/009608" ><Media url="/maps/map_06_0665_I5_16.gif" /></a>
              <a href="/mspa/009632" v-show="!$pageIsSpoiler('009632')" ><Media url="/maps/map_06_0665_I5_17.gif" /></a>
              <a href="/mspa/009649" v-show="!$pageIsSpoiler('009649')" ><Media url="/maps/map_06_0665_I5_18.gif" /></a>
              <a href="/mspa/009676" v-show="!$pageIsSpoiler('009676')" ><Media url="/maps/map_06_0665_I5_19.gif" /></a>
              <a href="/mspa/009694" v-show="!$pageIsSpoiler('009694')" ><Media url="/maps/map_06_0665_I5_20.gif" /></a>
            </div>
            <div class="row" v-if="!$pageIsSpoiler('009716')" >
              <a href="/mspa/009716" ><Media url="/maps/map_06_0665_I5_21.gif" /></a>
              <a href="/mspa/009735" v-show="!$pageIsSpoiler('009735')" ><Media url="/maps/map_06_0665_I5_22.gif" /></a>
              <a href="/mspa/009754" v-show="!$pageIsSpoiler('009754')" ><Media url="/maps/map_06_0665_I5_23.gif" /></a>
              <a href="/mspa/009779" v-show="!$pageIsSpoiler('009779')" ><Media url="/maps/map_06_0665_I5_24.gif" /></a>
              <a href="/mspa/009798" v-show="!$pageIsSpoiler('009798')" ><Media url="/maps/map_06_0665_I5_25.gif" /></a>
            </div>
            <div class="row" v-if="!$pageIsSpoiler('009817')" >
              <a href="/mspa/009817" ><Media url="/maps/map_06_0665_I5_26.gif" /></a>
              <a href="/mspa/009831" v-show="!$pageIsSpoiler('009831')" ><Media url="/maps/map_06_0665_I5_27.gif" /></a>
              <a href="/mspa/009842" v-show="!$pageIsSpoiler('009842')" ><Media url="/maps/map_06_0665_I5_28.gif" /></a>
              <a href="/mspa/009859" v-show="!$pageIsSpoiler('009859')" ><Media url="/maps/map_06_0665_I5_29.gif" /></a>
              <a href="/mspa/009883" v-show="!$pageIsSpoiler('009883')" ><Media url="/maps/map_06_0665_I5_30.gif" /></a>
            </div>
            <div class="row" v-if="!$pageIsSpoiler('009900')" >
              <a href="/mspa/009900" ><Media url="/maps/map_06_0665_I5_31.gif" /></a>
              <a href="/mspa/009917" v-show="!$pageIsSpoiler('009917')" ><Media url="/maps/map_06_0665_I5_32.gif" /></a>
              <a href="/mspa/009935" v-show="!$pageIsSpoiler('009935')" ><Media url="/maps/map_06_0665_I5_33.gif" /></a>
              <a href="/mspa/009948" v-show="!$pageIsSpoiler('009948')" ><Media url="/maps/map_06_0665_I5_34.gif" /></a>
              <a href="/mspa/009958" v-show="!$pageIsSpoiler('009958')" ><Media url="/maps/map_06_0665_I5_35.gif" /></a>
            </div>
            <div class="row" v-if="!$pageIsSpoiler('009966')" >
              <a href="/mspa/009966" ><Media url="/maps/map_06_0665_I5_36.gif" /></a>
              <a href="/mspa/009976" v-show="!$pageIsSpoiler('009976')" ><Media url="/maps/map_06_0665_I5_37.gif" /></a>
              <a href="/mspa/009983" v-show="!$pageIsSpoiler('009983')" ><Media url="/maps/map_06_0665_I5_38.gif" /></a>
              <a href="/mspa/009985" v-show="!$pageIsSpoiler('009985')" ><Media url="/maps/map_06_0665_I5_39.gif" /></a>
              <a href="/mspa/009986" v-show="!$pageIsSpoiler('009986')" ><Media url="/maps/map_06_0665_I5_40.gif" /></a>
            </div>
          </div>

          <div class="act act666" v-if="!$pageIsSpoiler('009987')" >
            <a class="banner" href="/mspa/009987" ><Media url="/maps/map_06_0666.gif" /></a>
            <div class="row" v-if="!$pageIsSpoiler('009989')" >
              <a href="/mspa/009989" ><Media url="/maps/map_06_0666_01.gif" /></a>
              <a href="/mspa/009998" v-show="!$pageIsSpoiler('009998')" ><Media url="/maps/map_06_0666_02.gif" /></a>
              <a href="/mspa/010009" v-show="!$pageIsSpoiler('010009')" ><Media url="/maps/map_06_0666_03.gif" /></a>
              <a href="/mspa/010018" v-show="!$pageIsSpoiler('010018')" ><Media url="/maps/map_06_0666_04.gif" /></a>
              <a href="/mspa/010022" v-show="!$pageIsSpoiler('010022')" ><Media url="/maps/map_06_0666_05.gif" /></a>
            </div>
          </div>

          <div class="act act7" v-if="!$pageIsSpoiler('010027')" >
            <a class="banner" href="/mspa/010027" ><Media url="/maps/map_06_07.gif" /></a>
            <div class="postcanon">
              <a href="/mspa/010030" v-show="!$isNewReader" ><Media url="/maps/map_06_07_01.gif" /></a>
            </div>
          </div>
        </div>

        <div class="discs" v-if="!$pageIsSpoiler('005644')" >
          <Media class="disc1" url="/maps/map_disc1.gif"/>
          <Media class="disc2" url="/maps/map_disc2.gif" v-if="!$pageIsSpoiler('008131')" />
          <Media class="disc3" url="/maps/map_cartridge.gif" v-if="!$isNewReader" />
        </div>

      </div>
    </div>
    <div class="pageContent noMap" v-else>
      <h2 class="pageTitle">Adventure Maps</h2>
      <div class="adventureLinks">
        <div class="adventure"><a href="/map/4"><Media url="/images/archive_ps.gif" /><br>Problem Sleuth</a></div>
        <div class="adventure"><a href="/map/6"><Media url="/images/archive_hs.gif" /><br>Homestuck</a></div>
      </div>
    </div>
  </GenericPage>
</template>

<script>
import GenericPage from '@/components/UIElements/GenericPage.vue'
import Media from '@/components/UIElements/MediaEmbed.vue'

export default {
  name: 'mspaMap',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    Media,
    GenericPage
  },
  title(ctx) {
    const adventureTitle = [
      " - Jailbreak",
      " - Bard Quest",
      "",
      " - Problem Sleuth",
      " - Homestuck Beta",
      " - Homestuck"
    ][ctx.routeParams.mode - 1]
    return "Adventure Map" + (adventureTitle || '')
  },
  data: function() {
    return {}
  },
  computed: {
    isPSMap() {
      return this.routeParams.mode == '4'
    },
    psMap() {
      if (this.$isNewReader) {
        // if A is a spoiler, only show map B
        const map_map = [
          ['000302', '_01'],
          ['000402', '_02'],
          ['000448', '_03'],
          ['000546', '_04'],
          ['000604', '_05'],
          ['000666', '_06'],
          ['000742', '_07'],
          ['000816', '_08'],
          ['000873', '_09'],
          ['000953', '_10'],
          ['001030', '_11'],
          ['001069', '_12'],
          ['001149', '_13'],
          ['001257', '_14'],
          ['001299', '_15'],
          ['001406', '_16'],
          ['001466', '_17'],
          ['001507', '_18'],
          ['001589', '_19'],
          ['001655', '_20']
        ]
        for (const pair of map_map) {
          const [page, map_suffix] = pair
          if (this.$pageIsSpoiler(page)) {
            return `/maps/map_04${map_suffix}.gif`
          }
        }
      }
      return `/maps/map_04.gif`
    },
    isHSMap() {
      return this.routeParams.mode == '6'
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
  .adventureLinks {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
    margin: 0 auto;
    width: 600px;

    .adventure {
      margin-bottom: 20px;
      text-align: center;
      line-height: 1.1;
      font-size: 18px;
    }
  }
  .pageContent.psMap {
    width: auto;
  }

  .pageContent.hsMap {
    width: auto;
    line-height: 0;
    .mapFrame{
      background-color: #fff;
      display: flex;
      flex-flow: row nowrap;
      .sides, .parts, .discs, .act{
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
      }
      .parts {
        overflow: hidden;
        max-height: 12000px;
        .part4 {
          margin-top: 20px;
        }
      }
      .cutoff {
        & ~ * {
          display: none !important;
        }
      }
      .acts {
        .act {
          .mediaembed {
            display: block;
            margin-bottom: 3px;
          }
          .row {
            box-sizing: border-box;
            padding: 0 35px;
            width: 610px;
            display: flex;
            flex-flow: row nowrap;
            align-items: center;

            a {
              margin-right: 7.5px;
              &:nth-child(5n) {
                margin-right: 0;
              }
            }
          }
        }
      }
    }
  }
</style>
