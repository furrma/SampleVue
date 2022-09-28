import Permissions from '../constants/Permissions'

// ログイン
import ZCD0010 from '@/pages/Z/C/ZCD0010/ZCD0010.vue'

// 会社マスタ
import ZAD0010 from '@/pages/Z/A/ZAD0010/ZAD0010.vue'
import ZAD0010Detail from '@/pages/Z/A/ZAD0010/ZAD0010Detail.vue'

// 組織マスタ
import ZAD0020 from '@/pages/Z/A/ZAD0020/ZAD0020.vue'
import ZAD0020Detail from '@/pages/Z/A/ZAD0020/ZAD0020Detail.vue'

// ロールマスタ
import ZAD0040 from '@/pages/Z/A/ZAD0040/ZAD0040.vue'
import ZAD0040Detail from '@/pages/Z/A/ZAD0040/ZAD0040Detail.vue'

// ユーザーマスタ
import ZAD0050 from '@/pages/Z/A/ZAD0050/ZAD0050.vue'
import ZAD0050Detail from '@/pages/Z/A/ZAD0050/ZAD0050Detail.vue'

// 取引先マスタ
import ZAD0060 from '@/pages/Z/A/ZAD0060/ZAD0060.vue'
import ZAD0060Detail from '@/pages/Z/A/ZAD0060/ZAD0060Detail.vue'

// 協力会社マスタ
import ZAD0070 from '@/pages/Z/A/ZAD0070/ZAD0070.vue'
import ZAD0070Detail from '@/pages/Z/A/ZAD0070/ZAD0070Detail.vue'

// カレンダーマスタ
import ZAD0080 from '@/pages/Z/A/ZAD0080/ZAD0080.vue'
import ZAD0080Detail from '@/pages/Z/A/ZAD0080/ZAD0080Detail.vue'
import ZAD0080WorkTime from '@/pages/Z/A/ZAD0080/ZAD0080WorkTime.vue'

// プロジェクトコードマスタ
import ZBD0010 from '@/pages/Z/B/ZBD0010/ZBD0010.vue'
import ZBD0010Detail from '@/pages/Z/B/ZBD0010/ZBD0010Detail.vue'

// JOBコードマスタ(S2I)
import ZBD0020 from '@/pages/Z/B/ZBD0020/ZBD0020.vue'
import ZBD0020Detail from '@/pages/Z/B/ZBD0020/ZBD0020Detail.vue'

// 検索制限JOBコードマスタ
import ZBD0050 from '@/pages/Z/B/ZBD0050/ZBD0050.vue'
import ZBD0050Detail from '@/pages/Z/B/ZBD0050/ZBD0050Detail.vue'

// 備考コードマスタ
import ZBD0030 from '@/pages/Z/B/ZBD0030/ZBD0030.vue'
import ZBD0030Detail from '@/pages/Z/B/ZBD0030/ZBD0030Detail.vue'

// 行動予定表
import ZED0010 from '@/pages/Z/E/ZED0010/ZED0010.vue'
// import ZED0010Detail from '@/pages/Z/E/ZED0010/ZED0010Detail.vue'

// 弁当マスタ
import ZBD0040 from '@/pages/Z/B/ZBD0040/ZBD0040.vue'
import ZBD0040Detail from '@/pages/Z/B/ZBD0040/ZBD0040Detail.vue'

// 弁当注文マスタ
import DAD0010 from '@/pages/D/A/DAD0010/DAD0010.vue'
import DAD0010Detail from '@/pages/D/A/DAD0010/DAD0010Detail.vue'

// 弁当注文(管理者用)マスタ
import DAD0020 from '@/pages/D/A/DAD0020/DAD0020.vue'
import DAD0020Detail from '@/pages/D/A/DAD0020/DAD0020Detail.vue'

export default [
  // --------------------
  // ログイン
  // --------------------
  {
    name: 'login',
    path: '/login',
    component: ZCD0010,
    meta: {
      allowAnonymous: true,
      layout: 'auth'
    }
  },
  // --------------------
  // 会社マスタ
  // --------------------
  {
    path: '/ZAD0010',
    name: 'ZAD0010',
    component: ZAD0010,
    meta: {
      requirePermissions: [
        Permissions.COMPANIES_ADMIN
      ]
    }
  },
  {
    path: '/ZAD0010/new',
    name: 'ZAD0010-new',
    component: ZAD0010Detail,
    props: { mode: 'new' },
    meta: {
      requirePermissions: [
        Permissions.COMPANIES_ADMIN
      ]
    }
  },
  {
    path: '/ZAD0010/:companyCd',
    name: 'ZAD0010-detail',
    component: ZAD0010Detail,
    props: route => ({
      routeId: route.params.companyCd,
      mode: 'edit'
    }),
    meta: {
      requirePermissions: [
        Permissions.COMPANIES_ADMIN
      ]
    }
  },
  // --------------------
  // 組織マスタ
  // --------------------
  {
    path: '/ZAD0020',
    name: 'ZAD0020',
    component: ZAD0020,
    meta: {
      requirePermissions: [
        Permissions.ORGANIZATIONS_ADMIN
      ]
    }
  },
  {
    path: '/ZAD0020/new',
    name: 'ZAD0020-new',
    component: ZAD0020Detail,
    props: { mode: 'new' },
    meta: {
      requirePermissions: [
        Permissions.ORGANIZATIONS_ADMIN
      ]
    }
  },
  {
    path: '/ZAD0020/:organizationId',
    name: 'ZAD0020-detail',
    component: ZAD0020Detail,
    props: route => ({
      routeId: route.params.organizationId,
      mode: 'edit'
    }),
    meta: {
      requirePermissions: [
        Permissions.ORGANIZATIONS_ADMIN
      ]
    }
  },
  // --------------------
  // 協力会社マスタ
  // --------------------
  {
    path: '/ZAD0070',
    name: 'ZAD0070',
    component: ZAD0070,
    meta: {
      requirePermissions: [
        Permissions.ASSOCIATE_COMPANIES_ADMIN
      ]
    }
  },
  {
    path: '/ZAD0070/new',
    name: 'ZAD0070-new',
    component: ZAD0070Detail,
    props: { mode: 'new' },
    meta: {
      requirePermissions: [
        Permissions.ASSOCIATE_COMPANIES_ADMIN
      ]
    }
  },
  {
    path: '/ZAD0070/:companyCd',
    name: 'ZAD0070-detail',
    component: ZAD0070Detail,
    props: route => ({
      routeId: route.params.companyCd,
      mode: 'edit'
    }),
    meta: {
      requirePermissions: [
        Permissions.ASSOCIATE_COMPANIES_ADMIN
      ]
    }
  },
  // --------------------
  // ロールマスタ
  // --------------------
  {
    path: '/ZAD0040',
    name: 'ZAD0040',
    component: ZAD0040,
    meta: {
      requirePermissions: [
        Permissions.ROLES_ADMIN
      ]
    }
  },
  {
    path: '/ZAD0040/new',
    name: 'ZAD0040-new',
    component: ZAD0040Detail,
    props: { mode: 'new' },
    meta: {
      requirePermissions: [
        Permissions.ROLES_ADMIN
      ]
    }
  },
  {
    path: '/ZAD0040/:id',
    name: 'ZAD0040-detail',
    component: ZAD0040Detail,
    props: route => ({
      routeId: route.params.id,
      mode: 'edit'
    }),
    meta: {
      requirePermissions: [
        Permissions.ROLES_ADMIN
      ]
    }
  },
  // --------------------
  // ユーザーマスタ
  // --------------------
  {
    path: '/ZAD0050',
    name: 'ZAD0050',
    component: ZAD0050,
    meta: {
      requirePermissions: [
        Permissions.USERS_ADMIN
      ]
    }
  },
  {
    path: '/ZAD0050/new',
    name: 'ZAD0050-new',
    component: ZAD0050Detail,
    props: { mode: 'new' },
    meta: {
      requirePermissions: [
        Permissions.USERS_ADMIN
      ]
    }
  },
  {
    path: '/ZAD0050/:id',
    name: 'ZAD0050-detail',
    component: ZAD0050Detail,
    props: route => ({
      routeId: route.params.id,
      mode: 'edit'
    }),
    meta: {
      requirePermissions: [
        Permissions.USERS_ADMIN
      ]
    }
  },
  // --------------------
  // 取引先マスタ
  // --------------------
  {
    path: '/ZAD0060',
    name: 'ZAD0060',
    component: ZAD0060,
    meta: {
      requirePermissions: [
        Permissions.SUPPLIERS_ADMIN
      ]
    }
  },
  {
    path: '/ZAD0060/new',
    name: 'ZAD0060-new',
    component: ZAD0060Detail,
    props: { mode: 'new' },
    meta: {
      requirePermissions: [
        Permissions.SUPPLIERS_ADMIN
      ]
    }
  },
  {
    path: '/ZAD0060/:id',
    name: 'ZAD0060-detail',
    component: ZAD0060Detail,
    props: route => ({
      routeId: route.params.id,
      mode: 'edit'
    }),
    meta: {
      requirePermissions: [
        Permissions.SUPPLIERS_ADMIN
      ]
    }
  },
  // --------------------
  // プロジェクトコードマスタ
  // --------------------
  {
    path: '/ZBD0010',
    name: 'ZBD0010',
    component: ZBD0010,
    meta: {
      requirePermissions: [
        Permissions.PROJECT_CD_ADMIN,
        Permissions.PROJECT_CD_REFERENCE
      ],
      requireAll: false
    }
  },
  {
    path: '/ZBD0010/new',
    name: 'ZBD0010-new',
    component: ZBD0010Detail,
    props: { mode: 'new' },
    meta: {
      requirePermissions: [
        Permissions.PROJECT_CD_ADMIN
      ]
    }
  },
  {
    path: '/ZBD0010/:id',
    name: 'ZBD0010-detail',
    component: ZBD0010Detail,
    props: route => ({
      routeId: route.params.id,
      mode: 'edit'
    }),
    meta: {
      requirePermissions: [
        Permissions.PROJECT_CD_ADMIN
      ]
    }
  },
  // --------------------
  // JOBコードマスタ(S2I)
  // --------------------
  {
    path: '/ZBD0020',
    name: 'ZBD0020',
    component: ZBD0020,
    meta: {
      requirePermissions: [
        Permissions.JOB_CD_S2I_ADMIN,
        Permissions.JOB_CD_S2I_REFERENCE
      ],
      requireAll: false
    }
  },
  {
    path: '/ZBD0020/new',
    name: 'ZBD0020-new',
    component: ZBD0020Detail,
    props: { mode: 'new' },
    meta: {
      requirePermissions: [
        Permissions.JOB_CD_S2I_ADMIN
      ]
    }
  },
  {
    path: '/ZBD0020/:id',
    name: 'ZBD0020-detail',
    component: ZBD0020Detail,
    props: route => ({
      routeId: route.params.id,
      mode: 'edit'
    }),
    meta: {
      requirePermissions: [
        Permissions.JOB_CD_S2I_ADMIN
      ]
    }
  },
  // --------------------
  // 備考コードマスタ
  // --------------------
  {
    path: '/ZBD0030',
    name: 'ZBD0030',
    component: ZBD0030,
    meta: {
      requirePermissions: [
        Permissions.JOB_REMARKS_CD_ADMIN,
        Permissions.JOB_REMARKS_CD_REFERENCE
      ],
      requireAll: false
    }
  },
  {
    path: '/ZBD0030/:id',
    name: 'ZBD0030-list',
    component: ZBD0030,
    props: route => ({
      routeId: route.params.id,
      mode: 'list'
    }),
    meta: {
      requirePermissions: [
        Permissions.JOB_REMARKS_CD_ADMIN,
        Permissions.JOB_REMARKS_CD_REFERENCE
      ],
      requireAll: false
    }
  },
  {
    path: '/ZBD0030/:id/new',
    name: 'ZBD0030-new',
    component: ZBD0030Detail,
    props: route => ({
      routeId: route.params.id,
      mode: 'new'
    }),
    meta: {
      requirePermissions: [
        Permissions.JOB_REMARKS_CD_ADMIN
      ]
    }
  },
  {
    path: '/ZBD0030/:id/:jobRemarksCd',
    name: 'ZBD0030-detail',
    component: ZBD0030Detail,
    props: route => ({
      routeId: route.params.id,
      routeCd: route.params.jobRemarksCd,
      mode: 'edit'
    }),
    meta: {
      requirePermissions: [
        Permissions.JOB_REMARKS_CD_ADMIN
      ]
    }
  },
  // --------------------
  // 検索制限JOBコードマスタ
  // --------------------
  {
    path: '/ZBD0050',
    name: 'ZBD0050',
    component: ZBD0050,
    meta: {
      requirePermissions: [
        Permissions.JOB_SEARCH_RESTRICTIONS_ADMIN
      ]
    }
  },
  {
    path: '/ZBD0050/:id',
    name: 'ZBD0050-detail',
    component: ZBD0050Detail,
    props: route => ({
      routeId: route.params.id,
      mode: 'edit'
    }),
    meta: {
      requirePermissions: [
        Permissions.JOB_SEARCH_RESTRICTIONS_ADMIN
      ]
    }
  },
  // --------------------
  // 行動予定表
  // --------------------
  {
    path: '/ZED0010',
    name: 'ZED0010',
    component: ZED0010
  },
  // {
  //   path: '/ZED0010/new',
  //   name: 'ZED0010-new',
  //   component: ZED0010Detail,
  //   props: { mode: 'new' }
  // },
  // {
  //   path: '/ZED0010/:id',
  //   name: 'ZED0010-detail',
  //   component: ZED0010Detail,
  //   props: route => ({
  //     routeId: route.params.id,
  //     mode: 'edit'
  //   })
  // },
  // --------------------
  // カレンダーマスタ
  // --------------------
  {
    path: '/ZAD0080',
    name: 'ZAD0080',
    component: ZAD0080
  },
  {
    path: '/ZAD0080Detail/:calendarId',
    name: 'ZAD0080-detail',
    component: ZAD0080Detail,
    props: route => ({
      routeId: route.params.calendarId
    }),
    meta: {
      requirePermissions: [
        Permissions.CALENDARS_ADMIN
      ]
    }
  },
  {
    path: '/ZAD0080WorkTime/:calendarId',
    name: 'ZAD0080-work-time',
    component: ZAD0080WorkTime,
    props: route => ({
      routeId: route.params.calendarId
    }),
    meta: {
      requirePermissions: [
        Permissions.CALENDARS_ADMIN
      ]
    }
  },
  // --------------------
  // 弁当マスタ
  // --------------------
  {
    path: '/ZBD0040',
    name: 'ZBD0040',
    component: ZBD0040,
    meta: {
      requirePermissions: [
        Permissions.LUNCH_ADMIN
      ]
    }
  },
  {
    path: '/ZBD0040/new',
    name: 'ZBD0040-new',
    component: ZBD0040Detail,
    props: { mode: 'new' },
    meta: {
      requirePermissions: [
        Permissions.LUNCH_ADMIN
      ]
    }
  },
  {
    path: '/ZBD0040/:id',
    name: 'ZBD0040-detail',
    component: ZBD0040Detail,
    props: route => ({
      routeId: route.params.id,
      mode: 'edit'
    }),
    meta: {
      requirePermissions: [
        Permissions.LUNCH_ADMIN
      ]
    }
  },
  // --------------------
  // 弁当注文(管理者用)マスタ
  // --------------------
  {
    path: '/DAD0010',
    name: 'DAD0010',
    component: DAD0010
  },
  {
    path: '/DAD0010/:date',
    name: 'DAD0010-detail',
    component: DAD0010Detail,
    props: route => ({
      routeDate: route.params.date,
      mode: 'edit'
    })
  },
  {
    path: '/DAD0010Detail',
    name: 'DAD0010-detail',
    component: DAD0010Detail
  },
  // --------------------
  // 弁当注文(管理者用)マスタ
  // --------------------
  {
    path: '/DAD0020',
    name: 'DAD0020',
    component: DAD0020,
    meta: {
      requirePermissions: [
        Permissions.LUNCH_ORDER_ADMIN
      ]
    }
  },
  {
    path: '/DAD0020/:userId/:date',
    name: 'DAD0020-detail',
    component: DAD0020Detail,
    props: route => ({
      routeId: route.params.userId,
      routeDate: route.params.date,
      mode: 'edit'
    }),
    meta: {
      requirePermissions: [
        Permissions.LUNCH_ADMIN
      ]
    }
  },
  {
    path: '/DAD0020Detail',
    name: 'DAD0020-detail',
    component: DAD0020Detail
  }
]
