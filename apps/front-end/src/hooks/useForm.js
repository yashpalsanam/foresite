import { useState, useCallback, useEffect } from 'react';
import { sanitizeString, sanitizeEmail, sanitizePhone } from '@/utils/validation';

/**
 * Custom hook for form state management
 * Handles form values, validation, errors, and submission
 * 
 * @param {object} initialValues - Initial form values
 * @param {Function} validate - Validation function
 * @param {Function} onSubmit - Submit handler
 * @returns {object} Form state and handlers
 */
export const useForm = (initialValues = {}, validate, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const [isValid, setIsValid] = useState(false);

  /**
   * Validate form values
   */
  const validateForm = useCallback((formValues) => {
    if (!validate) return {};
    
    const validationErrors = validate(formValues);
    setIsValid(Object.keys(validationErrors).length === 0);
    return validationErrors;
  }, [validate]);

  /**
   * Validate field
   */
  const validateField = useCallback((name, value) => {
    if (!validate) return '';
    
    const fieldErrors = validate({ ...values, [name]: value });
    return fieldErrors[name] || '';
  }, [validate, values]);

  /**
   * Handle input change
   */
  const handleChange = useCallback((event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setValues(prev => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  }, [errors]);

  /**
   * Set field value programmatically
   */
  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  }, [errors]);

  /**
   * Set multiple field values
   */
  const setFieldValues = useCallback((newValues) => {
    setValues(prev => ({
      ...prev,
      ...newValues,
    }));
  }, []);

  /**
   * Handle field blur (mark as touched)
   */
  const handleBlur = useCallback((event) => {
    const { name } = event.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));

    // Validate field on blur
    const fieldError = validateField(name, values[name]);
    if (fieldError) {
      setErrors(prev => ({
        ...prev,
        [name]: fieldError,
      }));
    }
  }, [values, validateField]);

  /**
   * Set field error manually
   */
  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  /**
   * Set multiple errors
   */
  const setFieldErrors = useCallback((newErrors) => {
    setErrors(prev => ({
      ...prev,
      ...newErrors,
    }));
  }, []);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async (event) => {
    if (event) {
      event.preventDefault();
    }

    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validate all fields
    const validationErrors = validateForm(values);
    setErrors(validationErrors);

    // If there are errors, don't submit
    if (Object.keys(validationErrors).length > 0) {
      setIsValid(false);
      return;
    }

    setIsSubmitting(true);
    setSubmitCount(prev => prev + 1);

    try {
      await onSubmit(values);
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      
      // Handle server-side validation errors
      if (error.errors) {
        setErrors(error.errors);
      }
      
      throw error;
    }
  }, [values, validateForm, onSubmit]);

  /**
   * Reset form to initial values
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setSubmitCount(0);
    setIsValid(false);
  }, [initialValues]);

  /**
   * Reset field to initial value
   */
  const resetField = useCallback((name) => {
    setValues(prev => ({
      ...prev,
      [name]: initialValues[name],
    }));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
    setTouched(prev => {
      const newTouched = { ...prev };
      delete newTouched[name];
      return newTouched;
    });
  }, [initialValues]);

  /**
   * Get field props for input binding
   */
  const getFieldProps = useCallback((name) => {
    return {
      name,
      value: values[name] ?? '',
      onChange: handleChange,
      onBlur: handleBlur,
    };
  }, [values, handleChange, handleBlur]);

  /**
   * Get field meta (error, touched)
   */
  const getFieldMeta = useCallback((name) => {
    return {
      error: errors[name],
      touched: touched[name],
      valid: touched[name] && !errors[name],
    };
  }, [errors, touched]);

  /**
   * Check if field has error
   */
  const hasError = useCallback((name) => {
    return touched[name] && !!errors[name];
  }, [touched, errors]);

  /**
   * Validate on value change (optional)
   */
  useEffect(() => {
    if (submitCount > 0) {
      const validationErrors = validateForm(values);
      setErrors(validationErrors);
    }
  }, [values, validateForm, submitCount]);

  return {
    // Form state
    values,
    errors,
    touched,
    isSubmitting,
    submitCount,
    isValid,

    // Handlers
    handleChange,
    handleBlur,
    handleSubmit,
    
    // Setters
    setFieldValue,
    setFieldValues,
    setFieldError,
    setFieldErrors,
    
    // Resetters
    resetForm,
    resetField,
    
    // Helpers
    getFieldProps,
    getFieldMeta,
    hasError,
  };
};

/**
 * Hook for controlled input with sanitization
 * @param {string} initialValue - Initial value
 * @param {string} type - Input type (text, email, phone)
 * @returns {object} Input state and props
 */
export const useInput = (initialValue = '', type = 'text') => {
  const [value, setValue] = useState(initialValue);
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = useCallback((event) => {
    let newValue = event.target.value;
    
    // Sanitize based on type
    switch (type) {
      case 'email':
        newValue = sanitizeEmail(newValue);
        break;
      case 'phone':
        newValue = sanitizePhone(newValue);
        break;
      case 'text':
      default:
        newValue = sanitizeString(newValue);
        break;
    }
    
    setValue(newValue);
    setIsDirty(true);
  }, [type]);

  const reset = useCallback(() => {
    setValue(initialValue);
    setIsDirty(false);
  }, [initialValue]);

  return {
    value,
    setValue,
    isDirty,
    reset,
    bind: {
      value,
      onChange: handleChange,
    },
  };
};

/**
 * Hook for checkbox/toggle input
 * @param {boolean} initialValue - Initial checked state
 * @returns {object} Checkbox state and props
 */
export const useCheckbox = (initialValue = false) => {
  const [checked, setChecked] = useState(initialValue);

  const handleChange = useCallback((event) => {
    setChecked(event.target.checked);
  }, []);

  const toggle = useCallback(() => {
    setChecked(prev => !prev);
  }, []);

  const reset = useCallback(() => {
    setChecked(initialValue);
  }, [initialValue]);

  return {
    checked,
    setChecked,
    toggle,
    reset,
    bind: {
      checked,
      onChange: handleChange,
    },
  };
};

/**
 * Hook for multi-select input
 * @param {Array} initialValues - Initial selected values
 * @returns {object} Multi-select state and handlers
 */
export const useMultiSelect = (initialValues = []) => {
  const [selected, setSelected] = useState(initialValues);

  const isSelected = useCallback((value) => {
    return selected.includes(value);
  }, [selected]);

  const toggle = useCallback((value) => {
    setSelected(prev => 
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  }, []);

  const select = useCallback((value) => {
    if (!selected.includes(value)) {
      setSelected(prev => [...prev, value]);
    }
  }, [selected]);

  const deselect = useCallback((value) => {
    setSelected(prev => prev.filter(item => item !== value));
  }, []);

  const selectAll = useCallback((values) => {
    setSelected(values);
  }, []);

  const clear = useCallback(() => {
    setSelected([]);
  }, []);

  const reset = useCallback(() => {
    setSelected(initialValues);
  }, [initialValues]);

  return {
    selected,
    setSelected,
    isSelected,
    toggle,
    select,
    deselect,
    selectAll,
    clear,
    reset,
  };
};

/**
 * Hook for file upload input
 * @param {object} options - Upload options
 * @returns {object} File upload state and handlers
 */
export const useFileUpload = (options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    multiple = false,
  } = options;

  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const [previews, setPreviews] = useState([]);

  const validateFile = useCallback((file) => {
    if (!allowedTypes.includes(file.type)) {
      return `File type ${file.type} is not allowed`;
    }
    if (file.size > maxSize) {
      return `File size exceeds ${(maxSize / (1024 * 1024)).toFixed(2)}MB`;
    }
    return null;
  }, [allowedTypes, maxSize]);

  const handleChange = useCallback((event) => {
    const selectedFiles = Array.from(event.target.files);
    const validFiles = [];
    const fileErrors = [];
    const filePreviews = [];

    selectedFiles.forEach(file => {
      const error = validateFile(file);
      if (error) {
        fileErrors.push({ file: file.name, error });
      } else {
        validFiles.push(file);
        
        // Create preview for images
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            filePreviews.push({
              file: file.name,
              url: e.target.result,
            });
            setPreviews(prev => [...prev, ...filePreviews]);
          };
          reader.readAsDataURL(file);
        }
      }
    });

    setFiles(multiple ? [...files, ...validFiles] : validFiles);
    setErrors(fileErrors);
  }, [files, multiple, validateFile]);

  const removeFile = useCallback((index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clear = useCallback(() => {
    setFiles([]);
    setErrors([]);
    setPreviews([]);
  }, []);

  return {
    files,
    errors,
    previews,
    handleChange,
    removeFile,
    clear,
  };
};

export default useForm;
