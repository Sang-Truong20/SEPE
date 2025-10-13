import React from 'react';
import { Form as AntForm } from 'antd';
import PropTypes from 'prop-types';

/**
 * Custom Form component with consistent styling based on the project theme
 */
const Form = ({ className, ...props }) => {
  return <AntForm className={`${className || ''}`} {...props} />;
};

/**
 * Form Item component with custom styling
 */
const FormItem = ({ className, labelClassName, ...props }) => {
  return (
    <AntForm.Item
      className={`${className || ''}`}
      labelCol={{ className: `!text-text-secondary ${labelClassName || ''}` }}
      {...props}
    />
  );
};

Form.Item = FormItem;
Form.List = AntForm.List;
Form.ErrorList = AntForm.ErrorList;
Form.useForm = AntForm.useForm;

Form.propTypes = {
  className: PropTypes.string,
};

FormItem.propTypes = {
  className: PropTypes.string,
  labelClassName: PropTypes.string,
};

export default Form;
