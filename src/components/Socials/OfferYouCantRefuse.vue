<template>
<div class="body">
  <div style="text-align:left;width:743px;">
    <NavBanner />
    <h2 style="text-align:left;">An Offer You Can't Refuse</h2>
    <h2 style="text-align:left;">06/11/06</h2>
    <div style="text-align:left;">
    <div style="text-align:left;width:743px;">
    <p style="text-align:left;">
    So I was slammin’ the web 
    pretty hard the other day, cruisin’ some giga-surfs, browsin’ some 
    mad-layouts, or “grooming the hypertext pony”, if you know what I mean. I
    was doing all that good stuff, when this thing appeared on my monitor.
    </p>
    <p style="text-align:left;">
    <MediaEmbed url="/archive/social/blogspot/oldblog/olivegarden.jpg" style="height:370px;width:743px;text-align:left;" />
    </p>
    <p style="text-align:left;">This
    amazing offer sent violent tremors of delight down my spinal column. 
    Such was my enthusiasm, I momentarily forgot to wonder why Firefox, a 
    theoretically pop-up blocking browser, failed to block this one. But 
    there was no time to investigate that. Haunting visions of Olive 
    Garden’s legendary bread sticks were gamboling about my brain, 
    paralyzing me with their garlicky aroma, undressing me in preparation of
    the imminent gang rape. Luckily I halted that fantasy before it got 
    ugly, but now it was time to address this “offer”.

    </p>
    <p style="text-align:left;">There
    are two irresistible things about the offer. One, of course, is the 
    anticipation of cramming vast helpings of already bargain-priced pasta 
    for the dime-savvy family into my face for FREE. The other is the 
    irresistible opportunity to voice my undoubtedly strong opinion on this 
    controversial president to some faceless spam conglomerate. This was 
    very clever of them, because whenever I see an outlet for my strong 
    opinions, no amount of personal willpower will prevent me from 
    broadcasting my viewpoint. It doesn’t matter if doing so will seem 
    inappropriate, inconvenient, or even personally endangering, if there is
    a toilet somewhere for my opinion, I am first in line to flush it down.
    If I were walking through the woods and there were two bear traps on 
    the ground, labeled “Is Bush a good leader? YES: Smash face into left 
    trap, NO: smash face into right” the rusted steel and my mug would be 
    wed without a moment’s pause.</p>
    <p style="text-align:left;">And
    I especially appreciate this format of opinion solicitation for its 
    simplicity. I no longer need to wage the uphill battle against my brain 
    to come up with insightful justification for my opinion. I don’t even 
    need to say anything! I just need to click a button, and as if offering a
    spammer my strong opinion weren’t gratification enough in itself, my 
    reward is all the soup, salad and bread sticks my digestive system is 
    coerced to handle!
    </p>
    <p style="text-align:left;">But
    as the mouse cursor hovers over my opinion of choice, before I click, 
    something unsettling occurs to me. Is there a right or wrong answer? I 
    am properly absorbed in my own political beliefs, and treat them as part
    of my identity as any good American should. They aren’t very well 
    thought through, and comprise a bizarre cocktail of ill-founded self 
    righteousness, irrational biases, and flagrant misinformation, but damn 
    it, they’re MY half-assed opinions. As such, I feel a certain ethical 
    contraction in contemplating “throwing” this poll in favor of free 
    pasta. And even though I’m an honorable man, and by an ass-backwards 
    ideology I think a lot of colonial-looking guys in wigs were skewered by
    imperial bayonets for my right to stubbornly believe in retarded 
    things, it would sure be a damned shame to let that Olive Garden coupon 
    go to waste. I don’t know who is running this “poll”, maybe someone from
    the “Left Coast”, who daily pores through the poll logs while sitting 
    in his Jacuzzi, getting a tan, wrapped in seaweed while hugging a tree 
    and saving a penguin or something, stumbles on my “YES” vote and says 
    “Sorry buddy, you just cost yourself some steaming, succulent chicken 
    alfredo.” Or maybe it’s Karl Rove himself evaluating the answers. He 
    sees my “NO”, hits the delete key and says “Pasta la vista, dipshit!” 
    and chuckles to himself over his wordplay, while stuffing some shrimp 
    primavera into his corpulent face to sort of rub it in.</p>
    <p style="text-align:left;">In
    the end, I have no way of knowing, and this is as good a reason as any 
    not to compromise my morals. I go with my gut answer, and sure enough, 
    it worked! The free* Olive Garden meals were mine!</p>
    <p style="text-align:left;">*with participation in their program and completion of one sponsored offer.</p>
    <p style="text-align:left;">Feeling
    high on this victory, I went through the various protocols that were 
    asked of me to acquire the coupon, and after installing a variety of 
    exotic, system crippling spyware, and signing up for numerous premium 
    accounts for porn sites, I can expect my coupon in the mail in six to 
    eight weeks.</p>
    <p style="text-align:left;">But
    all this talk of Olive Garden really got me in the mood for it now, so I
    just went out and bought my own damn dinner. It was pretty heavy, and I
    think I filled up on breadsticks too fast. I probably won’t be in the 
    mood for Olive Garden for another year or so.</p>
    <p style="text-align:left;">&nbsp;</p></div>
  </div>
  </div>
</div>
</template>

<script>
// @ is an alias to /src
import MediaEmbed from '@/components/UIElements/MediaEmbed.vue'
import NavBanner from '@/components/UIElements/NavBanner.vue'

export default {
  name: 'OfferYouCantRefuse',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    MediaEmbed,
    NavBanner
  },
  title: () => "An Offer You Can't Refuse",
  data: function() {
    return {
    }
  },
  computed: {
  },
  methods:{
  }
}
</script>


<style lang="scss" scoped>
 .body {
    background: white;
    font: 16px normal Verdana, Geneva, Tahoma, sans-serif;
    height: 100vh;
    @media only screen and (max-height: 1555px) {
      height: auto;
    }
    >div{
        margin: 0 auto 24px;
        .navBanner {
            width: 100%;
        }
        p, h2 {
            margin-top: 16px;
        }
    }
 }
</style>