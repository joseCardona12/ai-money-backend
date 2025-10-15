import { ValidationError } from "../errors/customErrors";

export class AuthValidators {
  public static validateLoginParams(email: string, password: string): void {
    if (!email || !password) {
      throw new ValidationError("Email and password are required");
    }

    if (typeof email !== "string" || typeof password !== "string") {
      throw new ValidationError("Email and password must be strings");
    }

    if (email.trim().length === 0) {
      throw new ValidationError("Email cannot be empty");
    }

    if (password.trim().length === 0) {
      throw new ValidationError("Password cannot be empty");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError("Invalid email format");
    }
    if (password.length < 6) {
      throw new ValidationError("Password must be at least 6 characters long");
    }
  }

  public static validateRegisterParams(
    fullName: string,
    email: string,
    password: string,
    phone_number: string,
    address: string,
    bio: string,
    profile_picture: string,
    role_id: number,
    provider_id: number
  ): void {
    // Validar campos requeridos
    if (
      !fullName ||
      !email ||
      !password ||
      !phone_number ||
      !address ||
      !bio ||
      !profile_picture ||
      !role_id ||
      !provider_id
    ) {
      throw new ValidationError("All fields are required");
    }

    // Validar tipos
    if (
      typeof fullName !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof phone_number !== "string" ||
      typeof address !== "string" ||
      typeof bio !== "string" ||
      typeof profile_picture !== "string"
    ) {
      throw new ValidationError("String fields must be valid strings");
    }

    if (typeof role_id !== "number" || typeof provider_id !== "number") {
      throw new ValidationError("role_id and provider_id must be numbers");
    }

    // Validar longitudes mínimas
    if (fullName.trim().length < 2) {
      throw new ValidationError("Full name must be at least 2 characters long");
    }

    if (phone_number.trim().length < 10) {
      throw new ValidationError(
        "Phone number must be at least 10 characters long"
      );
    }

    if (address.trim().length < 5) {
      throw new ValidationError("Address must be at least 5 characters long");
    }

    if (bio.trim().length < 10) {
      throw new ValidationError("Bio must be at least 10 characters long");
    }

    // Validar email y password usando el método existente
    this.validateLoginParams(email, password);

    // Validar IDs positivos
    if (role_id <= 0 || provider_id <= 0) {
      throw new ValidationError(
        "role_id and provider_id must be positive numbers"
      );
    }

    // Validar formato de teléfono (básico)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone_number.replace(/[\s\-\(\)]/g, ""))) {
      throw new ValidationError("Invalid phone number format");
    }
  }
}
