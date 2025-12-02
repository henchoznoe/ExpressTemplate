/**
 * @file src/services/mail/mail.service.interface.ts
 * @title Mail Service Interface
 * @description Contract for email sending services.
 * @author Noé Henchoz
 * @date 2025-12-02
 * @license MIT
 * @copyright (c) 2025 Noé Henchoz
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
