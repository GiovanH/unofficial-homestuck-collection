import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// Generally speaking, routes aren't necessary to get a page working in this application.
// If it doesn't have any subsequent routes, then you don't have to add it here at all! As long as it's defined in TabFrame.vue, you can run it just fine.
// The router here is basically just used as a quick and dirty way to implement parameters and redirects.
// If your page needs to use a url parameter, define it below. You'll be able to access it from your component through the 'routeParams' prop.
// This is also the best place to set up URL redirects, since the router can do the ol' switcheroo before the program itself does anything with it.

// Keep in mind that 'base' is used as a reserved property that always refers to the first section of the url. Don't use it in your routing, or you'll overwrite it!

const routes = [
  {
    path: '/map/:mode',
    props: true
  },
  {
    path: '/log/:mode',
    props: true
  },
  {
    path: '/help/:mode',
    props: true
  },
  {
    path: '/search/:query',
    props: true
  },
  {
    path: '/credits/:mode',
    props: true,
    children: [
      {
        path: '/credits/soundcredits',
        redirect: '/music/features'
      }
    ]
  },
  {
    path: '/mspa',
    props: true,
    children: [
      {
        path: '',
        redirect: '001901'
      },
      {
        path: '1',
        redirect: '000002'
      },
      {
        path: '2',
        redirect: '000136'
      },
      {
        path: '3',
        redirect: 'mc0001'
      },
      {
        path: '4',
        redirect: '000219'
      },
      {
        path: '5',
        redirect: '001893'
      },
      {
        path: '6',
        redirect: '001901'
      },
      {
        path: ':p'
      }
    ]
  },
  {
    path: '/jailbreak',
    props: true,
    children: [
      {
        path: '',
        redirect: '1'
      },
      {
        path: ':p'
      }
    ]
  },
  {
    path: '/bard-quest',
    props: true,
    children: [
      {
        path: '',
        redirect: '1'
      },
      {
        path: ':p'
      }
    ]
  },
  {
    path: '/blood-spade',
    props: true,
    children: [
      {
        path: '',
        redirect: '1'
      },
      {
        path: ':p'
      }
    ]
  },
  {
    path: '/problem-sleuth',
    props: true,
    children: [
      {
        path: '',
        redirect: '1'
      },
      {
        path: ':p'
      }
    ]
  },
  {
    path: '/beta',
    props: true,
    children: [
      {
        path: '',
        redirect: '1'
      },
      {
        path: ':p'
      }
    ]
  },
  {
    path: '/story/:p',
    redirect: '/homestuck/:p'
  },
  {
    path: '/homestuck',
    props: true,
    children: [
      {
        path: '',
        redirect: '1'
      },
      {
        path: ':p'
      }
    ]
  },
  {
    path: '/disc2',
    redirect: '/mspa/005644'
  },
  {
    path: '/disc2fixed',
    redirect: '/mspa/005985'
  },
  {
    path: '/ryanquest',
    props: true,
    children: [
      {
        path: '',
        redirect: '000001'
      },
      {
        path: ':p',
      }
    ]
  },
  {
    path: '/waywardvagabond/:p',
    props: true
  },
  {
    path: '/faqs/:p',
    props: true
  },
  {
    path: '/unlock/:p',
    props: true
  },
  {
    path: '/decode/:mode',
    props: true
  },
  {
    path: '/dstrider/:id',
    props: true
  },
  {
    path: '/blogspot/:id',
    props: true
  },
  {
    path: '/formspring/:id',
    props: true
  },
  {
    path: '/tumblr/:id',
    props: true
  },
  {
    path: '/news/:id',
    props: true
  },
  {
    path: '/settings/:sec',
    props: true
  },
  {
    path: '/music',
    props: true,
    children: [
      {
        path: ':mode',
        children: [
          {
            path: '/music/track',
            redirect: '/music'
          },
          {
            path: '/music/album',
            redirect: '/music'
          },
          {
            path: ':id'
          }
        ]
      }
    ]
  },
  {
    path: '/sbahj',
    alias: '/sweetbroandhellajeff',
    props: true,
    children: [
      {
        path: '',
        redirect: '1'
      },
      {
        path: ':cid',
      }
    ]
  },
  {
    path: '/pxs/:cid',
    props: true,
    children: [
      {
        path: '',
        redirect: '1'
      },
      {
        path: ':pid',
      },
    ]
  },
  {
    path: '/tso/:cid',
    props: true,
    children: [
      {
        path: '',
        redirect: '1'
      },
      {
        path: ':pid',
      },
    ]
  },
  {
    path: '/snaps/:cid',
    props: true,
    children: [
      {
        path: '',
        redirect: '1'
      },
      {
        path: ':pid',
      },
    ]
  },
  {
    path: '/namcohigh/:play',
    props: true
  },
  {
    path: '/skaianet/:cursed_history',
    props: true
  }
]

const router = new VueRouter({
  routes
})

export default router
