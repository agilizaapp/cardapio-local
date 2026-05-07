/**
 * Extrai o preço adicional de uma string de opção.
 * Formato esperado: "Nome (+R$ 10,00)" ou "Nome (+R$10.00)"
 */
export const extractAdditionalPrice = (option: string | any): number => {
  if (typeof option !== "string") return 0;
  
  // Regex para capturar o valor dentro de (+R$ ...)
  const match = option.match(/\(\+R\$\s?([\d,.]+)\)/i);
  if (match && match[1]) {
    // Remove pontos de milhar e troca vírgula por ponto para parse
    const value = match[1].replace(".", "").replace(",", ".");
    return parseFloat(value) || 0;
  }
  
  return 0;
};

/**
 * Calcula o preço unitário de um item incluindo suas variações selecionadas.
 */
export const calculateItemUnitPrice = (basePrice: number, selectedSpecs: Record<string, string | string[]>): number => {
  let total = basePrice;
  
  Object.values(selectedSpecs).forEach((val) => {
    if (Array.isArray(val)) {
      val.forEach((opt) => {
        total += extractAdditionalPrice(opt);
      });
    } else if (val) {
      total += extractAdditionalPrice(val);
    }
  });
  
  return total;
};
