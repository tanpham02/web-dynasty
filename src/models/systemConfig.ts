export interface SystemConfigs {
  id?: number;
  shipPrice?: number;
  minimumFreeShipOrderTotalPriceLabel?: string;
  minimumFreeShipOrderTotalPriceValue?: number;
  moneyToPoint?: number;
  usePointToMoney?: number;
  referralCommission?: number;
  newbieCommission?: number;
  cancellationReasons?: [string];
  moneyToPointPercent?: number;
  onePointToMoney?: number;
  hotline?: string;
  transferContent?: string;
  referralConversionRate?: number | null;
}

export interface FrequentlyAskedQuestion {
  id?: number;
  title?: string;
  description?: string;
  createdDate?: string;
  modifiedDate?: string;
}
