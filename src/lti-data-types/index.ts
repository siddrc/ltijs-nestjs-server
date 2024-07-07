type UserInfo = {
  given_name: string;
  family_name: string;
  name: string;
  email: string;
};

type PlatformInfo = {
  product_family_code: string;
  version: string;
  guid: string;
  name: string;
  description: string;
};
type Resource = {
  title: string;
  description: string;
  id: string;
};
type Lis = {
  person_sourcedid: string;
  course_section_sourcedid: string;
};
type LaunchPresentation = {
  locale: string;
  document_target: string;
  return_url: string;
};
type PlatformContext = {
  id: number;
  contextId: string;
  path: string;
  user: string;
  roles: Array<string>;
  targetLinkUri: string;
  resource: Resource;
  custom: any;
  endpoint: any;
  namesRoles: any;
  lis: Lis;
  launchPresentation: LaunchPresentation;
  messageType: string;
  version: string;
  deepLinkingSettings: DeepLinkingSettings;
  createdAt: any;
  updatedAt: any;
};
type Token = {
  id: number;
  iss: string;
  platformId: string;
  clientId: string;
  deploymentId: string;
  user: string;
  userInfo: UserInfo;
  platformInfo: PlatformInfo;
  createdAt: string;
  updatedAt: string;
  platformContext: PlatformContext;
};
type Context = {
  id: string;
  label: string;
  title: string;
  type: Array<string>;
};
type ContextInfo = {
  id: number;
  contextId: string;
  path: string;
  user: string;
  roles: Array<string>;
  targetLinkUri: string;
  context: Context;
  resource: Resource;
  custom: any;
  endpoint: any;
  namesRoles: any;
  lis: Lis;
  launchPresentation: LaunchPresentation;
  messageType: string;
  version: string;
  deepLinkingSettings: DeepLinkingSettings;
  createdAt: string;
  updatedAt: string;
};

type DeepLinkingSettings = {
  accept_types: Array<string>;
  accept_presentation_document_targets: Array<string>;
  accept_copy_advice: boolean;
  accept_multiple: boolean;
  accept_unsigned: boolean;
  auto_create: boolean;
  can_confirm: boolean;
  deep_link_return_url: string;
  title: string;
  text: string;
};

export { Token, ContextInfo, DeepLinkingSettings };
