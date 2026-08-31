import apiClient from "./api";

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const sendContactMessage = async (payload: ContactPayload): Promise<{ success: boolean }> => {
  try {
    const response = await apiClient.post('/contact', payload);
    return response.data;
  } catch (error) {
    console.error('Contact message error:', error);
    throw new Error('Failed to send message. Please try again later.');
  }
};

export const subscribeNewsletter = async (email: string): Promise<{ success: boolean }> => {
  try {
    const response = await apiClient.post('/newsletter/subscribe', { email });
    return response.data;
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    throw new Error('Failed to subscribe. Please try again later.');
  }
};