// Sana formatini dd/mm/yyyy ko'rinishida qaytarish
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

// Sana inputi uchun yyyy-mm-dd formatiga o'tkazish
export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

// dd/mm/yyyy formatidan Date obyektiga o'tkazish
export const parseDateFromDDMMYYYY = (dateString) => {
  if (!dateString) return null;
  
  const parts = dateString.split('/');
  if (parts.length !== 3) return null;
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // JavaScript'da oylar 0 dan boshlanadi
  const year = parseInt(parts[2], 10);
  
  return new Date(year, month, day);
};

// Bugungi sanani dd/mm/yyyy formatida qaytarish
export const getTodayFormatted = () => {
  return formatDate(new Date());
};

// Sana validatsiyasi
export const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};