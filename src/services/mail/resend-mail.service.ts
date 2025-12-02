/**
 * @file src/services/mail/resend-mail.service.ts
 * @title Resend Mail Service Implementation
 * @description Implementation of IMailService using the Resend API.
 * @author Noé Henchoz
 * @date 2025-12-02
 * @license MIT
 * @copyright (c) 2025 Noé Henchoz
 */

import { config } from '@config/env.js'
import { log } from '@config/logger.js'
import type { IMailService } from '@services/mail/mail.service.interface.js'
import { injectable } from 'inversify'
import { Resend } from 'resend'

@injectable()
export class ResendMailService implements IMailService {
    private resend: Resend

    constructor() {
        this.resend = new Resend(config.resendApiKey)
    }

    async sendVerificationEmail(to: string, token: string): Promise<void> {
        const verifyUrl = `${config.frontendUrl}/verify-email?token=${token}`

        // TODO: Use Handlebars for better HTML templating
        const htmlContent = `
            <h1>Verify your email</h1>
            <p>Click <a href="${verifyUrl}">here</a> to verify your email address.</p>
            <p>Or copy this link: ${verifyUrl}</p>
        `

        try {
            await this.resend.emails.send({
                from: config.emailFrom,
                html: htmlContent,
                subject: 'Verify your email',
                to,
            })
            log.info(`Verification email sent to ${to}`)
        } catch (error) {
            log.error('Failed to send verification email', error)
        }
    }

    async sendPasswordResetEmail(to: string, token: string): Promise<void> {
        const resetUrl = `${config.frontendUrl}/reset-password?token=${token}`

        const htmlContent = `
            <h1>Reset your password</h1>
            <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
            <p>Or copy this link: ${resetUrl}</p>
            <p>This link will expire in 1 hour.</p>
        `

        try {
            await this.resend.emails.send({
                from: config.emailFrom,
                html: htmlContent,
                subject: 'Reset your password',
                to,
            })
            log.info(`Password reset email sent to ${to}`)
        } catch (error) {
            log.error('Failed to send password reset email', error)
        }
    }
}
