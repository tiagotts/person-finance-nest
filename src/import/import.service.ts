import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImportFile, ImportType } from './entities/import-file.entity';
import { Card } from '@src/card/entities/card.entity';
import * as fs from 'fs';
import { Ofx } from 'ofx-data-extractor';

@Injectable()
export class ImportService {
  constructor(
    @InjectRepository(ImportFile)
    private importFileRepository: Repository<ImportFile>,
  ) {}

  async processOFXFile(filePath: string, card: Card): Promise<ImportFile> {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const ofx = new Ofx(fileContent);

      
      const headers = ofx.getHeaders()
      console.log(headers)
      
      const transactionsSummary = ofx.getCreditCardTransferList()
      console.log(transactionsSummary)
      
      const bankTransferList = ofx.getBankTransferList()
      console.log(bankTransferList)
      

      const ofxResponse = ofx.toJson();
      const importFile = new ImportFile();
      importFile.filename = filePath.split('/').pop() || filePath.split('\\').pop() || 'unknown';
      importFile.type = ImportType.OFX;
      importFile.cardId = card.id;
      importFile.metadata = transactionsSummary;
      importFile.processed = false;

      const savedFile = await this.importFileRepository.save(importFile);

      // Clean up the temporary file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return savedFile;
    } catch (error) {
      // Clean up the temporary file in case of error
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      throw error;
    }
  }
}