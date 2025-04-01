import { Test, TestingModule } from '@nestjs/testing';
import { ImportController } from './import.controller';
import { ImportService } from './import.service';
import { ImportFile, ImportType } from './entities/import-file.entity';
import * as fs from 'fs';
import { Card } from '@src/card/entities/card.entity';

describe('ImportController', () => {
  let controller: ImportController;
  let service: ImportService;

  const mockImportService = {
    processOFXFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImportController],
      providers: [
        {
          provide: ImportService,
          useValue: mockImportService,
        },
      ],
    }).compile();

    controller = module.get<ImportController>(ImportController);
    service = module.get<ImportService>(ImportService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadOFX', () => {
    const cardId = '123';
    const mockFile: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'test.ofx',
      encoding: '7bit',
      mimetype: 'application/octet-stream',
      buffer: Buffer.from('test content'),
      size: 123,
      destination: './uploads',
      filename: 'test.ofx',
      path: 'C:/Users/tiago/Downloads/test.ofx',
      stream: fs.createReadStream(""),
    };

    const mockImportFile: ImportFile = {
      id: '1',
      filename: 'test.ofx',
      type: ImportType.OFX,
      cardId: cardId,
      card: new Card(),
      metadata: {},
      processed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should successfully upload and process OFX file', async () => {
      mockImportService.processOFXFile.mockResolvedValue(mockImportFile);

      const result = await controller.uploadOFX(mockFile, cardId);

      expect(result).toEqual(mockImportFile);
      expect(mockImportService.processOFXFile).toHaveBeenCalledWith(
        mockFile.path,
        expect.objectContaining({ id: cardId }),
      );
    });

    it('should throw error when no file is provided', async () => {
    //   await expect(controller.uploadOFX(undefined, cardId)).rejects.toThrow(
    //     'No file uploaded',
    //   );

      await expect(controller.uploadOFX({} as Express.Multer.File, cardId)).rejects.toThrow(
        'No file uploaded',
      );

      const malformedFile = {
        fieldname: 'file',
        originalname: 'test.ofx',
      } as Express.Multer.File;

      await expect(controller.uploadOFX(malformedFile, cardId)).rejects.toThrow(
        'No file uploaded',
      );
    });

    it('should handle service errors', async () => {
      const errorMessage = 'Error processing file';
      mockImportService.processOFXFile.mockRejectedValue(new Error(errorMessage));

      await expect(controller.uploadOFX(mockFile, cardId)).rejects.toThrow(
        errorMessage,
      );
    });
  });
});