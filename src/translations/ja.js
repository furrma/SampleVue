export default {
  // --------------------
  // アプリケーション
  // --------------------
  app: {
    productName: 'S2I System',
    productCatchphrase: 'Building Solutions, Driven by Your Dreams.'
  },

  // --------------------
  // 共通
  // --------------------
  common: {
    active: '有効',
    add: '追加',
    all: '全て',
    edit: '編集',
    ok: 'OK',
    cancel: 'キャンセル',
    close: '閉じる',
    delete: '削除',
    disabled: '無効',
    keywords: 'キーワード',
    save: '保存',
    select: '選択',
    switchtrue: 'ON',
    switchfalse: 'OFF',
    search: '検索',
    next: '次へ',
    previous: '前へ'
  },

  // --------------------
  // メニュー
  // --------------------
  menu: {
    categories: {
      Y: '設定'
    },
    dashboard: 'ダッシュボード',
    notifications: '通知',
    sandbox: 'サンドボックス',
    usersearchui: 'ユーザー検索UI',
    jobcdsearchui: 'JOBコード検索UI',
    filterSample: 'フィルターサンプル',
    portalSample: 'ポータルサンプル',
    logout: 'ログアウト',
    profile: 'プロフィール',
    ZAD0010: '会社',
    ZAD0070: '協力会社',
    ZAD0040: 'ロール',
    ZAD0050: 'ユーザー',
    ZAD0020: '組織マスタ',
    ZAD0080: 'カレンダーマスタ',
    ZBD0010: 'プロジェクトコード',
    ZBD0020: 'JOBコード(S2I)',
    ZBD0030: '備考コード',
    ZBD0050: '検索制限JOBコードマスタ',
    ZAD0060: '取引先',
    ZED0010: '行動予定表',
    ZBD0040: '弁当',
    DAD0010: '弁当注文',
    DAD0020: '弁当注文(管理者)',
    BBD0010: '勤怠･工数入力',
    BBD0020: '勤怠･工数承認 検収処理',
    BBD0030: '勤怠･工数承認 工数振替',
    BBD0040: '勤怠集計',
    BCD0020: '工数分析 JOB詳細',
    BCD0060: '工数分析 工数売上締処理'
  },

  toolbarNotifications: {
    title: '通知',
    seeAll: '全て見る',
    noData: '通知はありません。'
  },

  // --------------------
  // 通知
  // --------------------
  notifications: {
    title: '通知',
    markAsRead: '既読にする',
    markAsUnread: '未読にする',
    isRead: {
      unread: '未読',
      read: '既読',
      all: '全て'
    },
    noData: '通知はありません。',
    noSelection: '通知を選択してください。'
  },

  // --------------------
  // ログイン
  // --------------------
  ZCD0010: {
    companyCd: '会社',
    userCd: 'ユーザーID',
    password: 'パスワード',
    login: 'ログイン'
  },

  // --------------------
  // 会社マスタ
  // --------------------
  ZAD0010: {
    title: '会社',
    companyCd: '会社コード',
    companyName: '会社名',
    postalCd: '郵便番号',
    address: '住所',
    phoneNo: '電話番号',
    faxNo: 'FAX',
    isActive: '有効',
    companyInfo: '会社情報'
  },

  // --------------------
  // 協力会社マスタ
  // --------------------
  ZAD0070: {
    title: '協力会社',
    companyInfomation: '協力会社情報',
    companyCd: '協力会社CD',
    companyName: '協力会社名',
    postalCd: '郵便番号',
    address: '住所',
    phoneNo: '電話番号',
    faxNo: 'Fax',
    isActive: '有効'
  },

  // --------------------
  // ロールマスタ
  // --------------------
  ZAD0040: {
    title: 'ロール',
    id: 'ID',
    role: 'ロール',
    roleName: 'ロール名',
    description: '説明',
    isActive: '有効',
    roleInfo: 'ロール情報',
    rolePermissions: 'ロール権限設定',
    permissionCd: '権限コード',
    permissionName: '権限名'
  },

  // --------------------
  // ユーザーマスタ
  // --------------------
  ZAD0050: {
    title: 'ユーザー',
    companyCd: '会社',
    companyName: '会社',
    userCd: 'ユーザーコード',
    employeeNo: '社員番号',
    userName: 'ユーザー名',
    userNameEn: 'ユーザー名(英)',
    email: 'メールアドレス',
    userInfo: 'ユーザー情報',
    associateCompanyInfo: '協力会社情報',
    organizations: '組織',
    organizationCds: '組織コード',
    organizationNames: '組織名',
    affiliationOrganizations: '所属組織',
    roleNames: '権限名',
    ownedRoles: '保有権限',
    occupationClass: '職種区分',
    location: '所在地',
    initiationDate: '入社年月日',
    birthday: '生年月日',
    password: 'パスワード',
    isEnrolled: {
      name: '在籍状況',
      true: '在籍中',
      false: '休職中'
    },
    role: 'ロール',
    extensionNo: '内線番号',
    isActive: '有効',
    systemControl: 'システム制御',
    isUnnecessaryInputAttendance: {
      name: '勤怠入力不要',
      true: '不要',
      false: '必要'
    },
    isUnnecessaryInputManHours: {
      name: '工数入力不要',
      true: '不要',
      false: '必要'
    },
    isAdAccount: {
      name: 'ADユーザー',
      true: 'YES',
      false: 'NO'
    },
    isAdmin: {
      name: '管理者',
      true: 'ON',
      false: 'OFF'
    },
    associateCompany: '協力会社情報',
    isInputAssociateCompanyInfo: {
      name: '協力会社情報',
      true: 'ON',
      false: 'OFF'
    },
    associateCompanies: '協力会社',
    associateCompanyCd: '協力会社コード',
    associateCompanyName: '協力会社名',
    outsourcingContractClass: '外注契約区分',
    outsourcingOccupationClass: '外注職種区分',
    upperLimitHour: '上限(h)',
    lowerLimitHour: '下限(h)',
    contractLimitDate: '契約期限日付',
    contractUnitPrice: '契約単価(/h)',
    contractFixedCost: '固定費',
    remarks: '備考',
    requiredMessage: '1つ以上選択してください。',
    userSubtitleUser: '－－ユーザー情報設定－－－－－',
    userSubtitleRelation: '－－ユーザー関連付け情報－－－－－',
    userSubtitleSystem: '－－システム制御設定－－－－－',
    otherActions: '他の操作',
    resetPasswordDescription: '表示ユーザーのパスワードリセットを行います。',
    resetPassword: 'パスワードリセット',
    resetPasswordConfirmTitle: 'パスワードリセットを行います。よろしいですか？',
    resetPasswordConfirmSentence: '現在のパスワードはランダム生成されたパスワードに変更されます。よろしいですか？',
    resetPasswordCompleteTitle: 'パスワードリセットが完了しました。',
    resetPasswordCompleteSentence: '下記がリセット後のパスワードです。次回からこのパスワードを使用してシステムにログインしてください。\n'
  },

  // --------------------
  // 組織マスタ
  // --------------------
  ZAD0020: {
    title: '組織マスタ',
    organizationCd: '組織コード',
    organizationClassCd: '組織区分',
    organizationClassName: '組織区分',
    companyCd: '会社',
    companyName: '会社名',
    organizationName: '組織名',
    organizationParentCd: '親組織コード',
    organizationParentName: '親組織コード',
    organizationLeaderCd: '組織長コード',
    organizationLeaderName: '組織長',
    isActive: '有効',
    organizationInfo: '組織情報'
  },

  // --------------------
  // 取引先マスタ
  // --------------------
  ZAD0060: {
    title: '取引先',
    supplierCd: '取引先コード',
    supplierName: '取引先名',
    supplierClass: '取引先区分',
    supplierDiv: '取引先部署',
    supplierManager: '取引先担当',
    salesRepUserId: '担当営業ユーザー',
    postalCd: '郵便番号',
    address: '住所',
    phoneNo: '電話番号',
    faxNo: 'FAX',
    paymentTerms: '支払条件',
    isActive: '有効',
    supplierInfo: '取引先情報'
  },

  // --------------------
  // カレンダーマスタ
  // --------------------
  ZAD0080: {
    title: 'カレンダーマスタ',
    businessYear: '年度',
    company: '会社',
    calendarName: 'カレンダー名',
    isActive: '有効',
    workingTimeReg: '勤務時間登録',
    calendarInfo: 'カレンダー情報',
    workTimeInfo: '勤務時間情報',
    headerCalendarDate: '日付',
    headerCalendarClass: '日付区分',
    headerCalendarEvent: 'イベント',
    headerWorkTime: '勤務時間帯',
    headerWorkTimeClass: '勤務時間区分',
    headerWorkStart: '勤務記録開始位置'
  },

  // --------------------
  // プロジェクトコードマスタ
  // --------------------
  ZBD0010: {
    title: 'プロジェクトコード',
    info: 'プロジェクトコード情報',
    companyCd: '会社コード',
    companyName: '会社名',
    projectCd: 'プロジェクトコード',
    projectName: 'プロジェクト名',
    isOnlyDevNotEnd: '未完了JOBコードのみ',
    isActive: '有効',
    jobCd: 'JOBコード',
    jobName: '案件名',
    orderAmount: '受注金額',
    devAmount: '開発有効金額',
    inTargetAmount: '(内)目標金額',
    outTargetAmount: '(外)目標金額',
    devStartDate: '開発開始年月',
    devEndDate: '開発終了年月',
    pmUserName: 'PMユーザー名',
    company: '会社'
  },

  // --------------------
  // JOBコード（S2I）マスタ
  // --------------------
  ZBD0020: {
    title: 'JOBコード(S2I)',
    info: 'JOBコード情報',
    searchDetails: {
      title: '詳細検索条件',
      isUnregistered: 'PM登録情報が未登録のJOBコードを対象とする',
      isIncludeSalesSupport: '営業支援JOBコードを含む',
      isOnlyTentative: '仮JOBコードのみを対象とする',
      isIncludeDevEnd: '開発終了JOBコードを含む',
      isOnlyPOC: '工事進行基準を対象とする'
    },
    actions: {
      header: 'アクション',
      jobCdRemark: '備考コード編集',
      jobCdRelationalUser: 'JOBコードとユーザーの紐付け',
      jobCdCopy: 'JOBコード情報コピー'
    },
    jobCd: 'JOBコード',
    supplier: '取引先',
    supplierName: '取引先',
    jobName: '案件名',
    amountDetail: '金額詳細',
    orderAmount: '受注金額 (円)',
    managementCost: '管理費 (円)',
    devAmount: '開発有効金額 (円)',
    inTargetAmount: '(内) 目標金額',
    outTargetAmount: '(外) 目標金額',
    dateDetail: '日付詳細',
    devStartDate: '開発開始年月',
    devEndDateInitial: '開発終了年月(初回登録時)',
    devEndDate: '開発終了年月',
    expectedBillingDate: '請求予定年月',
    billingDate: '請求日',
    userDetail: '担当ユーザー',
    selUserName: '営業担当ユーザー',
    pmUserName: 'PMユーザー',
    companyCd: '会社',
    supplierId: '取引先',
    contractType: '契約形態区分',
    estimatePersonDay: '見積工数',
    estimatePersonDaySuffix: '(人日)',
    jobCdProperty: 'JOBコード設定',
    isDevEnd: {
      name: '開発終了フラグ',
      true: '開発済み',
      false: '未完了'
    },
    isSalesSupport: {
      name: '営業支援フラグ',
      true: '営業支援コード',
      false: '実JOBコード'
    },
    isTentative: {
      name: '仮フラグ',
      true: '仮JOBコード',
      false: '実JOBコード',
      hint: '仮JOBコードは、前倒しで対応しているJOBコードが対象になります。受注が来たら手動でスイッチを変更し、実JOBコードにして下しさい。'
    },
    isInHouse: {
      name: '社内フラグ',
      true: '仮JOBコード',
      false: '実JOBコード',
      hint: ''
    },
    isPoc: {
      name: '工事進行基準',
      true: '対象',
      false: '対象外',
      hint: ''
    },
    isAvailable: {
      name: '工数入力可能フラグ',
      true: '可能',
      false: '不可能',
      hint: ''
    },
    isWork: {
      name: '実働工数フラグ',
      true: '対象',
      false: '対象外',
      hint: ''
    }
  },

  // --------------------
  // 備考コードマスタ
  // --------------------
  ZBD0030: {
    title: '備考コード',
    info: '備考コード情報',
    jobCd: 'JOBコード',
    supplierName: '客先',
    jobName: '案件名',
    jobRemarksCd: '備考コード',
    jobRemarksName: '備考コード名',
    isActive: '有効'
  },

  // --------------------
  // 検索制限JOBコードマスタ
  // --------------------
  ZBD0050: {
    title: '検索制限JOBコード',
    info: '検索制限JOBコード情報',
    jobCd: 'JOBコード',
    supplierName: '客先',
    jobName: '案件名',
    jobRemarksCd: '備考コード',
    jobRemarksName: '備考コード名',
    pmUserName: 'PMユーザー',
    searchableUser: '検索可能ユーザー',
    isActive: '有効'
  },

  // --------------------
  // 行動予定表
  // --------------------
  ZED0010: {
    title: '行動予定表',
    info: '登録/編集',
    today: '今日',
    tomorrow: '明日',
    specified: '指定日',
    specifiedDay: '指定日',
    specifiedTeam: '指定期間',
    specifiedTeamStart: '開始日',
    specifiedTeamEnd: '終了日',
    others: 'その他',
    specifiedTeamWavyLine: '  ～  ',
    userNames: '氏名',
    destination: '行先',
    date: '日付',
    startTime: '開始時間',
    endTime: '終了時間',
    start: '開始',
    end: '終了',
    actions: '操作',
    user: 'ユーザー',
    weeksRegularly: '繰り返し対象曜日',
    isMonday: '月',
    isTuesday: '火',
    isWednesday: '水',
    isThursday: '木',
    isFriday: '金',
    isSaturday: '土',
    isSunday: '日',
    registrationSchedule: '行動予定表登録先',
    goDirectly: '直行',
    returnDirectly: '直帰',
    isRegularly: '予定時間を定期的に繰り返す',
    isRegularlyHint: 'チェックを入れると、上記期間の間、開始日と終了日が繰り返されます。'
  },

  // --------------------
  // 弁当マスタ
  // --------------------
  ZBD0040: {
    title: '弁当',
    lunchInfomation: '弁当情報',
    lunchName: '弁当名',
    price: '金額',
    isOrderBeforeDate: '前日注文',
    lunchInfo: '弁当情報'
  },
  // --------------------
  // 弁当注文マスタ
  // --------------------
  DAD0010: {
    title: '弁当注文',
    lunchOrderInfo: '弁当注文情報',
    orderDate: '注文日',
    deliveryLocation: '配膳先',
    lunch: '弁当',
    amount: '数量',
    menu: 'メニュー'
  },
  // --------------------
  // 弁当注文(管理者)マスタ
  // --------------------
  DAD0020: {
    title: '弁当注文(管理者)',
    lunchOrderInfo: '弁当注文情報',
    user: 'ユーザー',
    orderDate: '注文日',
    deliveryLocation: '配膳先',
    lunchName: '弁当名',
    price: '金額',
    amount: '数量',
    menu: 'メニュー'
  },

  // --------------------
  // 勤怠･工数入力
  // --------------------
  BBD0010: {
    title: '勤怠･工数入力'
  },

  // --------------------
  // 勤怠･工数承認 検収処理
  // --------------------
  BBD0020: {
    title: '勤怠･工数承認 検収処理',
    titleList: '工数入力サマリ(仮)',
    targetYearMonth: '対象年月',
    team: '所属',
    user: 'ユーザー',
    checkAll: '一括チェック',
    acceptance: '検収',
    attendanceClass: '勤怠区分',
    jobCdSummary: '計',
    workTimeSummary: '労働時間計',
    overTimeSummary: '全残業計',
    midnightOverSummary: '内深夜残業'
  },

  // --------------------
  // 勤怠･工数承認 工数振替
  // --------------------
  BBD0030: {
    title: '勤怠･工数承認 工数振替',
    startDate: '開始日付',
    endDate: '終了日付',
    jobCd: 'ジョブコード*',
    jobDetailCd: 'ジョブ詳細コード',
    jobRemarksCd: 'ジョブ備考コード',
    do: '実行',
    userSearch: 'ユーザー検索',
    jobFrom: '振替対象',
    jobTo: '振替先'
  },

  // --------------------
  // 勤怠･工数入力
  // --------------------
  BBD0040: {
    title: '勤怠集計'
  },

  // --------------------
  // 工数分析 JOB詳細
  // --------------------
  BCD0020: {
    title: '工数分析 JOB詳細',
    info: '工数分析 JOB詳細',
    // テーブル項目
    jobCd: 'JOBコード',
    supplierName: '客先',
    jobName: '案件名',
    jobRemarksCd: '備考コード',
    jobRemarksName: '備考コード名',
    targetMonth: '対象年月',
    orderAmount: '受注金額(円)',
    devAmount: '開発有効金額(円)',
    inTargetAmount: '(内)目標金額 (円)',
    outTargetAmount: '(外)目標金額 (円)',
    inActualAmount: '(内)実績工数金額 (円)',
    outActualAmount: '(外)実績工数金額 (円)',
    diffTargetAmount: '目標金額差異 (円)',
    diffDevAmount: '開発有効金額差異 (円)',
    actualMonthManHours: '月実績工数 (h)',
    actualMonthManHourAmount: '月実績工数金額 (円)',
    actualTotalManHours: '累計実績工数 (h)',
    actualTotalManHourAmount: '累計実績工数金額 (円)',
    actualTotalPocAmount: '累計発生金額 (円)',
    pmUserName: 'PMユーザー',
    pmUserOrganizations: 'PMユーザー所属組織',
    createdDate: 'JOB発行日',
    salesUserName: '営業担当ユーザー',
    devStartDate: '開発開始日',
    devEndDate: '開発終了年月',
    expectedBillingDate: '請求予定年月',
    billingDate: '請求日',
    // 検索絞り込み項目
    partialMatchJobCd: 'JOBコード(部分一致)',
    organization: '組織',
    isFilteringJobCd: '対象JOBコード検索',
    isFilteringMonth: '対象年月検索',
    isFilterActiveJobCd: '有効JOBとして',
    isFilterDevEndJobCd: '開発終了予定として',
    isFilterIssueJobCd: '発行月として',
    pmUser: 'PMユーザー',
    isSalesSupport: {
      label: '営業支援コード',
      only: 'のみ',
      include: '包含',
      exclude: '除外'
    },
    isTentative: {
      label: '仮JOBコード',
      only: 'のみ',
      include: '包含',
      exclude: '除外'
    },
    isInHouse: {
      label: '社内コード',
      only: 'のみ',
      include: '包含',
      exclude: '除外'
    },
    isPoc: {
      label: '工事進行基準対象',
      only: 'のみ',
      include: '包含',
      exclude: '除外'
    },
    isDevEnd: {
      label: '開発終了JOBコード',
      only: 'のみ',
      include: '包含',
      exclude: '除外'
    },
    total: '合計'
  },

  // --------------------
  // 勤怠･工数入力
  // --------------------
  BCD0060: {
    title: '工数分析 工数売上締処理'
  },

  // --------------------
  // メッセージ
  // --------------------
  messages: {
    info: {
      success: '{0}が完了しました。'
    },
    error: {
      unexpected: '予期せぬエラーが発生しました。',
      notFound: '対象のデータが見つかりません。',
      badRequest: '入力が正しくありません。',
      conflict: 'この{0}は既に使用されています。',
      invalidCredentials: 'ユーザーID、またはパスワードが間違っています。',
      networkError: 'サーバーに接続できません。',
      notAcceptable: 'NotAcceptableTest'
    }
  },

  // --------------------
  // コンポーネント
  // --------------------
  components: {
    aBusinessYearCalendar: {
      totalWorkingDays: '年間稼働日数:  ',
      totalHokidays: '年間休日:  ',
      workday: '稼働日:  ',
      calendarDetails: 'カレンダー 日数詳細'
    }
  },

  // --------------------
  // Vuetify
  // --------------------
  $vuetify: {
    badge: 'バッジ',
    close: '閉じる',
    dataIterator: {
      noResultsText: '該当する記録は見つかりません',
      loadingText: 'アイテムを読み込んでいます...'
    },
    dataTable: {
      itemsPerPageText: '1ページあたりの行数：',
      ariaLabel: {
        sortDescending: '降順で並べ替え。',
        sortAscending: '昇順で並べ替えられます。',
        sortNone: 'ソートされていません。',
        activateNone: '並べ替えを削除するには、アクティブにします。',
        activateDescending: 'アクティブにすると、降順で並べ替えられます。',
        activateAscending: 'アクティブにすると、昇順で並べ替えられます。'
      },
      sortBy: '並び替え'
    },
    dataFooter: {
      itemsPerPageText: '1ページあたりのアイテム：',
      itemsPerPageAll: 'すべて',
      nextPage: '次のページ',
      prevPage: '前のページ',
      firstPage: '一ページ目',
      lastPage: '最後のページ',
      pageText: '{0}-{1}の{2}'
    },
    datePicker: {
      itemsSelected: '{0}が選択されました',
      nextMonthAriaLabel: '来月',
      nextYearAriaLabel: '来年',
      prevMonthAriaLabel: '前月',
      prevYearAriaLabel: '前年'
    },
    noDataText: 'データなし',
    carousel: {
      prev: '前のビジュアル',
      next: '次のビジュアル',
      ariaLabel: {
        delimiter: '{1}のカルーセルスライド{0}'
      }
    },
    calendar: {
      moreEvents: '{0}もっと'
    },
    fileInput: {
      counter: '{0}ファイル',
      counterSize: '{0}ファイル（合計{1}）'
    },
    timePicker: {
      am: 'AM',
      pm: 'PM'
    },
    pagination: {
      ariaLabel: {
        wrapper: 'ページネーションナビゲーション',
        next: '次のページ',
        previous: '前のページ',
        page: 'ページに移動{0}',
        currentPage: '現在のページ、ページ{0}'
      }
    }
  }
}
