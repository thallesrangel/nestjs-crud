import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as moment from 'moment';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GeneratePdfService {
  async createPasswordPDF(data: any): Promise<string> {
    const fileName = `password_${Date.now()}.pdf`;
    const filePath = path.join(__dirname, '..', '..', 'public', 'passwords', fileName); // Ajuste o caminho conforme necessário

    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: [80, 40],
          margins: { top: 5, left: 5, bottom: 5, right: 5 },
        });

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Adiciona o conteúdo do PDF aqui
        doc.fontSize(4);
        doc.fontSize(2).text(`${data.clinic.name}`, { align: 'center', lineGap: 4 });
        doc.text(`${data.place.name}`, { align: 'center', lineGap: 2 });

        if (data.type === "preferencial") {
          doc.fontSize(5).text(`SENHA:  P-${data.number}`, { align: 'center', lineGap: 3 });
        } else {
          doc.fontSize(5).text(`SENHA:  N-${data.number}`, { align: 'center', lineGap: 3 });
        }

        doc.fontSize(2).text(`Emissão: ${moment(data.created_at).format('DD/MM/YYYY HH:mm:ss')}`, { align: 'center' });

        doc.end();

        stream.on('finish', () => {
          resolve(fileName); // Retorna apenas o nome do arquivo para construir a URL pública
        });

        stream.on('error', (err) => {
          reject(err);
        });

      } catch (error) {
        reject(error);
      }
    });
  }
}
