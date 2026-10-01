/**
 * Customer Authentication & Registration API Client (Module 1)
 * Powered by dual-mode Spring Boot 3 / mockDb integration
 */

import { apiClient, executeWithFallback } from './client';
import { mockDb } from './mockDataStore';
import type { Customer, AppUser } from '../types/oms';

export interface RegisterCustomerRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  shippingAddress: string;
  city: string;
  district: string;
  province: string;
  postalCode?: string;
}

export interface AuthResponse {
  token?: string;
  email: string;
  role?: string;
  userId?: number;
  message?: string;
  user?: AppUser;
  customer?: Customer;
}

export async function registerCustomer(
  data: RegisterCustomerRequest
): Promise<{ success: boolean; message: string; customerId?: number }> {
  return executeWithFallback(
    async () => {
      const res = await apiClient.post('/auth/register', data);
      return {
        success: true,
        message: res.data?.message || 'Account created successfully!',
        customerId: res.data?.customerId,
      };
    },
    () => {
      // Create user and customer profile in mockDb
      const existing = mockDb.getUserByEmail(data.email);
      if (existing) {
        throw new Error('An account with this email already exists.');
      }
      const customer = mockDb.createCustomer({
        userId: null,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        contactNumber: data.contactNumber,
        shippingAddress: data.shippingAddress,
        city: data.city,
        district: data.district,
        province: data.province,
        postalCode: data.postalCode || null,
      });

      return {
        success: true,
        message: 'Account created successfully! You can now sign in.',
        customerId: customer.customerId,
      };
    }
  );
}

export async function loginCustomer(email: string, password: string): Promise<AuthResponse> {
  return executeWithFallback(
    async () => {
      const res = await apiClient.post<AuthResponse>('/auth/login', { email, password });
      if (res.data?.token) {
        localStorage.setItem('dfine_jwt_token', res.data.token);
      }
      return res.data;
    },
    () => {
      const authResult = mockDb.authenticate(email, password);
      if (!authResult.success || !authResult.user) {
        throw new Error(authResult.message || 'Invalid email or password.');
      }

      const mockToken = `mock_jwt_${btoa(`${email}:${Date.now()}`)}`;
      localStorage.setItem('dfine_jwt_token', mockToken);

      return {
        token: mockToken,
        email: authResult.user.email,
        role: authResult.user.userRole,
        userId: authResult.user.userId,
        user: authResult.user,
        customer: authResult.customer,
        message: 'Signed in successfully',
      };
    }
  );
}

export async function requestPasswordReset(email: string): Promise<{ success: boolean; message: string; tokenHash?: string }> {
  return executeWithFallback(
    async () => {
      const res = await apiClient.post('/auth/password-reset/request', { email });
      return res.data;
    },
    () => {
      const user = mockDb.getUserByEmail(email);
      if (!user) {
        throw new Error('No registered account was found with that email address.');
      }
      const token = mockDb.createPasswordResetToken(user.userId);
      return {
        success: true,
        message: `Reset instructions generated for ${email}. Token valid for 15 minutes.`,
        tokenHash: token.tokenHash,
      };
    }
  );
}

export async function resetPasswordWithToken(
  tokenHash: string,
  newPasswordHash: string
): Promise<{ success: boolean; message: string }> {
  return executeWithFallback(
    async () => {
      const res = await apiClient.post('/auth/password-reset/confirm', {
        token: tokenHash,
        newPassword: newPasswordHash,
      });
      return res.data;
    },
    () => {
      const result = mockDb.verifyAndConsumeResetToken(tokenHash);
      if (!result.valid || !result.user) {
        throw new Error(result.message || 'Invalid or expired password reset token.');
      }
      return {
        success: true,
        message: 'Password updated successfully. You may now log in with your new credentials.',
      };
    }
  );
}
