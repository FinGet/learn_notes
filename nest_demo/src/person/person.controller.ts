import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('api/person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Post()
  create(@Body() createPersonDto: CreatePersonDto) {
    return `This action adds a new person with name: ${createPersonDto.name}`;
  }

  @Get('find') // http://localhost:3300/api/person/find?name=John&age=20
  query(@Query('name') name: string, @Query('age') age: number) {
    return `This action returns all persons with name: ${name} and age: ${age}`;
  }

  @Get(':id') // http://localhost:3300/api/person/1
  urlParam(@Param('id') id: string) {
    return `This action returns a #${id} person`;
  }

  @Post('file')
  @UseInterceptors(
    AnyFilesInterceptor({
      dest: 'uploads/', // 上传文件的保存目录
    }),
  )
  uploadFile(
    @Body() createPersonDto: CreatePersonDto, // 用 @Body 装饰器接收请求体
    @UploadedFiles() files: Array<Express.Multer.File>, // 用 @UploadedFiles 装饰器接收上传的文件
  ) {
    console.log(files);
    return `received: ${JSON.stringify(createPersonDto)}`;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto) {
    return this.personService.update(+id, updatePersonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personService.remove(+id);
  }
}
