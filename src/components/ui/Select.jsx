import React from 'react';
import { Select as AntSelect } from 'antd';
import PropTypes from 'prop-types';

/**
 * Custom Select component with consistent styling based on the project theme
 */
const Select = ({ className, dropdownStyle, ...props }) => {
  React.useEffect(() => {
    const styleId = 'custom-select-hover-fix';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        /* Scoped hover styling */
        .custom-select-dropdown .ant-select-item-option:hover {
          background-color: rgba(42, 74, 71, 0.5) !important;
        }
        .custom-select-dropdown .ant-select-item-option-active:not(.ant-select-item-option-selected) {
          background-color: rgba(42, 74, 71, 0.3) !important;
        }
        .custom-select-dropdown .ant-select-item-option-selected {
          background-color: rgba(42, 74, 71, 0.6) !important;
        }
        /* Border fix */
        .ant-select-selector {
          border-color: #2A4A47 !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const defaultClassName =
    '!bg-dark-tertiary !border-dark-accent hover:!border-primary focus:!border-primary focus:!bg-dark-tertiary/90 [&:not(:placeholder-shown)]:!bg-dark-tertiary/90 [&_.ant-select-selector]:!bg-dark-tertiary [&_.ant-select-selection-item]:!text-text-primary [&_.ant-select-arrow]:!text-text-secondary [&_.ant-select-selection-placeholder]:!text-text-muted/70 transition-colors duration-200';

  const defaultDropdownStyle = {
    backgroundColor: 'rgb(10, 31, 28)',
    backdropFilter: 'blur(10px)',
    border: '1px solid #2A4A47',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.5)',
    borderRadius: '4px',
    ...dropdownStyle,
  };

  const selectProps = {
    ...props,
    getPopupContainer: (triggerNode) => triggerNode.parentNode || document.body,
    dropdownStyle: defaultDropdownStyle,
    popupClassName:
      'custom-select-dropdown bg-dark-tertiary !border-dark-accent [&_.ant-select-item]:!text-text-primary [&_.ant-select-item-option-selected]:!bg-primary/20',
  };

  const inlineStyle = {
    borderColor: '#2A4A47',
  };

  return (
    <AntSelect
      className={`${defaultClassName} ${className || ''}`}
      style={inlineStyle}
      {...selectProps}
    />
  );
};

Select.Option = AntSelect.Option;
Select.OptGroup = AntSelect.OptGroup;

Select.propTypes = {
  className: PropTypes.string,
  dropdownStyle: PropTypes.object,
};

export default Select;
