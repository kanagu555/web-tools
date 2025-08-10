/**
 * Web3Forms integration for contact forms
 */

// Web3Forms API key from environment variables
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

// Check if Web3Forms is configured
export const isWeb3FormsConfigured = !!WEB3FORMS_KEY;

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  tool?: string;
  type?: 'contact' | 'feedback' | 'bug_report' | 'feature_request';
}

/**
 * Submit contact form using Web3Forms
 */
export const submitContactForm = async (formData: ContactFormData): Promise<{
  success: boolean;
  message: string;
}> => {
  if (!isWeb3FormsConfigured) {
    throw new Error('Contact form service not configured');
  }

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        ...formData,
        from_name: formData.name,
        from_email: formData.email,
        subject: `KodeKit Contact: ${formData.subject}`,
        message: `
Name: ${formData.name}
Email: ${formData.email}
Tool: ${formData.tool || 'General'}
Type: ${formData.type || 'contact'}

Message:
${formData.message}
        `.trim(),
      }),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      return {
        success: true,
        message: 'Message sent successfully!',
      };
    } else {
      return {
        success: false,
        message: result.message || 'Failed to send message',
      };
    }
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return {
      success: false,
      message: 'Network error. Please try again.',
    };
  }
};