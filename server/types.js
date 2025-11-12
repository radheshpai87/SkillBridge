// JavaScript data contracts using JSDoc for editor hints

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @property {'student' | 'business'} role
 * @property {string[]} [skills]
 * @property {string} [bio]
 * @property {string} [companyName]
 * @property {string} [description]
 * @property {Date} [createdAt]
 * @property {Date} [updatedAt]
 */

/**
 * @typedef {Object} Gig
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {number} budget
 * @property {string} location
 * @property {string} postedBy
 * @property {string[]} applicants
 * @property {Date} [createdAt]
 * @property {Date} [updatedAt]
 */

/**
 * @typedef {Object} Application
 * @property {string} id
 * @property {string} gigId
 * @property {string} studentId
 * @property {'pending' | 'accepted' | 'rejected' | 'completed'} status
 * @property {Date} [createdAt]
 * @property {Date} [updatedAt]
 */

export {};
