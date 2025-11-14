import React, { useState } from 'react';
import { useForm } from '@/hooks/useForm';
import { validateContactForm } from '@/utils/validation';
import { sendContactEmail } from '@/lib/mailer';
import { toast } from 'react-toastify';
import Button from '@/components/common/Button';
import clsx from 'clsx';

/**
 * ContactForm Component
 * Contact form with validation and submission
 */

const ContactForm = ({ className = '' }) => {
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (values) => {
    try {
      const result = await sendContactEmail(values);
      
      if (result.success) {
        toast.success(result.message || 'Message sent successfully!');
        setSubmitSuccess(true);
        resetForm();
      } else {
        toast.error(result.error || 'Failed to send message');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error('Contact form error:', error);
    }
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit: onSubmit,
    getFieldProps,
    hasError,
    resetForm,
  } = useForm(
    {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
    (values) => {
      const validation = validateContactForm(values);
      return validation.errors;
    },
    handleSubmit
  );

  const FormInput = ({ label, name, type = 'text', required = false, ...props }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-neutral-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        {...getFieldProps(name)}
        id={name}
        type={type}
        className={clsx(
          'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all',
          hasError(name)
            ? 'border-red-500 bg-red-50'
            : 'border-neutral-300 bg-white'
        )}
        {...props}
      />
      {hasError(name) && (
        <p className="mt-1 text-sm text-red-600">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <form onSubmit={onSubmit} className={clsx('space-y-6', className)}>
      {submitSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm font-medium">
            ✓ Your message has been sent successfully! We'll get back to you soon.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Full Name"
          name="name"
          required
          placeholder="John Doe"
        />
        
        <FormInput
          label="Email Address"
          name="email"
          type="email"
          required
          placeholder="john@example.com"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Phone Number"
          name="phone"
          type="tel"
          placeholder="+1 (555) 123-4567"
        />
        
        <FormInput
          label="Subject"
          name="subject"
          placeholder="Inquiry about properties"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          {...getFieldProps('message')}
          id="message"
          rows={6}
          className={clsx(
            'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none',
            hasError('message')
              ? 'border-red-500 bg-red-50'
              : 'border-neutral-300 bg-white'
          )}
          placeholder="Tell us how we can help you..."
        />
        {hasError('message') && (
          <p className="mt-1 text-sm text-red-600">{errors.message}</p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>

      <p className="text-xs text-neutral-500 text-center">
        By submitting this form, you agree to our{' '}
        <a href="/legal/privacy" className="text-primary-600 hover:underline">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
};

export default ContactForm;
