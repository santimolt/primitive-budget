// Formatear número con separadores de miles y decimales
// Formato: punto (.) para miles, coma (,) para decimales
export function formatCurrency(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0,00';
  }

  // Manejar números negativos
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  // Redondear a 2 decimales
  const rounded = Math.round(absAmount * 100) / 100;
  
  // Separar parte entera y decimal
  const parts = rounded.toString().split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1] || '00';
  
  // Agregar puntos como separadores de miles
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  // Asegurar 2 decimales
  const formattedDecimal = decimalPart.padEnd(2, '0').substring(0, 2);
  
  const formatted = `${formattedInteger},${formattedDecimal}`;
  return isNegative ? `-${formatted}` : formatted;
}

// Formatear número sin símbolo de moneda (solo el número formateado)
export function formatNumber(number) {
  return formatCurrency(number);
}

