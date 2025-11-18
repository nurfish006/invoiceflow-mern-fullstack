export const downloadPDF = (pdfBlob, filename = 'invoice.pdf') => {
  // Create a temporary URL for the blob
  const url = window.URL.createObjectURL(new Blob([pdfBlob]));
  const link = document.createElement('a');
  link.href = url;
  
  // Set download attributes
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  
  // Trigger download
  link.click();
  
  // Cleanup
  link.remove();
  window.URL.revokeObjectURL(url);
};

/**
 * Opens PDF in new browser tab for preview
 * @param {Blob} pdfBlob - PDF data from API
 */
export const previewPDF = (pdfBlob) => {
  const url = window.URL.createObjectURL(new Blob([pdfBlob]));
  window.open(url, '_blank');
  
  // Note: We don't revoke URL immediately for preview
  // Browser will handle cleanup when tab closes
};