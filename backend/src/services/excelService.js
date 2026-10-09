import ExcelJS from 'exceljs';

const formatearFecha = (fecha) => {
  if (!fecha) return 'Por definir';
  return new Date(fecha).toLocaleDateString('es-BO');
};

export const generarExcelLista = async (curso) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Sistema Cursos LASIN';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Lista de Inscritos', {
    pageSetup: { paperSize: 9, orientation: 'landscape' },
  });

  // Anchos de columna
  sheet.columns = [
    { key: 'num', width: 6 },
    { key: 'paterno', width: 18 },
    { key: 'materno', width: 18 },
    { key: 'nombres', width: 25 },
    { key: 'ci', width: 15 },
    { key: 'telefono', width: 15 },
    { key: 'correo', width: 30 },
    { key: 'nota', width: 10 },
    { key: 'firma', width: 20 },
  ];

  // Encabezados institucionales
  const headerStyle = {
    font: { bold: true, size: 12, color: { argb: 'FF000000' } },
    alignment: { horizontal: 'center', vertical: 'middle' },
  };

  sheet.mergeCells('A1:I1');
  sheet.getCell('A1').value = 'UNIVERSIDAD MAYOR DE SAN ANDRÉS';
  sheet.getCell('A1').style = { ...headerStyle, font: { bold: true, size: 14 } };

  sheet.mergeCells('A2:I2');
  sheet.getCell('A2').value = 'FACULTAD DE CIENCIAS PURAS Y NATURALES';
  sheet.getCell('A2').style = headerStyle;

  sheet.mergeCells('A3:I3');
  sheet.getCell('A3').value = 'CARRERA DE INFORMÁTICA - LABORATORIO SUPERIOR DE INFORMÁTICA';
  sheet.getCell('A3').style = headerStyle;

  sheet.mergeCells('A5:I5');
  sheet.getCell('A5').value = curso.nombre.toUpperCase();
  sheet.getCell('A5').style = { ...headerStyle, font: { bold: true, size: 13 } };

  // Info del curso
  sheet.getCell('A7').value = 'Instructor:';
  sheet.getCell('A7').font = { bold: true };
  sheet.mergeCells('B7:D7');
  sheet.getCell('B7').value = curso.instructor || 'Por definir';

  sheet.getCell('F7').value = 'Modalidad:';
  sheet.getCell('F7').font = { bold: true };
  sheet.mergeCells('G7:I7');
  sheet.getCell('G7').value = curso.modalidad || 'N/A';

  sheet.getCell('A8').value = 'Inicio:';
  sheet.getCell('A8').font = { bold: true };
  sheet.mergeCells('B8:D8');
  sheet.getCell('B8').value = formatearFecha(curso.fechaInicio);

  sheet.getCell('F8').value = 'Horario:';
  sheet.getCell('F8').font = { bold: true };
  sheet.mergeCells('G8:I8');
  sheet.getCell('G8').value =
    curso.horaInicio && curso.horaFin ? `${curso.horaInicio} – ${curso.horaFin}` : 'N/A';

  // Fila de encabezados de tabla (fila 10)
  const headerRow = sheet.getRow(10);
  headerRow.values = ['N°', 'PATERNO', 'MATERNO', 'NOMBRES', 'C.I.', 'TELÉFONO', 'CORREO', 'NOTA', 'FIRMA'];
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });

  // Datos de estudiantes
  curso.preinscripciones.forEach((e, i) => {
    const row = sheet.addRow([
      i + 1,
      (e.apellidoPaterno || '').toUpperCase(),
      (e.apellidoMaterno || '').toUpperCase(),
      (e.nombres || '').toUpperCase(),
      e.ci || '',
      e.telefono || '',
      (e.correo || '').toLowerCase(),
      '',
      '',
    ]);
    row.eachCell((cell) => {
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
    // CI y teléfono como texto para preservar ceros a la izquierda
    row.getCell(5).numFmt = '@';
    row.getCell(6).numFmt = '@';
  });

  // Total
  const totalRow = sheet.addRow([]);
  totalRow.getCell(1).value = `Total estudiantes: ${curso.preinscripciones.length}`;
  totalRow.getCell(1).font = { bold: true };

  return await workbook.xlsx.writeBuffer();
};