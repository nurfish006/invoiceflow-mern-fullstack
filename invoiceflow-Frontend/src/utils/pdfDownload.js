export const downloadPDF = (pdfBlob, filename = 'invoice.pdf') => {
  try {
    // Create a Blob with proper PDF MIME type
    const blob = new Blob([pdfBlob], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('PDF download error:', error);
    alert('Error downloading PDF. Please try again.');
  }
};

/**
 * Opens PDF in new browser tab for preview
 * @param {Blob} pdfBlob - PDF data from API
 */
export const previewPDF = (pdfBlob) => {
  try {
    // Create Blob with proper MIME type
    const blob = new Blob([pdfBlob], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    
    // Open in new tab - browser will handle PDF rendering
    window.open(url, '_blank');
    
    // Note: Don't revoke URL immediately for preview
    // Let the browser handle it when tab closes
    
  } catch (error) {
    console.error('PDF preview error:', error);
    alert('Error previewing PDF. Please try again.');
  }
};