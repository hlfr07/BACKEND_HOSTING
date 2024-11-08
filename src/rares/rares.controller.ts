import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { RaresService } from './rares.service';
import { CreateRareDto } from './dto/create-rare.dto';
import { UpdateRareDto } from './dto/update-rare.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { Response } from 'express';
import { cwd } from 'process';

@Controller('rares')
export class RaresController {
  constructor(private readonly raresService: RaresService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        // Extrae el nombre desde el cuerpo de la solicitud
        const { nombre } = req.body;
        
        // Crea la ruta de la carpeta en función del nombre proporcionado
        const dirPath = path.join(cwd(), 'uploads', nombre);

        // Verifica si la carpeta existe; si no, la crea
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }

        // Devuelve la ruta donde se almacenará el archivo
        cb(null, dirPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const sanitizedOriginalName = file.originalname.replace(/\s/g, '-').replace(/[^a-zA-Z0-9.-]/g, '');
        const filename = `${uniqueSuffix}-${sanitizedOriginalName}`;
        cb(null, filename);
      },
    }),
    fileFilter: (req, file, cb) => {
      // Aceptar solo archivos zip o rar
      cb(null, true);  // Acepta cualquier archivo sda
    },
  }))
  create(@UploadedFile() file: Express.Multer.File, @Body() createRareDto: CreateRareDto) {
    return this.raresService.create(createRareDto, file.filename);
  }

  @Get('download/:nombre/:filename')
  downloadFile(@Param('nombre') nombre: string, @Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(cwd(), './uploads', nombre, filename);
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error(err);
        return res.status(404).send('File not found');
      }
    });
  }

  @Get()
  findAll() {
    return this.raresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.raresService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRareDto: UpdateRareDto) {
    return this.raresService.update(+id, updateRareDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.raresService.remove(+id);
  }
}
