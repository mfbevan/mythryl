import type { FarcasterAppConfig, FarcasterAccountAssociation } from "./farcaster-manifest.validator";

export type ValidationStatus = "valid" | "warning" | "error" | "missing";

export interface FieldValidation {
  status: ValidationStatus;
  message: string;
  suggestion?: string;
}

export interface ManifestValidationResult {
  fields: Record<string, FieldValidation>;
  overallStatus: ValidationStatus;
  requiredMissing: string[];
  warnings: string[];
  errors: string[];
}

const PRIMARY_CATEGORIES = [
  "games",
  "social",
  "finance",
  "utility",
  "productivity",
  "entertainment",
  "news",
  "health-fitness",
  "lifestyle",
  "education",
  "developer-tools",
  "shopping",
  "sports",
] as const;

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isValidHexColor = (color: string): boolean => {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
};

const hasEmojisOrSpecialChars = (str: string): boolean => {
  // Check for emojis and special characters (allow alphanumeric, spaces, basic punctuation)
  const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  return emojiRegex.test(str);
};

const isLowercaseNoSpaces = (str: string): boolean => {
  return /^[a-z0-9-]+$/.test(str);
};

export const validateManifestField = (
  field: string,
  value: unknown,
  _config: FarcasterAppConfig,
): FieldValidation => {
  switch (field) {
    case "version":
      if (!value) {
        return {
          status: "warning",
          message: "Version not specified",
          suggestion: "Set version to \"1\" for production apps",
        };
      }
      if (value !== "1") {
        const versionStr = typeof value === "string" ? value : JSON.stringify(value);
        return {
          status: "warning",
          message: `Version "${versionStr}" may not be supported`,
          suggestion: "Use version \"1\" for production apps",
        };
      }
      return { status: "valid", message: "Valid version" };

    case "name":
      if (!value || typeof value !== "string") {
        return {
          status: "error",
          message: "Name is required",
          suggestion: "Add a name for your miniapp (max 32 characters)",
        };
      }
      if (value.length > 32) {
        return {
          status: "error",
          message: `Name is ${value.length} characters (max 32)`,
          suggestion: "Shorten the name to 32 characters or less",
        };
      }
      return { status: "valid", message: `${value.length}/32 characters` };

    case "subtitle":
      if (!value) {
        return { status: "missing", message: "Optional field not set" };
      }
      if (typeof value === "string") {
        if (value.length > 30) {
          return {
            status: "error",
            message: `Subtitle is ${value.length} characters (max 30)`,
            suggestion: "Shorten to 30 characters or less",
          };
        }
        if (hasEmojisOrSpecialChars(value)) {
          return {
            status: "warning",
            message: "Subtitle contains emojis or special characters",
            suggestion: "Remove emojis and special characters for best compatibility",
          };
        }
      }
      return { status: "valid", message: `${(value as string).length}/30 characters` };

    case "description":
      if (!value) {
        return { status: "missing", message: "Optional field not set" };
      }
      if (typeof value === "string") {
        if (value.length > 170) {
          return {
            status: "error",
            message: `Description is ${value.length} characters (max 170)`,
            suggestion: "Shorten to 170 characters or less",
          };
        }
        if (hasEmojisOrSpecialChars(value)) {
          return {
            status: "warning",
            message: "Description contains emojis or special characters",
            suggestion: "Remove emojis and special characters for best compatibility",
          };
        }
      }
      return { status: "valid", message: `${(value as string).length}/170 characters` };

    case "homeUrl":
      if (!value || typeof value !== "string") {
        return {
          status: "error",
          message: "Home URL is required",
          suggestion: "Add your miniapp's home URL",
        };
      }
      if (value.length > 1024) {
        return {
          status: "error",
          message: `URL is ${value.length} characters (max 1024)`,
          suggestion: "Shorten the URL",
        };
      }
      if (!isValidUrl(value)) {
        return {
          status: "error",
          message: "Invalid URL format",
          suggestion: "Use a valid URL starting with https://",
        };
      }
      if (!value.startsWith("https://")) {
        return {
          status: "warning",
          message: "URL should use HTTPS",
          suggestion: "Use https:// for security",
        };
      }
      return { status: "valid", message: "Valid URL" };

    case "iconUrl":
      if (!value || typeof value !== "string") {
        return {
          status: "error",
          message: "Icon URL is required",
          suggestion: "Add a 1024x1024px PNG icon URL",
        };
      }
      if (!isValidUrl(value)) {
        return {
          status: "error",
          message: "Invalid URL format",
          suggestion: "Use a valid URL",
        };
      }
      return {
        status: "valid",
        message: "Valid URL (should be 1024x1024px PNG, no alpha)",
      };

    case "splashImageUrl":
      if (!value) {
        return { status: "missing", message: "Optional field not set" };
      }
      if (!isValidUrl(value as string)) {
        return {
          status: "error",
          message: "Invalid URL format",
          suggestion: "Use a valid URL",
        };
      }
      return {
        status: "valid",
        message: "Valid URL (should be 200x200px)",
      };

    case "splashBackgroundColor":
      if (!value) {
        return { status: "missing", message: "Optional field not set" };
      }
      if (!isValidHexColor(value as string)) {
        return {
          status: "error",
          message: "Invalid hex color format",
          suggestion: "Use format #RRGGBB (e.g., #ffffff)",
        };
      }
      return { status: "valid", message: "Valid hex color" };

    case "webhookUrl":
      if (!value) {
        return {
          status: "missing",
          message: "Not set (required for notifications)",
        };
      }
      if (!isValidUrl(value as string)) {
        return {
          status: "error",
          message: "Invalid URL format",
          suggestion: "Use a valid webhook URL",
        };
      }
      return { status: "valid", message: "Valid webhook URL" };

    case "primaryCategory":
      if (!value) {
        return { status: "missing", message: "Optional field not set" };
      }
      if (!PRIMARY_CATEGORIES.includes(value as typeof PRIMARY_CATEGORIES[number])) {
        const categoryStr = typeof value === "string" ? value : JSON.stringify(value);
        return {
          status: "error",
          message: `"${categoryStr}" is not a valid category`,
          suggestion: `Use one of: ${PRIMARY_CATEGORIES.join(", ")}`,
        };
      }
      return { status: "valid", message: "Valid category" };

    case "tags":
      if (!value || !Array.isArray(value) || value.length === 0) {
        return { status: "missing", message: "Optional field not set" };
      }
      if (value.length > 5) {
        return {
          status: "error",
          message: `${value.length} tags (max 5)`,
          suggestion: "Reduce to 5 or fewer tags",
        };
      }
      const invalidTags = value.filter(
        (tag) => typeof tag !== "string" || tag.length > 20 || !isLowercaseNoSpaces(tag),
      );
      if (invalidTags.length > 0) {
        return {
          status: "error",
          message: "Some tags are invalid",
          suggestion: "Tags must be lowercase, no spaces, max 20 chars each",
        };
      }
      return { status: "valid", message: `${value.length}/5 tags` };

    case "tagline":
      if (!value) {
        return { status: "missing", message: "Optional field not set" };
      }
      if (typeof value === "string" && value.length > 30) {
        return {
          status: "error",
          message: `Tagline is ${value.length} characters (max 30)`,
          suggestion: "Shorten to 30 characters or less",
        };
      }
      return { status: "valid", message: `${(value as string).length}/30 characters` };

    case "heroImageUrl":
      if (!value) {
        return { status: "missing", message: "Optional field not set" };
      }
      if (!isValidUrl(value as string)) {
        return {
          status: "error",
          message: "Invalid URL format",
          suggestion: "Use a valid URL",
        };
      }
      return {
        status: "valid",
        message: "Valid URL (should be 1200x630px)",
      };

    case "imageUrl":
      if (!value) {
        return { status: "missing", message: "Optional field not set" };
      }
      if (!isValidUrl(value as string)) {
        return {
          status: "error",
          message: "Invalid URL format",
          suggestion: "Use a valid URL",
        };
      }
      return { status: "valid", message: "Valid URL" };

    case "ogTitle":
      if (!value) {
        return { status: "missing", message: "Optional field not set" };
      }
      if (typeof value === "string" && value.length > 30) {
        return {
          status: "error",
          message: `OG Title is ${value.length} characters (max 30)`,
          suggestion: "Shorten to 30 characters or less",
        };
      }
      return { status: "valid", message: `${(value as string).length}/30 characters` };

    case "ogDescription":
      if (!value) {
        return { status: "missing", message: "Optional field not set" };
      }
      if (typeof value === "string" && value.length > 100) {
        return {
          status: "error",
          message: `OG Description is ${value.length} characters (max 100)`,
          suggestion: "Shorten to 100 characters or less",
        };
      }
      return { status: "valid", message: `${(value as string).length}/100 characters` };

    case "ogImageUrl":
      if (!value) {
        return { status: "missing", message: "Optional field not set" };
      }
      if (!isValidUrl(value as string)) {
        return {
          status: "error",
          message: "Invalid URL format",
          suggestion: "Use a valid URL",
        };
      }
      return {
        status: "valid",
        message: "Valid URL (should be 1200x630px PNG)",
      };

    case "canonicalDomain":
      if (!value) {
        return { status: "missing", message: "Optional field not set" };
      }
      if (typeof value === "string") {
        if (value.includes("://")) {
          return {
            status: "error",
            message: "Should not include protocol",
            suggestion: "Use domain only (e.g., app.example.com)",
          };
        }
        if (value.includes("/")) {
          return {
            status: "error",
            message: "Should not include path",
            suggestion: "Use domain only (e.g., app.example.com)",
          };
        }
      }
      return { status: "valid", message: "Valid domain" };

    case "buttonTitle":
      if (!value) {
        return { status: "missing", message: "Optional field not set" };
      }
      return { status: "valid", message: "Set" };

    default:
      return { status: "valid", message: "Unknown field" };
  }
};

export const validateAccountAssociation = (
  association: FarcasterAccountAssociation | undefined,
): FieldValidation => {
  if (!association) {
    return {
      status: "warning",
      message: "Not signed",
      suggestion: "Sign your manifest to publish to Farcaster",
    };
  }

  const { header, payload, signature } = association;

  if (!header || !payload || !signature) {
    return {
      status: "error",
      message: "Incomplete signature",
      suggestion: "All of header, payload, and signature are required",
    };
  }

  // Basic base64 validation
  const isBase64 = (str: string) => {
    try {
      return btoa(atob(str)) === str;
    } catch {
      return false;
    }
  };

  if (!isBase64(header) || !isBase64(payload) || !isBase64(signature)) {
    return {
      status: "warning",
      message: "Signature fields may not be properly encoded",
      suggestion: "Ensure all fields are valid base64 encoded strings",
    };
  }

  return { status: "valid", message: "Manifest is signed" };
};

export const validateManifest = (
  config: FarcasterAppConfig,
  accountAssociation?: FarcasterAccountAssociation,
): ManifestValidationResult => {
  const fields: Record<string, FieldValidation> = {};
  const requiredMissing: string[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];

  const allFields = [
    "version",
    "name",
    "subtitle",
    "description",
    "homeUrl",
    "iconUrl",
    "imageUrl",
    "heroImageUrl",
    "buttonTitle",
    "tagline",
    "splashImageUrl",
    "splashBackgroundColor",
    "webhookUrl",
    "primaryCategory",
    "tags",
    "ogTitle",
    "ogDescription",
    "ogImageUrl",
    "canonicalDomain",
  ];

  const requiredFields = ["name", "homeUrl", "iconUrl"];

  for (const field of allFields) {
    const value = config[field as keyof FarcasterAppConfig];
    const validation = validateManifestField(field, value, config);
    fields[field] = validation;

    if (validation.status === "error") {
      errors.push(`${field}: ${validation.message}`);
      if (requiredFields.includes(field) && !value) {
        requiredMissing.push(field);
      }
    } else if (validation.status === "warning") {
      warnings.push(`${field}: ${validation.message}`);
    }
  }

  // Add account association validation
  const accountAssociationValidation = validateAccountAssociation(accountAssociation);
  fields.accountAssociation = accountAssociationValidation;
  if (accountAssociationValidation.status === "warning") {
    warnings.push(`accountAssociation: ${accountAssociationValidation.message}`);
  } else if (accountAssociationValidation.status === "error") {
    errors.push(`accountAssociation: ${accountAssociationValidation.message}`);
  }

  let overallStatus: ValidationStatus = "valid";
  if (errors.length > 0) {
    overallStatus = "error";
  } else if (warnings.length > 0) {
    overallStatus = "warning";
  }

  return {
    fields,
    overallStatus,
    requiredMissing,
    warnings,
    errors,
  };
};
