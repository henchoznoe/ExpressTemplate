/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/services/mail/mail.service.interface.ts
 * @title Mail Service Interface
 * @description Contract for email sending services.
 * @last-modified 2025-11-20
 */

export interface IMailService {
    /**
     * Sends a verification email to the user upon registration.
     * @param to - The recipient's email address.
     * @param token - The verification token.
     */
    sendVerificationEmail(to: string, token: string): Promise<void>

    /**
     * Sends a password reset email.
     * @param to - The recipient's email address.
     * @param token - The reset token.
     */
    sendPasswordResetEmail(to: string, token: string): Promise<void>
}
