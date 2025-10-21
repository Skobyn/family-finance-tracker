/**
 * Environment Variable Validation
 *
 * This module validates all required environment variables for:
 * - Firebase (authentication and database)
 * - Plaid (financial data integration)
 * - Supabase (backend services)
 *
 * Throws descriptive errors if any required variables are missing or invalid.
 */

export interface EnvironmentConfig {
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId?: string;
  };
  plaid: {
    clientId: string;
    secret: string;
    env: 'sandbox' | 'development' | 'production';
    redirectUri: string;
  };
  supabase: {
    url: string;
    anonKey: string;
  };
}

/**
 * Validates a single environment variable
 */
function validateEnvVar(name: string, value: string | undefined, optional = false): string {
  if (!value || value.trim() === '') {
    if (optional) {
      return '';
    }
    throw new Error(
      `Missing required environment variable: ${name}\n` +
      `Please ensure ${name} is set in your .env.local file.\n` +
      `Refer to .env.example for the complete list of required variables.`
    );
  }
  return value.trim();
}

/**
 * Validates Plaid environment value
 */
function validatePlaidEnv(env: string | undefined): 'sandbox' | 'development' | 'production' {
  const validEnvs = ['sandbox', 'development', 'production'];

  if (!env || !validEnvs.includes(env)) {
    throw new Error(
      `Invalid PLAID_ENV: "${env}"\n` +
      `PLAID_ENV must be one of: ${validEnvs.join(', ')}\n` +
      `Current value: ${env || 'undefined'}`
    );
  }

  return env as 'sandbox' | 'development' | 'production';
}

/**
 * Validates URL format
 */
function validateUrl(name: string, url: string | undefined): string {
  const value = validateEnvVar(name, url);

  try {
    new URL(value);
    return value;
  } catch {
    throw new Error(
      `Invalid URL format for ${name}: "${value}"\n` +
      `Please provide a valid URL (e.g., https://example.com)`
    );
  }
}

/**
 * Validates all Firebase environment variables
 */
function validateFirebaseConfig() {
  return {
    apiKey: validateEnvVar('NEXT_PUBLIC_FIREBASE_API_KEY', process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
    authDomain: validateEnvVar('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
    projectId: validateEnvVar('NEXT_PUBLIC_FIREBASE_PROJECT_ID', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
    storageBucket: validateEnvVar('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
    messagingSenderId: validateEnvVar('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
    appId: validateEnvVar('NEXT_PUBLIC_FIREBASE_APP_ID', process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
    measurementId: validateEnvVar('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID', process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, true),
  };
}

/**
 * Validates all Plaid environment variables
 */
function validatePlaidConfig() {
  return {
    clientId: validateEnvVar('PLAID_CLIENT_ID', process.env.PLAID_CLIENT_ID),
    secret: validateEnvVar('PLAID_SECRET', process.env.PLAID_SECRET),
    env: validatePlaidEnv(process.env.PLAID_ENV),
    redirectUri: validateUrl('PLAID_REDIRECT_URI', process.env.PLAID_REDIRECT_URI),
  };
}

/**
 * Validates all Supabase environment variables
 */
function validateSupabaseConfig() {
  return {
    url: validateUrl('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL),
    anonKey: validateEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  };
}

/**
 * Main validation function - validates all environment variables
 *
 * @throws {Error} If any required environment variable is missing or invalid
 * @returns {EnvironmentConfig} Validated environment configuration
 */
export function validateEnvironment(): EnvironmentConfig {
  const errors: string[] = [];
  let firebase, plaid, supabase;

  // Validate Firebase config
  try {
    firebase = validateFirebaseConfig();
  } catch (error) {
    errors.push(`Firebase: ${error instanceof Error ? error.message : String(error)}`);
  }

  // Validate Plaid config
  try {
    plaid = validatePlaidConfig();
  } catch (error) {
    errors.push(`Plaid: ${error instanceof Error ? error.message : String(error)}`);
  }

  // Validate Supabase config
  try {
    supabase = validateSupabaseConfig();
  } catch (error) {
    errors.push(`Supabase: ${error instanceof Error ? error.message : String(error)}`);
  }

  // If there are any errors, throw a combined error message
  if (errors.length > 0) {
    throw new Error(
      `Environment validation failed:\n\n` +
      errors.map((err, i) => `${i + 1}. ${err}`).join('\n\n') +
      `\n\nPlease check your .env.local file and ensure all required variables are set.` +
      `\nRefer to .env.example for the complete list.`
    );
  }

  return {
    firebase: firebase!,
    plaid: plaid!,
    supabase: supabase!,
  };
}

/**
 * Validates only Firebase environment variables (for selective validation)
 */
export function validateFirebaseEnvironment() {
  try {
    return validateFirebaseConfig();
  } catch (error) {
    throw new Error(
      `Firebase environment validation failed:\n` +
      `${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Validates only Plaid environment variables (for selective validation)
 */
export function validatePlaidEnvironment() {
  try {
    return validatePlaidConfig();
  } catch (error) {
    throw new Error(
      `Plaid environment validation failed:\n` +
      `${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Validates only Supabase environment variables (for selective validation)
 */
export function validateSupabaseEnvironment() {
  try {
    return validateSupabaseConfig();
  } catch (error) {
    throw new Error(
      `Supabase environment validation failed:\n` +
      `${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Checks if all environment variables are set (without throwing)
 * Useful for providing warnings instead of errors
 */
export function checkEnvironment(): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    validateFirebaseConfig();
  } catch (error) {
    errors.push(`Firebase: ${error instanceof Error ? error.message : String(error)}`);
  }

  try {
    validatePlaidConfig();
  } catch (error) {
    errors.push(`Plaid: ${error instanceof Error ? error.message : String(error)}`);
  }

  try {
    validateSupabaseConfig();
  } catch (error) {
    errors.push(`Supabase: ${error instanceof Error ? error.message : String(error)}`);
  }

  // Check for optional variables
  if (!process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) {
    warnings.push('Firebase Analytics measurement ID not set (optional)');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
