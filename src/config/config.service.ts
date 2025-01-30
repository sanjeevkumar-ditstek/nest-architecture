import { parse } from 'dotenv';
import * as joi from 'joi';
import * as fs from 'fs';

/**
 * Key-value mapping
 */
export interface EnvConfig {
  [key: string]: string;
}

/**
 * Config Service
 */
export class ConfigService {
  /**
   * Object that will contain the injected environment variables
   */
  private readonly envConfig: EnvConfig;

  /**
   * Constructor
   * @param {string} filePath
   */
  constructor(filePath: string) {
    const config = parse(fs.readFileSync(filePath));
    this.envConfig = ConfigService.validateInput(config);
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   * @param {EnvConfig} envConfig the configuration object with variables from the configuration file
   * @returns {EnvConfig} a validated environment configuration object
   */
  private static validateInput(envConfig: EnvConfig): EnvConfig {
    /**
     * A schema to validate envConfig against
     */
    const envVarsSchema: joi.ObjectSchema = joi.object({
      APP_ENV: joi.string().valid('dev', 'prod').default('dev'),
      APP_URL: joi.string().uri({
        scheme: [/https?/],
      }),
      WEBTOKEN_SECRET_KEY: joi.string().required(),
      WEBTOKEN_EXPIRATION_TIME: joi.number().default(1800),
      DB_URL: joi.string().regex(/^mongodb/),
      EMAIL_PROVIDER: joi.string().valid('smtp', 'sendgrid').required(),
      SMTP_HOST: joi.string().when('EMAIL_PROVIDER', {
        is: 'smtp',
        then: joi.required(),
      }),
      SMTP_PORT: joi.number().when('EMAIL_PROVIDER', {
        is: 'smtp',
        then: joi.required(),
      }),
      SMTP_USER: joi.string().when('EMAIL_PROVIDER', {
        is: 'smtp',
        then: joi.required(),
      }),
      SMTP_PASS: joi.string().when('EMAIL_PROVIDER', {
        is: 'smtp',
        then: joi.required(),
      }),
      SENDGRID_API_KEY: joi.string().when('EMAIL_PROVIDER', {
        is: 'sendgrid',
        then: joi.required(),
      }),
      FROM_EMAIL: joi.string().email().required(),
      SMS_PROVIDER: joi.string().required(),
      TWILIO_ACCOUNT_SID: joi.string().required(),
      TWILIO_AUTH_TOKEN: joi.string().required(),
      TWILIO_PHONE_NUMBER: joi.string().required(),
      AWS_REGION: joi.string().required(),
      AWS_ACCESS_KEY_ID: joi.string().required(),
      AWS_SECRET_ACCESS_KEY: joi.string().required(),
      AWS_S3_BUCKET_NAME: joi.string().required(),
      GOOGLE_CLIENT_ID: joi.string().required(),
      GOOGLE_CLIENT_SECRET: joi.string().required(),
      GOOGLE_CALLBACK_URL: joi.string().required(),
      FACEBOOK_APP_ID: joi.string().required(),
      FACEBOOK_APP_SECRET: joi.string().required(),
      FACEBOOK_CALLBACK_URL: joi.string().required(),
      APPLE_CLIENT_ID: joi.string().required(),
      APPLE_TEAM_ID: joi.string().required(),
      APPLE_KEY_ID: joi.string().required(),
      APPLE_PRIVATE_KEY: joi.string().required(),
      APPLE_CALLBACK_URL: joi.string().required(),
    });

    /**
     * Represents the status of validation check on the configuration file
     */
    const { error, value: validatedEnvConfig } =
      envVarsSchema.validate(envConfig);
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  /**
   * Fetches the key from the configuration file
   * @param {string} key
   * @returns {string} the associated value for a given key
   */
  get(key: string): string {
    return this.envConfig[key];
  }

  /**
   * Checks whether the application environment set in the configuration file matches the environment parameter
   * @param {string} env
   * @returns {boolean} Whether or not the environment variable matches the application environment
   */
  isEnv(env: string): boolean {
    return this.envConfig.APP_ENV === env;
  }
}
