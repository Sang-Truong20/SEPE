import React from 'react';
import { Input as AntInput } from 'antd';
import PropTypes from 'prop-types';

/**
 * Custom Input component with consistent styling based on the project theme
 */
const Input = ({ className, ...props }) => {
  const defaultClassName =
    '!bg-dark-tertiary border-dark-accent !text-text-primary hover:!border-primary focus:!border-primary focus:!bg-dark-tertiary/90 [&:not(:placeholder-shown)]:!bg-dark-tertiary/90 placeholder:!text-text-muted/70';

  return (
    <AntInput className={`${defaultClassName} ${className || ''}`} {...props} />
  );
};

/**
 * TextArea component with the same custom styling
 */
const TextArea = ({ className, ...props }) => {
  const defaultClassName =
    '!bg-dark-tertiary border-dark-accent !text-text-primary hover:!border-primary focus:!border-primary focus:!bg-dark-tertiary/90 [&:not(:placeholder-shown)]:!bg-dark-tertiary/90 placeholder:!text-text-muted/70';

  return (
    <AntInput.TextArea
      className={`${defaultClassName} ${className || ''}`}
      {...props}
    />
  );
};

/**
 * Password component with the same custom styling
 */
const Password = ({ className, ...props }) => {
  const defaultClassName =
    '!bg-dark-tertiary border-dark-accent !text-text-primary hover:!border-primary focus:!border-primary focus:!bg-dark-tertiary/90 [&:not(:placeholder-shown)]:!bg-dark-tertiary/90 [&_.ant-input-password-icon]:!text-text-muted';

  return (
    <AntInput.Password
      className={`${defaultClassName} ${className || ''}`}
      {...props}
    />
  );
};

/**
 * Search component with the same custom styling
 */
const Search = ({ className, ...props }) => {
  const defaultClassName =
    '!bg-dark-tertiary border-dark-accent !text-text-primary hover:!border-primary focus:!border-primary focus:!bg-dark-tertiary/90 [&:not(:placeholder-shown)]:!bg-dark-tertiary/90 [&_.ant-input-search-button]:!bg-primary [&_.ant-input-search-button]:!border-primary';

  return (
    <AntInput.Search
      className={`${defaultClassName} ${className || ''}`}
      {...props}
    />
  );
};

Input.TextArea = TextArea;
Input.Password = Password;
Input.Search = Search;

Input.propTypes = {
  className: PropTypes.string,
};

export default Input;
