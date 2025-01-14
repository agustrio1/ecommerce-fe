'use server';

import { getToken, clearToken, revalidatePath } from '@/utils/token';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Fetch all discounts.
 * @returns {Promise<any[]>} - A list of discounts or an empty array if an error occurs.
 */
export async function fetchDiscounts(): Promise<any[]> {
  try {
    const token = await getToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/discounts`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        await clearToken();
        throw new Error("Authentication failed - please log in again");
      }
      throw new Error(data.error || data.message || "Failed to fetch discounts");
    }

    return data;
  } catch (error: any) {
    console.error('Error fetching discounts:', error);
    return [];
  }
}

/**
 * Create a new discount.
 * @param {FormData} formData - The form data containing discount details.
 * @returns {Promise<{success: boolean; data?: any; error?: string}>}
 */
export async function createDiscount(formData: FormData): Promise<{ success: boolean; data?: any; error?: string; }> {
  try {
    const token = await getToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const requestBody = {
      code: formData.get('code'),
      description: formData.get('description'),
      value: Number(formData.get('value')),
      discountType: formData.get('discountType'),
      expiresAt: formData.get('expiresAt'),
      minPurchase: Number(formData.get('minPurchase')) || null,
      maxDiscount: Number(formData.get('maxDiscount')) || null,
      maxUsage: Number(formData.get('maxUsage')) || null,
    };

    // console.log('Request Body:', requestBody);

    const response = await fetch(`${API_URL}/discounts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        await clearToken();
        throw new Error("Authentication failed - please log in again");
      }
      console.error('Backend Error Response:', data);
      const errorMessage = data.error || data.message || JSON.stringify(data);
      throw new Error(errorMessage);
    }

    revalidatePath('/dashboard/discount/');
    return { success: true, data };
  } catch (error: any) {
    console.error('Error creating discount:', error.message || error);
    return { success: false, error: error.message || "An unknown error occurred" };
  }
}


/**
 * Delete a discount by ID.
 * @param {string} id - The ID of the discount to delete.
 * @returns {Promise<{success: boolean; data?: any; error?: string}>}
 */
export async function deleteDiscount(id: string): Promise<{ success: boolean; data?: any; error?: string; }> {
  try {
    const token = await getToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/discounts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    // DELETE requests might not have a response body.
    if (!response.ok) {
      if (response.status === 401) {
        await clearToken();
        throw new Error("Authentication failed - please log in again");
      }
      
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to delete discount");
    }

    revalidatePath('/dashboard/discount/');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting discount:', error.message || error);
    return { success: false, error: error.message || "An unknown error occurred" };
  }
}
