// types.d.ts
export interface ILocaleString {
  es: string;
  ca: string;
  ga: string;
  eu: string;
  en: string;
  cy: string;
  mt: string;
  is: string;
  it: string;
  pt: string;
  de: string;
  fr: string;
  pl: string;
  et: string;
  cz: string;
  sv: string;
  da: string;
  nl: string;
  nb: string;
  nn: string;
  ro: string;
  sr: string;
  sl: string;
  lv: string;
  lt: string;
  hr: string;
  el: string;
  hu: string;
  bg: string;
  bs: string;
  sq: string;
}

export enum ECurrency {
  EUR,
  NOK,
  SEK,
  CHF,
  GBP,
  CZK,
  PLZ,
  USD,
}

// pvt:offers

export interface ITaxesAndFees {
  taxes: number;
  fees: number;
  shipping: number;
}

export enum EOfferStatus {
  ACTIVE,
  PENDING,
  INACTIVE,
  DELETED,
}

export interface IOfferFacade {
  id: string;
  name: ILocaleString;
  description: ILocaleString;
  cost: number;
  currency: ECurrency;
  surcharges: ITaxesAndFees[];
  discounts: number;
  status: EOfferStatus;
  launch: Date;
}

export interface ITenant {
  community?: string;
  user?: string;
}

export enum ECampaignStatus {
  ACTIVE,
  PENDING,
  INACTIVE,
  DELETED,
}

export interface IAudienceFacade {
  id: string;
  name: ILocaleString;
  status: ECampaignStatus;
}

export interface IAdsDecorator {
  id: string;
  name: ILocaleString;
  status: ECampaignStatus;
  userFits: boolean;
  communityFits: boolean;
}

// pvt:taxonomies

export enum ETaxonomyStatus {
  ACTIVE,
  PENDING,
  INACTIVE,
  DELETED,
}

export enum ETaxonomyType {
  MODALIDADES,
  ESPECIES,
}

export enum ETaxonomyNature {
  SEGMENTED,
  PUBLIC,
}

export interface ITaxonomiesFacade {
  id: string;
  name: ILocaleString;
  description: ILocaleString;
  status: ETaxonomyStatus;
  type: ETaxonomyType;
  nature: ETaxonomyNature;
  targetAudiences: IAudienceFacade;
}

// pvt:messages
export enum EMessageType {
  ANNOUNCEMENT,
  CAMPAIGN,
  REVIEW,
  CHAT,
  SUPPORT,
}

export enum EMessageStatus {
  SCHEDULED,
  PENDING,
  DELIVERED,
  VIEWED,
}

export enum EMessageNature {
  PRIVATE,
  SEMI_PRIVATE,
  PUBLIC,
}

export interface IMessageFacade {
  id: string;
  name: ILocaleString;
  description: ILocaleString;
  type: EMessageType;
  status: EMessageStatus;
  nature: EMessageNature;
  title: ILocaleString;
  body: ILocaleString;
  queuedOn: Date;
  scheduledOn: Date;
  sentOn: Date;
}

// pvt:users
export interface IUserFacade {
  id: string;
  image: string;
  firstName: string;
}

// pvt:communities
export enum ECommunitiestatus {
  ACTIVE,
  PENDING,
  INACTIVE,
  DELETED,
}

export interface ICommunityFacade {
  id: string;
  image: string;
  name: string;
  urls: string[];
  status: ECommunitiestatus;
}

// pvt:reviews
export enum EReviewStatus {
  ACTIVE,
  PENDING,
  INACTIVE,
  DELETED,
}

export enum EImpression {
  POSITIVE,
  NEGATIVE,
  NEUTRAL,
}

export interface IReviewFacade {
  id: string;
  status: EReviewStatus;
  message: IMessageFacade;
  rating: number;
  impression: EImpression;
  user: IUserFacade;
  community: ICommunityFacade;
  listing: string;
}

// pvt:catalogue

export enum ECatalogueItemType {
  SERVICE,
  FEE,
  SUBSCRIPTION,
}

export enum ECatalogueItemStatus {
  ACTIVE,
  PENDING,
  INACTIVE,
  DELETED,
}

export interface ICatalogueFacade {
  id: string;
  name: ILocaleString;
  description: ILocaleString;
  remarks: ILocaleString;
  status: ECatalogueItemStatus;
  type: ECatalogueItemType;
  taxonomies: ITaxonomiesFacade[];
}

// public_listings

export enum EListingStatus {
  PENDING,
  ACTIVE,
  INACTIVE,
  DELETED,
}

export interface IPosix {
  lat: number;
  lng: number;
  radius: number;
}

export interface IRedactedAddress {
  city: string;
  province: string;
  country: string;
  zipCode: string;
}

export interface ILocation {
  geo: IPosix;
  address: IRedactedAddress;
  name: string;
}
