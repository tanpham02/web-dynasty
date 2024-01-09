export const formatCurrencyVND = (amount: number): string => {
  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

  return formatter.format(amount);
};

export const formatNumber = (amount: number): string => {
  const formatter = new Intl.NumberFormat('vi-VN', {
    currency: 'VND',
  });

  return formatter.format(amount);
};
