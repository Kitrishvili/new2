import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import path from 'app-root-path';
import { PrismaService } from 'src/app.service';

@Module({
  imports:[
    ServeStaticModule.forRoot({
      rootPath: `${path}/uploads`,
      serveRoot: '/uploads'
    })
  ],
  controllers: [FileController],
  providers: [FileService, PrismaService],
})
export class FileModule {}
