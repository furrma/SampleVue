/**
 * 権限
 */
export default class Permissions {
  /**
   * 会社/管理
   */
  static get COMPANIES_ADMIN () { return 'Companies/Admin' }

  /**
   * 組織/管理
   */
  static get ORGANIZATIONS_ADMIN () { return 'Organizations/Admin' }

  /**
   * ロール/管理
   */
  static get ROLES_ADMIN () { return 'Roles/Admin' }

  /**
   * 権限/管理
   */
  static get PERMISSIONS_ADMIN () { return 'Permissions/Admin' }

  /**
   * ユーザー/管理
   */
  static get USERS_ADMIN () { return 'Users/Admin' }

  /**
   * 協力会社/管理
   */
  static get ASSOCIATE_COMPANIES_ADMIN () { return 'AssociateCompanies/Admin' }

  /**
   * カレンダー管理
   */
  static get CALENDARS_ADMIN () { return 'Calendars/Admin' }

  /**
   * 取引先/管理
   */
  static get SUPPLIERS_ADMIN () { return 'Suppliers/Admin' }

  /**
   * JOBコード(S2I)/管理
   */
  static get JOB_CD_S2I_ADMIN () { return 'JobCdS2i/Admin' }

  /**
   * JOBコード(S2I)/参照
   */
  static get JOB_CD_S2I_REFERENCE () { return 'JobCdS2i/Reference' }

  /**
   * JOB備考コード/管理
   */
  static get JOB_REMARKS_CD_ADMIN () { return 'JobRemarksCd/Admin' }

  /**
   * JOB備考コード/参照
   */
  static get JOB_REMARKS_CD_REFERENCE () { return 'JobRemarksCd/Reference' }

  /**
   * 検索制限JOBコード/管理
   */
  static get JOB_SEARCH_RESTRICTIONS_ADMIN () { return 'JobSearchRestrictions/Admin' }

  /**
   * プロジェクトコード/管理
   */
  static get PROJECT_CD_ADMIN () { return 'ProjectCd/Admin' }

  /**
   * プロジェクトコード/参照
   */
  static get PROJECT_CD_REFERENCE () { return 'ProjectCd/Reference' }

  /**
   * 弁当/管理
   */
  static get LUNCH_ADMIN () { return 'Lunch/Admin' }

  /**
   * 弁当注文/管理
   */
  static get LUNCH_ORDER_ADMIN () { return 'LunchOrder/Admin' }

  /**
   * 勤怠・工数検収処理
   */
  static get ACCEPTANCE_ADMIN () { return 'Acceptance/Admin' }
}
