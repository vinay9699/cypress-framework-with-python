// =============================================================================
// utils.js — Reusable Helper / Utility Functions
// =============================================================================
// Pure JavaScript helper functions — NO cy.* calls inside any of these.
// They generate, validate, format, or transform data that your tests need.
//
// Import only what you need in each file:
//   import { generateRandomEmail, getTodayFormatted } from '../support/utils'
//
// Categories:
//   1.  RANDOM DATA GENERATORS   — email, string, number, phone, name, password
//   2.  PERSON / IDENTITY DATA   — full name, username, employee ID
//   3.  ADDRESS DATA             — street, city, postcode, full address
//   4.  DATE HELPERS             — today, relative date, format, parse, compare
//   5.  STRING HELPERS           — capitalize, truncate, slugify, trim, mask
//   6.  NUMBER HELPERS           — clamp, random in range, format currency
//   7.  VALIDATORS               — email, phone, URL, empty, number range
//   8.  ARRAY HELPERS            — pick random item, shuffle, unique, chunk
//   9.  OBJECT HELPERS           — deep clone, merge, pick keys, omit keys
//   10. FILE HELPERS             — build file name, get extension, build path
// =============================================================================


// =============================================================================
// 1. RANDOM DATA GENERATORS
// =============================================================================

/**
 * Generate a random email address.
 * Useful for creating unique users so tests don't conflict with each other.
 *
 * Example output: "testuser_a3f9k2@qa.com"
 *
 * @param {string} domain - email domain (default: 'qa.com')
 * @returns {string}
 */
export const generateRandomEmail = (domain = 'qa.com') => {
  const randomPart = Math.random().toString(36).substring(2, 8)
  return `testuser_${randomPart}@${domain}`
}

/**
 * Generate a random alphanumeric string of a given length.
 * Use this for unique names, reference numbers, or identifiers.
 *
 * Example: generateRandomString(6) → "x3kqmz"
 *
 * @param {number} length - desired string length (default: 6)
 * @returns {string}
 */
export const generateRandomString = (length = 6) => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('')
}

/**
 * Generate a random alphabetic string (letters only, no digits).
 * Useful for name fields that don't accept numbers.
 *
 * Example: generateRandomAlpha(5) → "xkqmz"
 *
 * @param {number} length - desired string length (default: 6)
 * @returns {string}
 */
export const generateRandomAlpha = (length = 6) => {
  const chars = 'abcdefghijklmnopqrstuvwxyz'
  return Array.from({ length }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('')
}

/**
 * Generate a random integer between min and max (both inclusive).
 *
 * Example: generateRandomNumber(1, 100) → 47
 *
 * @param {number} min - minimum value (default: 1)
 * @param {number} max - maximum value (default: 9999)
 * @returns {number}
 */
export const generateRandomNumber = (min = 1, max = 9999) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Generate a random UK-style mobile phone number.
 * Format: 07xxx xxxxxx (11 digits total)
 *
 * Example: "07834291056"
 *
 * @returns {string}
 */
export const generateRandomPhone = () => {
  const suffix = String(generateRandomNumber(100000000, 999999999))
  return `07${suffix}`
}

/**
 * Generate a random strong password that meets common requirements:
 *   - At least 1 uppercase letter
 *   - At least 1 lowercase letter
 *   - At least 1 number
 *   - At least 1 special character
 *   - Minimum 12 characters long
 *
 * Example output: "Qa3#xkqmz9!P"
 *
 * @returns {string}
 */
export const generateStrongPassword = () => {
  const upper   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lower   = 'abcdefghijklmnopqrstuvwxyz'
  const digits  = '0123456789'
  const special = '!@#$%^&*()'
  const all     = upper + lower + digits + special

  const pick = (chars) => chars[Math.floor(Math.random() * chars.length)]

  // Guarantee at least one of each required character type
  const required = [
    pick(upper),
    pick(lower),
    pick(digits),
    pick(special),
  ]

  // Fill the rest of the password with random characters
  const rest = Array.from({ length: 8 }, () => pick(all))

  // Shuffle so the required chars aren't always at the start
  return [...required, ...rest]
    .sort(() => Math.random() - 0.5)
    .join('')
}

/**
 * Generate a random UUID (Universally Unique Identifier) v4.
 * Use this as a unique identifier for test records.
 *
 * Example output: "110e8400-e29b-41d4-a716-446655440000"
 *
 * @returns {string}
 */
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}


// =============================================================================
// 2. PERSON / IDENTITY DATA
// =============================================================================

/**
 * Generate a random full name (first + last).
 *
 * Example: generateFullName() → "James Miller"
 *
 * @returns {{ firstName: string, lastName: string, fullName: string }}
 */
export const generateFullName = () => {
  const firstNames = ['James', 'Oliver', 'Emma', 'Sophia', 'Liam', 'Ava', 'Noah', 'Isabella', 'Ethan', 'Mia']
  const lastNames  = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson', 'Taylor', 'Anderson']

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName  = lastNames[Math.floor(Math.random() * lastNames.length)]

  return {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
  }
}

/**
 * Generate a unique username from a base string + random suffix.
 * Useful for creating employee usernames that won't clash across test runs.
 *
 * Example: generateUsername('john') → "john_x3k9mz"
 *
 * @param {string} base - base name to prefix (default: 'user')
 * @returns {string}
 */
export const generateUsername = (base = 'user') => {
  return `${base}_${generateRandomString(6)}`
}

/**
 * Generate a random employee ID in OrangeHRM format.
 * Format: "EMP" followed by 4 random digits.
 *
 * Example: "EMP0042"
 *
 * @returns {string}
 */
export const generateEmployeeId = () => {
  const num = String(generateRandomNumber(1, 9999)).padStart(4, '0')
  return `EMP${num}`
}


// =============================================================================
// 3. ADDRESS DATA
// =============================================================================

/**
 * Generate a random UK-style address object.
 * Use this when testing address forms.
 *
 * Example output:
 * {
 *   street: "42 Baker Street",
 *   city:   "London",
 *   county: "Greater London",
 *   postcode: "SW1A 1AA",
 *   country: "United Kingdom"
 * }
 *
 * @returns {object}
 */
export const generateAddress = () => {
  const streets  = ['Baker Street', 'Oxford Road', 'Victoria Lane', 'King Street', 'Queen Avenue']
  const cities   = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Edinburgh']
  const counties = ['Greater London', 'Greater Manchester', 'West Midlands', 'West Yorkshire', 'Lothian']
  const postcodes = ['SW1A 1AA', 'M1 1AE', 'B1 1BB', 'LS1 1BA', 'EH1 1YZ']

  const index = Math.floor(Math.random() * cities.length)

  return {
    street:   `${generateRandomNumber(1, 999)} ${streets[Math.floor(Math.random() * streets.length)]}`,
    city:     cities[index],
    county:   counties[index],
    postcode: postcodes[index],
    country:  'United Kingdom',
  }
}


// =============================================================================
// 4. DATE HELPERS
// =============================================================================

/**
 * Get today's date formatted as a string.
 * Supported tokens: YYYY, MM, DD
 *
 * Example: getTodayFormatted('MM/DD/YYYY') → "05/16/2026"
 *          getTodayFormatted('DD-MM-YYYY') → "16-05-2026"
 *
 * @param {string} format - format string (default: 'YYYY-MM-DD')
 * @returns {string}
 */
export const getTodayFormatted = (format = 'YYYY-MM-DD') => {
  const now  = new Date()
  const yyyy = now.getFullYear()
  const mm   = String(now.getMonth() + 1).padStart(2, '0')
  const dd   = String(now.getDate()).padStart(2, '0')

  return format
    .replace('YYYY', yyyy)
    .replace('MM', mm)
    .replace('DD', dd)
}

/**
 * Get a future or past date relative to today.
 *
 * Example: getRelativeDate(7)    → date 7 days in the future
 *          getRelativeDate(-30)  → date 30 days in the past
 *
 * @param {number} daysOffset - positive = future, negative = past
 * @param {string} format     - format string (default: 'YYYY-MM-DD')
 * @returns {string}
 */
export const getRelativeDate = (daysOffset, format = 'YYYY-MM-DD') => {
  const date = new Date()
  date.setDate(date.getDate() + daysOffset)

  const yyyy = date.getFullYear()
  const mm   = String(date.getMonth() + 1).padStart(2, '0')
  const dd   = String(date.getDate()).padStart(2, '0')

  return format
    .replace('YYYY', yyyy)
    .replace('MM', mm)
    .replace('DD', dd)
}

/**
 * Get the name of the current month as a full string.
 *
 * Example: getCurrentMonthName() → "May"
 *
 * @returns {string}
 */
export const getCurrentMonthName = () => {
  return new Date().toLocaleString('default', { month: 'long' })
}

/**
 * Get the current year as a 4-digit number.
 *
 * Example: getCurrentYear() → 2026
 *
 * @returns {number}
 */
export const getCurrentYear = () => {
  return new Date().getFullYear()
}

/**
 * Check whether a date string represents a past date.
 *
 * Example: isPastDate('2020-01-01') → true
 *
 * @param {string} dateString - date in any JS-parseable format
 * @returns {boolean}
 */
export const isPastDate = (dateString) => {
  return new Date(dateString) < new Date()
}

/**
 * Check whether a date string represents a future date.
 *
 * Example: isFutureDate('2099-12-31') → true
 *
 * @param {string} dateString - date in any JS-parseable format
 * @returns {boolean}
 */
export const isFutureDate = (dateString) => {
  return new Date(dateString) > new Date()
}

/**
 * Calculate the number of days between two date strings.
 *
 * Example: daysBetween('2026-01-01', '2026-01-31') → 30
 *
 * @param {string} dateA - start date string
 * @param {string} dateB - end date string
 * @returns {number} absolute number of days between the two dates
 */
export const daysBetween = (dateA, dateB) => {
  const msPerDay = 1000 * 60 * 60 * 24
  return Math.abs(Math.round((new Date(dateB) - new Date(dateA)) / msPerDay))
}


// =============================================================================
// 5. STRING HELPERS
// =============================================================================

/**
 * Capitalise the first letter of a string.
 *
 * Example: capitalize('admin') → 'Admin'
 *
 * @param {string} str
 * @returns {string}
 */
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Convert a string to Title Case (capitalise every word).
 *
 * Example: toTitleCase('john william smith') → 'John William Smith'
 *
 * @param {string} str
 * @returns {string}
 */
export const toTitleCase = (str) => {
  if (!str) return ''
  return str.split(' ').map(capitalize).join(' ')
}

/**
 * Truncate a string to a maximum length and append '...' if truncated.
 *
 * Example: truncate('Hello World', 7) → 'Hello W...'
 *
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
export const truncate = (str, maxLength) => {
  if (!str || str.length <= maxLength) return str
  return str.substring(0, maxLength) + '...'
}

/**
 * Convert a string to a URL-friendly slug.
 * Lowercases, replaces spaces with hyphens, removes special characters.
 *
 * Example: slugify('Hello World!') → 'hello-world'
 *
 * @param {string} str
 * @returns {string}
 */
export const slugify = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
}

/**
 * Remove all leading and trailing whitespace from a string.
 * Also collapses multiple internal spaces into a single space.
 *
 * Example: normalizeWhitespace('  Hello   World  ') → 'Hello World'
 *
 * @param {string} str
 * @returns {string}
 */
export const normalizeWhitespace = (str) => {
  return str.trim().replace(/\s+/g, ' ')
}

/**
 * Mask sensitive data — replace middle characters with asterisks.
 * Use this when logging sensitive values (passwords, card numbers) in test output.
 *
 * Example: maskSensitive('admin123')   → 'ad****23'
 *          maskSensitive('4111111111') → '41******11'
 *
 * @param {string} str        - the string to mask
 * @param {number} showStart  - characters to show at start (default: 2)
 * @param {number} showEnd    - characters to show at end (default: 2)
 * @returns {string}
 */
export const maskSensitive = (str, showStart = 2, showEnd = 2) => {
  if (!str || str.length <= showStart + showEnd) return '****'
  const start  = str.substring(0, showStart)
  const end    = str.substring(str.length - showEnd)
  const masked = '*'.repeat(str.length - showStart - showEnd)
  return `${start}${masked}${end}`
}

/**
 * Count the number of occurrences of a substring inside a string.
 *
 * Example: countOccurrences('banana', 'an') → 2
 *
 * @param {string} str       - the full string to search in
 * @param {string} substring - the substring to count
 * @returns {number}
 */
export const countOccurrences = (str, substring) => {
  if (!str || !substring) return 0
  return str.split(substring).length - 1
}


// =============================================================================
// 6. NUMBER HELPERS
// =============================================================================

/**
 * Clamp a number between a minimum and maximum value.
 * If the number is below min, returns min.
 * If the number is above max, returns max.
 * Otherwise returns the number unchanged.
 *
 * Example: clamp(150, 0, 100) → 100
 *          clamp(-5,  0, 100) → 0
 *          clamp(42,  0, 100) → 42
 *
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max)
}

/**
 * Format a number as a currency string.
 *
 * Example: formatCurrency(1234.5)         → '£1,234.50'
 *          formatCurrency(9999, 'USD', 'en-US') → '$9,999.00'
 *
 * @param {number} amount         - the number to format
 * @param {string} currency       - ISO 4217 currency code (default: 'GBP')
 * @param {string} locale         - locale string (default: 'en-GB')
 * @returns {string}
 */
export const formatCurrency = (amount, currency = 'GBP', locale = 'en-GB') => {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
}

/**
 * Round a number to a specific number of decimal places.
 *
 * Example: roundTo(3.14159, 2) → 3.14
 *
 * @param {number} num    - number to round
 * @param {number} places - decimal places (default: 2)
 * @returns {number}
 */
export const roundTo = (num, places = 2) => {
  return Math.round(num * 10 ** places) / 10 ** places
}


// =============================================================================
// 7. VALIDATORS
// =============================================================================

/**
 * Check whether a string is a valid email address format.
 *
 * Example: isValidEmail('user@example.com') → true
 *          isValidEmail('not-an-email')      → false
 *
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Check whether a string is a valid UK mobile phone number.
 * Accepts formats: 07xxx xxxxxx or +447xxx xxxxxx
 *
 * @param {string} phone
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  return /^(\+44|0)7\d{9}$/.test(phone.replace(/\s/g, ''))
}

/**
 * Check whether a string is a valid URL (http or https).
 *
 * Example: isValidUrl('https://example.com') → true
 *          isValidUrl('not a url')            → false
 *
 * @param {string} url
 * @returns {boolean}
 */
export const isValidUrl = (url) => {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Check whether a value is null, undefined, or an empty string/array/object.
 *
 * Example: isEmpty('')         → true
 *          isEmpty([])         → true
 *          isEmpty({})         → true
 *          isEmpty(null)       → true
 *          isEmpty('hello')    → false
 *          isEmpty([1, 2])     → false
 *
 * @param {*} value
 * @returns {boolean}
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true
  if (typeof value === 'string')  return value.trim().length === 0
  if (Array.isArray(value))       return value.length === 0
  if (typeof value === 'object')  return Object.keys(value).length === 0
  return false
}

/**
 * Check whether a number falls within a min/max range (inclusive).
 *
 * Example: isInRange(50, 1, 100) → true
 *          isInRange(0,  1, 100) → false
 *
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {boolean}
 */
export const isInRange = (value, min, max) => {
  return value >= min && value <= max
}

/**
 * Check that a password meets minimum strength requirements:
 *   - At least 8 characters
 *   - At least one uppercase letter
 *   - At least one lowercase letter
 *   - At least one digit
 *   - At least one special character
 *
 * Use this in tests that verify password validation error messages.
 *
 * @param {string} password
 * @returns {boolean}
 */
export const isStrongPassword = (password) => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  )
}


// =============================================================================
// 8. ARRAY HELPERS
// =============================================================================

/**
 * Pick a random element from an array.
 *
 * Example: pickRandom(['red', 'green', 'blue']) → 'green'
 *
 * @param {Array} arr
 * @returns {*} a random element from the array
 */
export const pickRandom = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * Shuffle an array into a random order (non-destructive — returns new array).
 *
 * Example: shuffle([1, 2, 3, 4]) → [3, 1, 4, 2]
 *
 * @param {Array} arr
 * @returns {Array}
 */
export const shuffle = (arr) => {
  return [...arr].sort(() => Math.random() - 0.5)
}

/**
 * Remove duplicate values from an array.
 *
 * Example: unique([1, 2, 2, 3, 3]) → [1, 2, 3]
 *
 * @param {Array} arr
 * @returns {Array}
 */
export const unique = (arr) => {
  return [...new Set(arr)]
}

/**
 * Split an array into chunks of a given size.
 * Useful for batch processing test data.
 *
 * Example: chunk([1,2,3,4,5], 2) → [[1,2],[3,4],[5]]
 *
 * @param {Array}  arr  - the array to split
 * @param {number} size - the size of each chunk
 * @returns {Array[]}
 */
export const chunk = (arr, size) => {
  const result = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}


// =============================================================================
// 9. OBJECT HELPERS
// =============================================================================

/**
 * Deep clone an object (no shared references with the original).
 * Use this to safely mutate test data objects without affecting other tests.
 *
 * Example:
 *   const original = { user: { name: 'Admin' } }
 *   const copy = deepClone(original)
 *   copy.user.name = 'Changed'
 *   // original.user.name is still 'Admin'
 *
 * @param {object} obj
 * @returns {object}
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Merge two objects together (shallow merge — second object wins on conflicts).
 *
 * Example:
 *   mergeObjects({ a: 1, b: 2 }, { b: 99, c: 3 }) → { a: 1, b: 99, c: 3 }
 *
 * @param {object} base     - base object
 * @param {object} override - values to override or add
 * @returns {object}
 */
export const mergeObjects = (base, override) => {
  return { ...base, ...override }
}

/**
 * Pick a subset of keys from an object.
 * Use this to extract only the fields you need from a large fixture.
 *
 * Example: pickKeys({ a: 1, b: 2, c: 3 }, ['a', 'c']) → { a: 1, c: 3 }
 *
 * @param {object}   obj  - source object
 * @param {string[]} keys - array of keys to keep
 * @returns {object}
 */
export const pickKeys = (obj, keys) => {
  return keys.reduce((result, key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = obj[key]
    }
    return result
  }, {})
}

/**
 * Omit specific keys from an object, returning a new object without them.
 *
 * Example: omitKeys({ a: 1, b: 2, c: 3 }, ['b']) → { a: 1, c: 3 }
 *
 * @param {object}   obj  - source object
 * @param {string[]} keys - keys to remove
 * @returns {object}
 */
export const omitKeys = (obj, keys) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key))
  )
}


// =============================================================================
// 10. FILE HELPERS
// =============================================================================

/**
 * Get the file extension from a filename string.
 *
 * Example: getFileExtension('report.pdf') → 'pdf'
 *          getFileExtension('image.PNG')   → 'png'
 *
 * @param {string} filename
 * @returns {string} lowercase extension without the dot
 */
export const getFileExtension = (filename) => {
  return filename.split('.').pop().toLowerCase()
}

/**
 * Build a timestamped filename — useful for unique screenshot or download names.
 *
 * Example: buildTimestampedFilename('report', 'csv') → 'report_20260516_143022.csv'
 *
 * @param {string} baseName  - base name without extension
 * @param {string} extension - file extension without dot
 * @returns {string}
 */
export const buildTimestampedFilename = (baseName, extension) => {
  const now = new Date()
  const ts = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
    '_',
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
    String(now.getSeconds()).padStart(2, '0'),
  ].join('')

  return `${baseName}_${ts}.${extension}`
}

/**
 * Check whether a filename has an allowed extension.
 * Use this to verify file upload validation in your UI.
 *
 * Example: isAllowedFileType('photo.jpg', ['jpg','png','gif']) → true
 *          isAllowedFileType('virus.exe', ['jpg','png','gif']) → false
 *
 * @param {string}   filename      - the filename to check
 * @param {string[]} allowedTypes  - array of allowed extensions (lowercase, no dot)
 * @returns {boolean}
 */
export const isAllowedFileType = (filename, allowedTypes) => {
  return allowedTypes.includes(getFileExtension(filename))
}


// =============================================================================
// 11. TIMESTAMP & DATE FORMATTING (from the required method list)
// =============================================================================

/**
 * Get the current date and time as a Unix timestamp (milliseconds since epoch).
 * Use this to create unique identifiers or measure elapsed time in tests.
 *
 * Example: getTimestamp() → 1747392000000
 *
 * @returns {number} current timestamp in milliseconds
 */
export const getTimestamp = () => {
  return Date.now()
}

/**
 * Get the current date and time as a readable ISO string.
 *
 * Example: getTimestampString() → "2026-05-16T14:30:22.000Z"
 *
 * @returns {string}
 */
export const getTimestampString = () => {
  return new Date().toISOString()
}

/**
 * Format a Date object or date string into a specific display format.
 * Supported tokens: YYYY, MM, DD, HH, mm, ss
 *
 * Examples:
 *   formatDate(new Date(), 'DD/MM/YYYY')           → "16/05/2026"
 *   formatDate('2026-05-16', 'MM-DD-YYYY')         → "05-16-2026"
 *   formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')  → "2026-05-16 14:30:22"
 *
 * @param {Date|string} date   - the date to format (Date object or parseable string)
 * @param {string}      format - format string using YYYY MM DD HH mm ss tokens
 * @returns {string}
 */
export const formatDate = (date, format = 'YYYY-MM-DD') => {
  const d    = new Date(date)
  const yyyy = d.getFullYear()
  const MM   = String(d.getMonth() + 1).padStart(2, '0')
  const DD   = String(d.getDate()).padStart(2, '0')
  const HH   = String(d.getHours()).padStart(2, '0')
  const mm   = String(d.getMinutes()).padStart(2, '0')
  const ss   = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', yyyy)
    .replace('MM', MM)
    .replace('DD', DD)
    .replace('HH', HH)
    .replace('mm', mm)
    .replace('ss', ss)
}
