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
    add: 'Add',
    edit: 'Edit',
    delete: '[英語]削除',
    save: 'Save',
    cancel: '[英語]キャンセル',
    close: '[英語]閉じる',
    active: 'Active',
    disabled: 'Inactive',
    all: 'All',
    keywords: 'Keywords',
    next: 'Next',
    previous: 'Previous'
  },

  // --------------------
  // メニュー
  // --------------------
  menu: {
    categories: {
      Y: 'Settings'
    },
    dashboard: 'Dashboard',
    notifications: 'Notifications',
    sandbox: '[英語]サンドボックス',
    filterSample: '[英語]フィルターサンプル',
    portalSample: '[英語]ポータルサンプル',
    logout: '[英語]ログアウト',
    profile: '[英語]プロフィール',
    ZAD0010: 'Companies',
    ZAD0070: '[英語]協力会社',
    ZAD0040: 'Roles',
    ZAD0050: 'Users',
    ZAD0060: 'Suppliers',
    ZBD0010: 'Project Code',
    ZBD0020: 'Job Code(S2I)',
    ZBD0030: 'Job Remarks Code',
    ZBD0040: '[英語]弁当',
    ZBD0050: 'Job Search Restriction',
    ZAD0080: 'Calendars',
    ZAD0020: 'Organizations'
  },

  // --------------------
  // ログイン
  // --------------------
  ZCD0010: {
    companyCd: '[英語]会社',
    userCd: '[英語]ユーザーID',
    password: '[英語]パスワード',
    login: '[英語]ログイン'
  },

  // --------------------
  // 会社マスタ
  // --------------------
  ZAD0010: {
    title: 'Companies',
    companyCd: 'Company Code',
    companyName: 'Company Name',
    isActive: 'Active',
    companyInfo: 'Company Permissions',
    postalCd: 'Postal Code',
    address: 'Address',
    phoneNo: 'Phone No',
    faxNo: 'FAX No'
  },

  // --------------------
  // 協力会社マスタ
  // --------------------
  ZAD0070: {
    title: '[英語]協力会社',
    companyInfomation: '[英語]協力会社情報',
    companyCd: '[英語]協力会社CD',
    companyName: '[英語]協力会社名',
    postalCd: '[英語]郵便番号',
    address: '[英語]住所',
    phoneNo: '[英語]電話番号',
    faxNo: '[英語]Fax',
    isActive: '[英語]有効'
  },
  // --------------------
  // ロールマスタ
  // --------------------
  ZAD0040: {
    title: 'Roles',
    id: 'ID',
    role: 'Role',
    roleName: 'Role Name',
    isActive: 'Active',
    roleInfo: 'Role Info',
    rolePermissions: 'Role Permissions',
    permissionCd: 'Permission Code',
    permissionName: 'Permission Name'
  },

  // --------------------
  // ユーザーマスタ
  // --------------------
  ZAD0050: {
    title: 'Users',
    companyCd: 'Company Code',
    companyName: 'Company Name',
    userCd: 'User Code',
    employeeNo: 'Employee No',
    userName: 'User Name',
    userNameEn: 'User Name (English)',
    email: 'Email',
    userInfo: 'User Info',
    associateCompanyInfo: 'Associate Company Info',
    organizations: 'Organization',
    organizationCds: 'Organization Codes',
    organizationNames: 'Organization Names',
    affiliationOrganizations: 'Affiliation Organizations',
    roleNames: 'Role Names',
    ownedRoles: 'Owned Roles',
    occupationClass: 'Occupation Class',
    location: 'Location',
    extensionNo: 'Extension No',
    initiationDate: 'Initiation Date',
    birthday: 'Birthday',
    password: 'Password',
    isEnrolled: {
      name: 'Enrollment Status',
      true: 'Enrolled',
      false: 'Leave'
    },
    role: 'Role',
    extentionNo: 'Extention No',
    isActive: 'Active',
    systemControl: 'System Control',
    isUnnecessaryInputAttendance: {
      name: 'Unnecessary Input Attendance',
      true: 'Unnecessary',
      false: 'Necessary'
    },
    isUnnecessaryInputManHours: {
      name: 'Unnecessary Input Man Hours',
      true: 'Unnecessary',
      false: 'Necessary'
    },
    isAdAccount: {
      name: 'AD User',
      true: 'YES',
      false: 'NO'
    },
    isAdmin: {
      name: 'Administrator',
      true: 'ON',
      false: 'OFF'
    },
    associateCompany: 'Input Associate Company Information',
    isInputAssociateCompanyInfo: {
      name: 'Associate Company Information',
      true: 'ON',
      false: 'OFF'
    },
    associateCompanies: 'Associate Company',
    associateCompanyCd: 'Associate Company Cd',
    associateCompanyName: 'Associate Company Name',
    outsourcingContractClass: 'Outsourcing Contract Class',
    outsourcingOccupationClass: 'Outsourcing Occupation Class',
    upperLimitHour: 'Upper Limit Hour',
    lowerLimitHour: 'Lower Limit Hour',
    contractLimitDate: 'Contract Limit Date',
    contractUnitPrice: 'Contract Unit Price',
    contractFixedCost: 'Contract Fixed Cost',
    remarks: 'Remarks',
    requiredMessage: 'Select at least one item.',
    otherActions: 'Other Actions',
    resetPasswordDescription: 'Reset the user\'s password.',
    resetPassword: 'Reset password',
    resetPasswordConfirmTitle: 'Are you sure want to reset the password?',
    resetPasswordConfirmSentence: 'The current password will be replaced with a password generated randomly. Are you sure want to reset the password?',
    resetPasswordCompleteTitle: 'Resetting password is completed.',
    resetPasswordCompleteSentence: 'The password generated newly is below. Using this password to login this system from next time.\n'
  },
  // --------------------
  // 組織マスタ
  // --------------------
  ZAD0020: {
    title: '[英語]Organizations',
    organizationCd: '[英語]Organization Code',
    organizationClassCd: '[英語]Organization Classification',
    organizationClassName: '[英語]Organization Classification',
    companyCd: '[英語]Company Code',
    companyName: '[英語]Company Name',
    organizationName: '[英語]Organization Name',
    organizationParentCd: '[英語]Parent Organization Code',
    organizationBossCd: '[英語]Organization Head Code',
    organizationBossName: '[英語]Organization Head',
    isActive: 'Active',
    organizationInfo: 'Organization Info'
  },
  // --------------------
  // 取引先マスタ
  // --------------------
  ZAD0060: {
    title: '[英語]Suppliers',
    supplierCd: '[英語]Supplier Code',
    supplierName: '[英語]Supplier Name',
    supplierClass: '[英語]Supplier Class',
    supplierDiv: '[英語]Supplier Div',
    supplierManager: '[英語]Supplier Manager',
    salesRepUserId: '[英語]Sales User ID',
    postalCd: '[英語]Postal Code',
    address: '[英語]Address',
    phoneNo: '[英語]Phone No',
    faxNo: '[英語]FAX No',
    paymentTerms: '[英語]Payment Terms',
    isActive: 'Active',
    supplierInfo: '[英語]Supplier Info'
  },

  // --------------------
  // カレンダーマスタ
  // --------------------
  ZAD0080: {
    title: '[英語]Calendar',
    businessYear: '[英語]Business Year',
    company: '[英語]Company',
    calendarName: '[英語]Calendar Name',
    isActive: 'Active',
    workingTimeReg: '[英語]WorKing Time Reg',
    calendarInfo: '[英語]Calnedar Info',
    workTimeInfo: '[英語]Work Time Info',
    headerCalendarDate: '[英語]Date',
    headerCalendarClass: '[英語]Date Class',
    headerCalendarEvent: '[英語]Event',
    headerWorkTime: '[英語]Work Time',
    headerWorkTimeClass: '[英語]Work Time Class',
    headerWorkStart: '[英語]Work Start'
  },

  // --------------------
  // プロジェクトコードマスタ
  // --------------------
  ZBD0010: {
    title: 'Project Code',
    info: 'Project Code Information',
    companyCd: 'Company Code',
    companyName: 'Company Name',
    projectCd: 'Project Code',
    projectName: 'Project Name',
    isOnlyDevNotEnd: 'Only Umcomplete Developing Job Code',
    isActive: 'Active',
    jobCd: 'Job Code',
    jobName: 'Job Name',
    orderAmount: 'Order Amount',
    devAmount: 'Developing Amount',
    inTargetAmount: 'Internal Target Amount',
    outTargetAmount: 'External Target Amount',
    devStartDate: 'Development Start Date',
    devEndDate: 'Development End Date',
    pmUserName: 'PM User Name',
    company: 'Company'
  },

  // --------------------
  // JOBコード（S2I）マスタ
  // --------------------
  ZBD0020: {
    title: 'Job Code(S2I)',
    info: 'Job Code Information',
    searchDetails: {
      title: 'Search Condition Detail',
      isUnregistered: 'Set unregistered PM registering information to search condition',
      isIncludeSalesSupport: 'Include sales support job code in search condition',
      isOnlyTentative: 'Set only tentative job code to search condition',
      isIncludeDevEnd: 'Include finished development in search condition',
      isOnlyPOC: 'Set only POC to search condition'
    },
    actions: {
      header: 'Actions',
      jobCdRemark: 'Edit Job Code Remarks',
      jobCdRelationalUser: 'Linking User And Job Code',
      jobCdCopy: 'Copy the Job Code Information'
    },
    jobCd: 'Job Code',
    supplier: 'Supplier',
    supplierName: 'Supplier',
    jobName: 'Job Name',
    amountDetail: 'Amount Detail',
    orderAmount: 'Order Amount(YEN)',
    managementCost: 'Management Cost(YEN)',
    devAmount: 'Developing Amount(YEN)',
    inTargetAmount: 'Internal Target Amount',
    outTargetAmount: 'External Target Amount',
    dateDetail: 'Date Detail',
    devStartDate: 'Development Start Date',
    devEndDateInitial: 'Development End Date(Initially Registered)',
    devEndDate: 'Development End Date',
    expectedBillingDate: 'Expected Billing Date',
    billingDate: 'Billing Date',
    userDetail: 'User In Charge',
    selUserName: 'Sales User',
    pmUserName: 'PM User',
    companyCd: 'Company',
    supplierId: 'Supplier',
    contractType: 'Contract Type',
    estimatePersonDay: 'Estimated Person Per Day',
    estimatePersonDaySuffix: '(Person Per Day)',
    jobCdProperty: 'Job Code Property',
    isDevEnd: {
      name: 'End Of Development',
      true: 'Complete Developing',
      false: 'Uncomplete Developing'
    },
    isSalesSupport: {
      name: 'Sales Support',
      true: 'Sales Support Code',
      false: 'Actual Job Code'
    },
    isTentative: {
      name: 'Tentative',
      true: 'Tentative Job Code',
      false: 'Actual Job Code',
      hint: 'Tentative job code targets for the job that corresponds in ahead of schedule. If orders are accepted, change the switch manually and treat as an actual job code.'
    },
    isInHouse: {
      name: 'In House',
      true: 'In House',
      false: 'Outsource',
      hint: ''
    },
    isPoc: {
      name: 'POC',
      true: 'Target',
      false: 'Not Target',
      hint: ''
    },
    isAvailable: {
      name: 'Available Input Man Hour',
      true: 'Available',
      false: 'Unavailable',
      hint: ''
    },
    isWork: {
      name: 'Actual Man Hour',
      true: 'Target',
      false: 'Not Target',
      hint: ''
    }
  },

  // --------------------
  // 備考コードマスタ
  // --------------------
  ZBD0030: {
    title: 'Job Remarks Code',
    info: 'Job Code Information',
    jobCd: 'Job Code',
    supplierName: 'Supplier Name',
    jobName: 'Job Name',
    jobRemarksCd: 'Job Remarks Code',
    jobRemarksName: 'Job Remarks Code Name',
    isActive: 'Active'
  },

  // --------------------
  // 弁当マスタ
  // --------------------
  ZBD0040: {
    title: '[英語]弁当',
    lunchInfomation: '[英語]弁当情報',
    lunchName: '[英語]弁当名',
    price: '[英語]金額',
    isOrderBeforeDate: '[英語]前日注文',
    lunchInfo: '[英語]弁当情報'
  },

  // --------------------
  // 勤怠･工数承認 検収処理
  // --------------------
  BBD0020: {
    title: '[英語]勤怠･工数承認 検収処理',
    titleList: '[英語]勤怠・工数一覧(仮)',
    targetYearMonth: '[英語]対象年月',
    team: '[英語]所属',
    user: '[英語]ユーザー',
    checkAll: '[英語]一括チェック',
    acceptance: '[英語]検収',
    attendanceClass: '[英語]勤怠区分',
    jobCdSummary: '[英語]計',
    workTimeSummary: '[英語]労働時間計',
    overTimeSummary: '[英語]全残業計',
    midnightOverSummary: '[英語]内深夜残業'
  },

  // --------------------
  // 勤怠･工数承認 工数振替
  // --------------------
  BBD0030: {
    title: '[英語]勤怠･工数承認 工数振替',
    startDate: '[英語]開始日付',
    endDate: '[英語]終了日付',
    jobCd: '[英語]ジョブコード*',
    jobDetailCd: '[英語]ジョブ詳細コード',
    jobRemarksCd: '[英語]ジョブ備考コード',
    Do: '[英語]実行',
    userSearch: '[英語]ユーザー検索',
    jobFrom: '[英語]振替対象',
    jobTo: '[英語]振替先'
  },

  // --------------------
  // 検索制限JOBコードマスタ
  // --------------------
  ZBD0050: {
    title: 'Job Search Restrictions',
    info: 'Job Search Restriction Info',
    jobCd: 'Job Code',
    supplierName: 'Supplier Name',
    jobName: 'Job Name',
    jobRemarksCd: 'Remarks Code',
    jobRemarksName: 'Remarks Name',
    pmUserName: 'PM User Name',
    searchableUser: 'Searchable User',
    isActive: 'Active'
  },

  // --------------------
  // メッセージ
  // --------------------
  messages: {
    info: {
      success: '[英語]{0}が完了しました。'
    },
    error: {
      unexpected: '[英語]予期せぬエラーが発生しました。',
      notFound: '[英語]対象のデータが見つかりません。',
      badRequest: '[英語]入力が正しくありません。',
      conflict: '[英語]この{0}は既に使用されています。',
      invalidCredentials: '[英語]ユーザーID、またはパスワードが間違っています。',
      networkError: '[英語]サーバーに接続できません。'
    }
  },

  // --------------------
  // Vuetify
  // --------------------
  $vuetify: {
    badge: 'Badge',
    close: 'Close',
    dataIterator: {
      noResultsText: 'No matching records found',
      loadingText: 'Loading items...'
    },
    dataTable: {
      itemsPerPageText: 'Rows per page:',
      ariaLabel: {
        sortDescending: 'Sorted descending.',
        sortAscending: 'Sorted ascending.',
        sortNone: 'Not sorted.',
        activateNone: 'Activate to remove sorting.',
        activateDescending: 'Activate to sort descending.',
        activateAscending: 'Activate to sort ascending.'
      },
      sortBy: 'Sort by'
    },
    dataFooter: {
      itemsPerPageText: 'Items per page:',
      itemsPerPageAll: 'All',
      nextPage: 'Next page',
      prevPage: 'Previous page',
      firstPage: 'First page',
      lastPage: 'Last page',
      pageText: '{0}-{1} of {2}'
    },
    datePicker: {
      itemsSelected: '{0} selected',
      nextMonthAriaLabel: 'Next month',
      nextYearAriaLabel: 'Next year',
      prevMonthAriaLabel: 'Previous month',
      prevYearAriaLabel: 'Previous year'
    },
    noDataText: 'No data available',
    carousel: {
      prev: 'Previous visual',
      next: 'Next visual',
      ariaLabel: {
        delimiter: 'Carousel slide {0} of {1}'
      }
    },
    calendar: {
      moreEvents: '{0} more'
    },
    fileInput: {
      counter: '{0} files',
      counterSize: '{0} files ({1} in total)'
    },
    timePicker: {
      am: 'AM',
      pm: 'PM'
    },
    pagination: {
      ariaLabel: {
        wrapper: 'Pagination Navigation',
        next: 'Next page',
        previous: 'Previous page',
        page: 'Goto Page {0}',
        currentPage: 'Current Page, Page {0}'
      }
    }
  }
}
