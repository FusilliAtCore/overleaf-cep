import { User, Features } from '../../../types/user'
import { User as MinimalUser } from '../../../types/admin/user'
import { User as ManagedUser } from '../../../types/group-management/user'
import { UserSettings } from '../../../types/user-settings'
import { OAuthProviders } from '../../../types/oauth-providers'
import { ExposedSettings } from '../../../types/exposed-settings'
import {
  type AllowedImageName,
  OverallThemeMeta,
  type SpellCheckLanguage,
} from '../../../types/project-settings'
import { CurrencyCode } from '../../../types/subscription/currency'
import { PricingFormState } from '../../../types/subscription/payment-context-value'
import { Plan } from '../../../types/subscription/plan'
import { Affiliation } from '../../../types/affiliation'
import type { PortalTemplate } from '../../../types/portal-template'
import { UserEmailData } from '../../../types/user-email'
import {
  GroupsAndEnterpriseBannerVariant,
  Institution as InstitutionType,
  Notification as NotificationType,
  PendingGroupSubscriptionEnrollment,
} from '../../../types/project/dashboard/notification'
import { Survey } from '../../../types/project/dashboard/survey'
import { GetProjectsResponseBody } from '../../../types/project/dashboard/api'
import { Tag } from '../../../app/src/Features/Tags/types'
import { Institution } from '../../../types/institution'
import {
  ManagedGroupSubscription,
  MemberGroupSubscription,
} from '../../../types/subscription/dashboard/subscription'
import { SplitTestInfo } from '../../../types/split-test'
import { ValidationStatus } from '../../../types/group-management/validation'
import { ManagedInstitution } from '../../../types/subscription/dashboard/managed-institution'
import { GroupSSOTestResult } from '../../../modules/group-settings/frontend/js/utils/types'
import {
  AccessToken,
  InstitutionLink,
  SAMLError,
} from '../../../types/settings-page'
import { SuggestedLanguage } from '../../../types/system-message'
import type { TeamInvite } from '../../../types/team-invite'
import { GroupPlans } from '../../../types/subscription/dashboard/group-plans'
import { GroupSSOLinkingStatus } from '../../../types/subscription/sso'
import { PasswordStrengthOptions } from '../../../types/password-strength-options'
import { Subscription as ProjectDashboardSubscription } from '../../../types/project/dashboard/subscription'
import { ThirdPartyIds } from '../../../types/third-party-ids'
import { Publisher } from '../../../types/subscription/dashboard/publisher'
import _ from 'lodash'
import { isSplitTestEnabled } from '@/utils/splitTestUtils'

export interface Meta {
  'ol-ExposedSettings': ExposedSettings
  'ol-allInReconfirmNotificationPeriods': UserEmailData[]
  'ol-allowedImageNames': AllowedImageName[]
  'ol-anonymous': boolean
  'ol-bootstrapVersion': 3 | 5
  'ol-brandVariation': Record<string, any>

  // dynamic keys based on permissions
  'ol-cannot-add-secondary-email': boolean
  'ol-cannot-change-password': boolean
  'ol-cannot-delete-own-account': boolean
  'ol-cannot-join-subscription': boolean
  'ol-cannot-leave-group-subscription': boolean
  'ol-cannot-link-google-sso': boolean
  'ol-cannot-link-other-third-party-sso': boolean
  'ol-cannot-reactivate-subscription': boolean
  'ol-cannot-use-ai': boolean
  'ol-countryCode': PricingFormState['country']
  'ol-couponCode': PricingFormState['coupon']
  'ol-createdAt': Date
  'ol-csrfToken': string
  'ol-currentInstitutionsWithLicence': Institution[]
  'ol-currentManagedUserAdminEmail': string
  'ol-currentUrl': string
  'ol-debugPdfDetach': boolean
  'ol-detachRole': 'detached' | 'detacher' | ''
  'ol-dropbox': { error: boolean; registered: boolean }
  'ol-editorThemes': string[]
  'ol-email': string
  'ol-emailAddressLimit': number
  'ol-error': { name: string } | undefined
  'ol-expired': boolean
  'ol-features': Features
  'ol-fromPlansPage': boolean
  'ol-gitBridgeEnabled': boolean
  'ol-gitBridgePublicBaseUrl': string
  'ol-github': { enabled: boolean; error: boolean }
  'ol-groupId': string
  'ol-groupName': string
  'ol-groupPlans': GroupPlans
  'ol-groupSSOActive': boolean
  'ol-groupSSOTestResult': GroupSSOTestResult
  'ol-groupSettingsEnabledFor': string[]
  'ol-groupSize': number
  'ol-groupSsoSetupSuccess': boolean
  'ol-groupSubscriptionsPendingEnrollment': PendingGroupSubscriptionEnrollment[]
  'ol-groupsAndEnterpriseBannerVariant': GroupsAndEnterpriseBannerVariant
  'ol-hasGroupSSOFeature': boolean
  'ol-hasIndividualRecurlySubscription': boolean
  'ol-hasManagedUsersFeature': boolean
  'ol-hasPassword': boolean
  'ol-hasSubscription': boolean
  'ol-hasTrackChangesFeature': boolean
  'ol-hideLinkingWidgets': boolean // CI only
  'ol-i18n': { currentLangCode: string }
  'ol-inactiveTutorials': string[]
  'ol-institutionEmailNonCanonical': string | undefined
  'ol-institutionLinked': InstitutionLink | undefined
  'ol-inviteToken': string
  'ol-inviterName': string
  'ol-isExternalAuthenticationSystemUsed': boolean
  'ol-isManagedAccount': boolean
  'ol-isProfessional': boolean
  'ol-isRegisteredViaGoogle': boolean
  'ol-isRestrictedTokenMember': boolean
  'ol-isSaas': boolean
  'ol-itm_campaign': string
  'ol-itm_content': string
  'ol-itm_referrer': string
  'ol-labs': boolean
  'ol-languages': SpellCheckLanguage[]
  'ol-learnedWords': string[]
  'ol-legacyEditorThemes': string[]
  'ol-linkSharingWarning': boolean
  'ol-loadingText': string
  'ol-managedGroupSubscriptions': ManagedGroupSubscription[]
  'ol-managedInstitutions': ManagedInstitution[]
  'ol-managedPublishers': Publisher[]
  'ol-managedUsersActive': boolean
  'ol-managedUsersEnabled': boolean
  'ol-managers': MinimalUser[]
  'ol-mathJaxPath': string
  'ol-maxDocLength': number
  'ol-memberGroupSubscriptions': MemberGroupSubscription[]
  'ol-memberOfSSOEnabledGroups': GroupSSOLinkingStatus[]
  'ol-members': MinimalUser[]
  'ol-no-single-dollar': boolean
  'ol-notifications': NotificationType[]
  'ol-notificationsInstitution': InstitutionType[]
  'ol-oauthProviders': OAuthProviders
  'ol-optionalPersonalAccessToken': boolean
  'ol-overallThemes': OverallThemeMeta[]
  'ol-passwordStrengthOptions': PasswordStrengthOptions
  'ol-personalAccessTokens': AccessToken[] | undefined
  'ol-plan': Plan
  'ol-planCode': string
  'ol-planCodesChangingAtTermEnd': string[] | undefined
  'ol-plans': Plan[]
  'ol-portalTemplates': PortalTemplate[]
  'ol-postCheckoutRedirect': string
  'ol-postUrl': string
  'ol-prefetchedProjectsBlob': GetProjectsResponseBody | undefined
  'ol-primaryEmail': { email: string; confirmed: boolean }
  'ol-project': any // TODO
  'ol-projectSyncSuccessMessage': string
  'ol-projectTags': Tag[]
  'ol-project_id': string
  'ol-recommendedCurrency': CurrencyCode
  'ol-reconfirmationRemoveEmail': string
  'ol-reconfirmedViaSAML': string
  'ol-recurlyApiKey': string
  'ol-recurlySubdomain': string
  'ol-samlError': SAMLError | undefined
  'ol-settingsGroupSSO': { enabled: boolean } | undefined
  'ol-settingsPlans': Plan[]
  'ol-shouldAllowEditingDetails': boolean
  'ol-showAiErrorAssistant': boolean
  'ol-showBrlGeoBanner': boolean
  'ol-showCouponField': boolean
  'ol-showGroupsAndEnterpriseBanner': boolean
  'ol-showInrGeoBanner': boolean
  'ol-showLATAMBanner': boolean
  'ol-showPersonalAccessToken': boolean
  'ol-showSupport': boolean
  'ol-showSymbolPalette': boolean
  'ol-showTemplatesServerPro': boolean
  'ol-showUpgradePrompt': boolean
  'ol-skipUrl': string
  'ol-splitTestInfo': { [name: string]: SplitTestInfo }
  'ol-splitTestVariants': { [name: string]: string }
  'ol-ssoDisabled': boolean
  'ol-ssoErrorMessage': string
  'ol-subscription': any // TODO: mixed types, split into two fields
  'ol-subscriptionId': string
  'ol-suggestedLanguage': SuggestedLanguage | undefined
  'ol-survey': Survey | undefined
  'ol-symbolPaletteAvailable': boolean
  'ol-tags': Tag[]
  'ol-teamInvites': TeamInvite[]
  'ol-thirdPartyIds': ThirdPartyIds
  'ol-translationIoNotLoaded': string
  'ol-translationLoadErrorMessage': string
  'ol-translationMaintenance': string
  'ol-translationUnableToJoin': string
  'ol-useShareJsHash': boolean
  'ol-user': User
  'ol-userAffiliations': Affiliation[]
  'ol-userEmails': UserEmailData[]
  'ol-userSettings': UserSettings
  'ol-user_id': string | undefined
  'ol-users': ManagedUser[]
  'ol-usersBestSubscription': ProjectDashboardSubscription | undefined
  'ol-usersEmail': string | undefined
  'ol-validationStatus': ValidationStatus
  'ol-wikiEnabled': boolean
  'ol-writefullCssUrl': string
  'ol-writefullEnabled': boolean
  'ol-writefullJsUrl': string
  'ol-wsUrl': string
}

// cache for parsed values
window.metaAttributesCache = window.metaAttributesCache || new Map()

export default function getMeta<T extends keyof Meta>(name: T): Meta[T] {
  if (window.metaAttributesCache.has(name)) {
    return window.metaAttributesCache.get(name)
  }
  const element = document.head.querySelector(
    `meta[name="${name}"]`
  ) as HTMLMetaElement
  if (!element) {
    return undefined!
  }
  const plainTextValue = element.content
  let value
  switch (element.dataset.type) {
    case 'boolean':
      // in pug: content=false -> no content field
      // in pug: content=true  -> empty content field
      value = element.hasAttribute('content')
      break
    case 'json':
      if (!plainTextValue) {
        // JSON.parse('') throws
        value = undefined
      } else {
        value = JSON.parse(plainTextValue)
      }
      break
    default:
      value = plainTextValue
  }
  window.metaAttributesCache.set(name, value)
  return value
}

function convertMetaToWindowAttributes() {
  Array.from(document.querySelectorAll('meta[name^="ol-"]'))
    .map(element => (element as HTMLMetaElement).name)
    // process short labels before long ones:
    // e.g. assign 'foo' before 'foo.bar'
    .sort()
    .forEach(nameWithNamespace => {
      const label = nameWithNamespace.slice('ol-'.length)
      // @ts-ignore
      _.set(window, label, getMeta(nameWithNamespace))
    })
}

// Deduplicate warning, the bootstrap-3 bundle ships its own copy of this module.
if (!window.warnedAboutWindowAttributeRemoval) {
  window.warnedAboutWindowAttributeRemoval = true
  // Notify any extension developers about the upcoming removal of window attributes.
  // eslint-disable-next-line no-console
  console.warn(
    'overleaf.com: We are sunsetting window properties like "window.project_id". If you need access to any of these, please reach out to support@overleaf.com to discuss options.'
  )
}
if (!isSplitTestEnabled('remove-window-attributes')) {
  convertMetaToWindowAttributes()
}
