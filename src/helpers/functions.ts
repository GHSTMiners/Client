export const smartTrim = (string: string, maxLength: number) => {
  if (maxLength < 1) return string;
  if (string.length <= maxLength) return string;
  if (maxLength === 1) return `${string.substring(0, 1)}...`;

  const midpoint = Math.ceil(string.length / 2);
  const toremove = string.length - maxLength;
  const lstrip = Math.ceil(toremove / 2);
  const rstrip = toremove - lstrip;
  return `${string.substring(0, midpoint - lstrip)}...${string.substring(midpoint + rstrip)}`;
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount) 
}

export const formatNumber = (amount: number) => {
  return new Intl.NumberFormat('en-US', {  maximumFractionDigits: 0 }).format(amount) 
}
