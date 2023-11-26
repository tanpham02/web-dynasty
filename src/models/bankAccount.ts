export interface BankAccount {
  id?: number;
  bankAccountNumber?: number;
  bankAccountName?: string;
  bankId?: number;
  bankName?: string;
  status?: BankAccountStatus;
}

export enum BankAccountStatus {
  ACTIVE = 'ACTIVE',
  IN_ACTIVE = 'IN_ACTIVE',
  DELETED = 'DELETED',
  IN_COMING = 'IN_COMING',
}

export interface FindAllBankFromThirdPartyVietQr {
  code?: number;
  desc?: string;
  data: FindAllBankFromThirdPartyVietQrData[];
}

export interface FindAllBankFromThirdPartyVietQrData {
  id: number;
  name: string;
  code: string;
  bin: string | number;
  shortName: string;
  logo: string;
  transferSupported: number;
  lookupSupported: number;
  short_name: string;
  support: number;
  isTransfer: boolean | number;
  swift_code: string;
}
