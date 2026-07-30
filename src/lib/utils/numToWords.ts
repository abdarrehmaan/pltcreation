/**
 * Converts a numeric amount to Indian currency words format.
 * Example: 3450.50 => "Three Thousand Four Hundred Fifty Rupees and Fifty Paisa Only"
 */
export function numberToWordsIN(num: number): string {
  if (isNaN(num) || num < 0) return '';
  if (num === 0) return 'Zero Rupees Only';

  const singleDigits = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const twoDigits = ['', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tensMultiple = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convertChunk = (n: number): string => {
    let str = '';
    if (n > 99) {
      str += singleDigits[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n > 19) {
      str += tensMultiple[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n > 0 && n < 10) {
      str += singleDigits[n] + ' ';
    } else if (n >= 10 && n <= 19) {
      str += twoDigits[n - 9] + ' ';
    }
    return str.trim();
  };

  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);

  let rupeesWords = '';

  if (rupees === 0) {
    rupeesWords = 'Zero Rupees';
  } else {
    const crores = Math.floor(rupees / 10000000);
    let rem = rupees % 10000000;

    const lakhs = Math.floor(rem / 100000);
    rem %= 100000;

    const thousands = Math.floor(rem / 1000);
    rem %= 1000;

    const hundredChunk = rem;

    if (crores > 0) {
      rupeesWords += `${convertChunk(crores)} Crore `;
    }
    if (lakhs > 0) {
      rupeesWords += `${convertChunk(lakhs)} Lakh `;
    }
    if (thousands > 0) {
      rupeesWords += `${convertChunk(thousands)} Thousand `;
    }
    if (hundredChunk > 0) {
      rupeesWords += `${convertChunk(hundredChunk)} `;
    }

    rupeesWords = rupeesWords.trim() + ' Rupees';
  }

  let paiseWords = '';
  if (paise > 0) {
    paiseWords = ` and ${convertChunk(paise)} Paisa`;
  }

  return `${rupeesWords}${paiseWords} Only`;
}
