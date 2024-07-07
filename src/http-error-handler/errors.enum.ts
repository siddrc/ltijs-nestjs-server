enum LTIAuthErrors {
  NO_ACCESS_TOKEN = 'Access token was not generated',
  NOT_ENABLED = 'Customer is not enabled in database',
  NO_CUSTOMER = 'No customer with given key, check key in database with the key configured with the Customer LMS',
  NO_LTI = 'No lti token was generated',
  LICENSE_EXPIRED = 'Customer license has expired',
  NO_LEARNER_EMAIL_AVAILABLE = 'No learner email available in LTI token',
  NO_LEARNER_NAME_AVAILABLE = 'No learner name available in LTI token',
}

enum ApplicationErrors {
  USER_HASNT_FINISHED_WATCHING_THE_COURSE = 'User has not finished watching the course, cannot proceed to exam',
}

export { LTIAuthErrors, ApplicationErrors };
