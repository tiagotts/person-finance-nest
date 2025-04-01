import { Controller, Post, UploadedFile, UseInterceptors, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportService } from './import.service';
import { ImportFile } from './entities/import-file.entity';
import { Card } from '@src/card/entities/card.entity';

@Controller('import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post('ofx/:cardId')
  @UseInterceptors(FileInterceptor('file', {
    dest: './uploads',
    preservePath: true
  }))
  async uploadOFX(
    @UploadedFile() file: Express.Multer.File,
    @Param('cardId') cardId: string,
  ): Promise<ImportFile> {
    debugger;
    if (!file) {
      throw new Error('No file uploaded');
    }
    const card = { id: cardId } as Card;
    return this.importService.processOFXFile(file.path, card);
  }
}