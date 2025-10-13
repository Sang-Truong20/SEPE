import React from 'react';
import { InputNumber as AntInputNumber } from 'antd';
import PropTypes from 'prop-types';

/**
 * Custom InputNumber component with consistent styling based on the project theme
 */
const InputNumber = ({ className, ...props }) => {
  const defaultClassName =
    '!bg-dark-tertiary border-dark-accent hover:!border-primary focus:!border-primary focus:!bg-dark-tertiary/90 [&:not(:placeholder-shown)]:!bg-dark-tertiary/90 [&_.ant-input-number-input]:!text-text-primary [&_.ant-input-number-input::placeholder]:!text-text-muted/70 [&_.ant-input-number-handler-wrap]:!bg-dark-accent/80 [&_.ant-input-number-handler]:!border-dark-accent [&_.ant-input-number-handler-up-inner]:!text-text-secondary [&_.ant-input-number-handler-down-inner]:!text-text-secondary [&_.ant-input-number-handler:hover_.ant-input-number-handler-up-inner]:!text-primary [&_.ant-input-number-handler:hover_.ant-input-number-handler-down-inner]:!text-primary';

  return (
    <AntInputNumber
      className={`${defaultClassName} ${className || ''}`}
      {...props}
    />
  );
};

InputNumber.propTypes = {
  className: PropTypes.string,
};

export default InputNumber;
