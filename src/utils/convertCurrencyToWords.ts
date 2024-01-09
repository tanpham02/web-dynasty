const currencyLocale = {
  0: '',
  1: 'một',
  2: 'hai',
  3: 'ba',
  4: 'bốn',
  5: 'năm',
  6: 'sáu',
  7: 'bảy',
  8: 'tám',
  9: 'chín',
  10: 'mười',
  20: 'hai mươi',
  30: 'ba mươi',
  40: 'bốn mươi',
  50: 'măm mươi',
  60: 'sáu mươi',
  70: 'bảy mươi',
  80: 'tám mươi',
  90: 'chín mươi',
};
// 'trăm tỉ, chục tỉ, tỉ, trăm triệu, chục triệu, triệu, trăm nghìn, chục nghìn, nghìn, trăm, chục, đơn vị'
const units = [
  { name: 'chục', number: 10 },
  { name: 'trăm', number: 100 },
  { name: 'nghìn', number: 1000 },
];

const convertCurrencyToWords = (currency: number) => {
  if (currency) {
    console.log(currency);
  }
};

const firstLetterUpperCase = (words: string) => {
  const result = words.charAt(0).toUpperCase() + words.slice(1);
  return result;
};

export { currencyLocale, units, firstLetterUpperCase };

export default convertCurrencyToWords;
