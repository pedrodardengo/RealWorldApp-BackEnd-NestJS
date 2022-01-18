import {NestFactory} from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {AppModule} from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('Real World App')
        .setDescription('This a Real World App implementation with NestJS')
        .setVersion('0.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    app.setGlobalPrefix('api');
    await app.listen(3000);
}

bootstrap().then();
