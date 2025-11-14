import React from 'react';
import { useForm } from '@/hooks/useForm';
import { validateInquiryForm } from '@/utils/validation';
import { sendPropertyInquiry } from '@/lib/mailer';
import { toast } from 'react-toastify';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import clsx from 'clsx';
import { INQUIRY_TYPES } from '@/utils/constants';

/**
 * InquiryForm Component
 * Property inquiry form (usually in a modal)
 */

const InquiryForm = ({ property, isOpen, onClose }) => {
  const handleSubmit = async (values) => {
    try {
      const result = await sendPropertyInquiry({
        ...values,
        propertyId: property.id,
        propertyTitle: property.title,
      });
      
      if (result.success) {
        toast.success(result.message || 'Inquiry sent successfully!');
        onClose();
        resetForm();
      } else {
        toast.error(result.error || 'Failed to send inquiry');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error('Inquiry form error:', error);
    }
  };

  const {
    values,
    errors,
    isSubmitting,
    getFieldProps,
    hasError,
    handleSubmit: onSubmit,
    resetForm,
  } = useForm(
    {
      name: '',
      email: '',
      phone: '',
      inquiryType: 'buy',
      message: '',
    },
    (values) => {
      const validation = validateInquiryForm(values);
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Inquire About ${property?.title || 'This Property'}`}
      size="md"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Property Info */}
        {property && (
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <div className="flex items-center space-x-3">
              {property.images && property.images[0] && (
                <img
                  src={property.images[0].url || property.images[0]}
                  alt={property.title}
                  className="h-16 w-20 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <p className="font-medium text-neutral-900 text-sm">{property.title}</p>
                <p className="text-sm text-neutral-600">
                  ${property.price?.toLocaleString()} • {property.bedrooms} bed • {property.bathrooms} bath
                </p>
              </div>
            </div>
          </div>
        )}

        <FormInput
          label="Full Name"
          name="name"
          required
          placeholder="John Doe"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Email Address"
            name="email"
            type="email"
            required
            placeholder="john@example.com"
          />
          
          <FormInput
            label="Phone Number"
            name="phone"
            type="tel"
            required
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <label htmlFor="inquiryType" className="block text-sm font-medium text-neutral-700 mb-1">
            I'm interested in <span className="text-red-500">*</span>
          </label>
          <select
            {...getFieldProps('inquiryType')}
            id="inquiryType"
            className={clsx(
              'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all',
              hasError('inquiryType')
                ? 'border-red-500 bg-red-50'
                : 'border-neutral-300 bg-white'
            )}
          >
            {INQUIRY_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {hasError('inquiryType') && (
            <p className="mt-1 text-sm text-red-600">{errors.inquiryType}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">
            Message (Optional)
          </label>
          <textarea
            {...getFieldProps('message')}
            id="message"
            rows={4}
            className={clsx(
              'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none',
              hasError('message')
                ? 'border-red-500 bg-red-50'
                : 'border-neutral-300 bg-white'
            )}
            placeholder="Any additional information..."
          />
          {hasError('message') && (
            <p className="mt-1 text-sm text-red-600">{errors.message}</p>
          )}
        </div>

        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            fullWidth
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            disabled={isSubmitting}
            fullWidth
          >
            {isSubmitting ? 'Sending...' : 'Send Inquiry'}
          </Button>
        </div>

        <p className="text-xs text-neutral-500 text-center pt-2">
          By submitting, you agree to be contacted about this property.
        </p>
      </form>
    </Modal>
  );
};

export default InquiryForm;
