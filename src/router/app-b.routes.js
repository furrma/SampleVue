// 勤怠・工数入力
import BBD0010 from '@/pages/B/B/BBD0010/BBD0010.vue'
import BBD0020 from '@/pages/B/B/BBD0020/BBD0020.vue'
import BBD0030 from '@/pages/B/B/BBD0030/BBD0030.vue'
import BBD0040 from '@/pages/B/B/BBD0040/BBD0040.vue'
import BCD0020 from '@/pages/B/C/BCD0020/BCD0020.vue'
import BCD0020Detail from '@/pages/B/C/BCD0020/BCD0020Detail.vue'
import BCD0060 from '@/pages/B/C/BCD0060/BCD0060.vue'

export default [
  // --------------------
  // 勤怠・工数入力
  // --------------------
  {
    path: '/BBD0010',
    name: 'BBD0010',
    component: BBD0010
  },
  // --------------------
  // 勤怠・工数検収
  // --------------------
  {
    path: '/BBD0020',
    name: 'BBD0020-accept',
    component: BBD0020,
    props: { mode: 'accept' }
  },
  // --------------------
  // 勤怠・工数検収一覧
  // --------------------
  {
    path: '/BBD0010/list',
    name: 'BBD0020-list',
    component: BBD0020,
    props: { mode: 'list' }
  },
  // --------------------
  // 工数振替
  // --------------------
  {
    path: '/BBD0030',
    name: 'BBD0030',
    component: BBD0030
  },
  // --------------------
  // 勤怠集計
  // --------------------
  {
    path: '/BBD0040',
    name: 'BBD0040',
    component: BBD0040
  },
  // --------------------
  // 工数分析 JOB詳細
  // --------------------
  {
    path: '/BCD0020',
    name: 'BCD0020',
    component: BCD0020
  },
  {
    path: '/BCD0020/:id',
    name: 'BCD0020-detail',
    component: BCD0020Detail,
    props: route => ({
      routeId: route.params.id
    }),
    meta: {
      requirePermissions: [
      ]
    }
  },
  // --------------------
  // 工数分析_工数売上締処理
  // --------------------
  {
    path: '/BCD0060',
    name: 'BCD0060',
    component: BCD0060
  }
]
