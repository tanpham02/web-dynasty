export const formatCurrencyVND = (amount: number, format = 'vi-VN'): string => {
  const formatter = new Intl.NumberFormat(format)

  return formatter.format(amount)
}

export const formatNumber = (amount: number): string => {
  const formatter = new Intl.NumberFormat('vi-VN', {
    currency: 'VND',
  })

  return formatter.format(amount)
}

export const formatCurrencyWithUnits = (
  value: number,
  format: 'vi-VN' | 'en-US' = 'vi-VN',
  isCurrency: boolean = false,
) => {
  // Handle large numbers with units and currency
  if (value >= 1_000_000_000) {
    return isCurrency
      ? `${(value / 1_000_000_000).toFixed(1)}B₫`
      : `${(value / 1_000_000_000).toFixed(1)}B`
  } else if (value >= 1_000_000) {
    return isCurrency
      ? `${(value / 1_000_000).toFixed(1)}M₫`
      : `${(value / 1_000_000).toFixed(1)}M`
  } else if (value >= 1_000) {
    return isCurrency
      ? `${(value / 1_000).toFixed(1)}K₫`
      : `${(value / 1_000).toFixed(1)}K`
  }

  // For smaller numbers, use Intl.NumberFormat for proper currency formatting
  if (isCurrency) {
    const formatter = new Intl.NumberFormat(format, {
      style: 'currency',
      currency: 'VND',
    })
    return formatter.format(value)
  }

  // Default for simple numbers
  return value.toString()
}
