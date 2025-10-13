import React from 'react';
import { DatePicker as AntDatePicker } from 'antd';
import PropTypes from 'prop-types';

/**
 * Custom DatePicker component with consistent styling based on the project theme
 */
const DatePicker = ({ className, dropdownClassName, popupStyle, ...props }) => {
  // Chỉ style input và đảm bảo text nhập vào và placeholder hiển thị rõ
  const defaultClassName =
    '!bg-dark-tertiary border-dark-accent hover:!border-primary focus:!border-primary [&_.ant-picker-input>input]:!text-text-primary [&_.ant-picker-input>input::placeholder]:!text-text-muted/70 [&_.ant-picker-suffix]:!text-text-primary';

  // Không tùy chỉnh nhiều về dropdown calendar, giữ màu mặc định
  const defaultDropdownClassName = '';

  // Không tùy chỉnh style của popup
  const defaultPopupStyle = {
    ...popupStyle,
  };

  return (
    <AntDatePicker
      className={`${defaultClassName} ${className || ''}`}
      dropdownClassName={`${defaultDropdownClassName} ${dropdownClassName || ''}`}
      popupStyle={defaultPopupStyle}
      {...props}
    />
  );
};

/**
 * RangePicker variant with the same styling
 */
const RangePicker = ({
  className,
  dropdownClassName,
  popupStyle,
  ...props
}) => {
  // Chỉ style input và đảm bảo text nhập vào và placeholder hiển thị rõ
  const defaultClassName =
    '!bg-dark-tertiary border-dark-accent hover:!border-primary focus:!border-primary [&_.ant-picker-input>input]:!text-text-primary [&_.ant-picker-input>input::placeholder]:!text-text-muted/70 [&_.ant-picker-suffix]:!text-text-primary';

  // Không tùy chỉnh nhiều về dropdown calendar, giữ màu mặc định
  const defaultDropdownClassName = '';

  // Không tùy chỉnh style của popup
  const defaultPopupStyle = {
    ...popupStyle,
  };

  return (
    <AntDatePicker.RangePicker
      className={`${defaultClassName} ${className || ''}`}
      dropdownClassName={`${defaultDropdownClassName} ${dropdownClassName || ''}`}
      popupStyle={defaultPopupStyle}
      {...props}
    />
  );
};

/**
 * Helper components
 */
DatePicker.RangePicker = RangePicker;

const WeekPicker = (props) => <DatePicker picker="week" {...props} />;
WeekPicker.displayName = 'WeekPicker';
DatePicker.WeekPicker = WeekPicker;

const MonthPicker = (props) => <DatePicker picker="month" {...props} />;
MonthPicker.displayName = 'MonthPicker';
DatePicker.MonthPicker = MonthPicker;

const YearPicker = (props) => <DatePicker picker="year" {...props} />;
YearPicker.displayName = 'YearPicker';
DatePicker.YearPicker = YearPicker;

const TimePicker = (props) => <DatePicker picker="time" {...props} />;
TimePicker.displayName = 'TimePicker';
DatePicker.TimePicker = TimePicker;

const QuarterPicker = (props) => <DatePicker picker="quarter" {...props} />;
QuarterPicker.displayName = 'QuarterPicker';
DatePicker.QuarterPicker = QuarterPicker;

DatePicker.propTypes = {
  className: PropTypes.string,
  dropdownClassName: PropTypes.string,
  popupStyle: PropTypes.object,
};

export default DatePicker;
