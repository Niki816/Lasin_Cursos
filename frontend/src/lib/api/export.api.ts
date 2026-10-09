import apiClient from './axios';

/**
 * Descarga un archivo binario y lo guarda en el navegador
 */
async function descargarArchivo(
  url: string,
  nombreArchivo: string
): Promise<void> {
  const response = await apiClient.get(url, { responseType: 'blob' });

  const blob = new Blob([response.data], {
    type: response.headers['content-type'] as string,
  });
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = nombreArchivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
}

export const exportApi = {
  async descargarPDF(cursoId: number, nombreCurso: string): Promise<void> {
    const nombreLimpio = nombreCurso.replace(/\s+/g, '_');
    await descargarArchivo(
      `/export/${cursoId}/pdf`,
      `lista_${nombreLimpio}.pdf`
    );
  },

  async descargarExcel(cursoId: number, nombreCurso: string): Promise<void> {
    const nombreLimpio = nombreCurso.replace(/\s+/g, '_');
    await descargarArchivo(
      `/export/${cursoId}/excel`,
      `planilla_${nombreLimpio}.xlsx`
    );
  },
};