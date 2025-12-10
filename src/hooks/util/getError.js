const useMessage = () => {
  const getMessage = (m) => {
    return (
      m?.response?.data?.detail ||
      m?.response?.data?.message ||
      m?.response?.data?.title ||
      "Lỗi rồi! Vui lòng thử lại."
    );
  };

  return { getMessage };
};

export default useMessage;
