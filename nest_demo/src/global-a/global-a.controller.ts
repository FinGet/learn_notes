import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GlobalAService } from './global-a.service';
import { CreateGlobalADto } from './dto/create-global-a.dto';
import { UpdateGlobalADto } from './dto/update-global-a.dto';

@Controller('global-a')
export class GlobalAController {
  constructor(private readonly globalAService: GlobalAService) {}

  @Post()
  create(@Body() createGlobalADto: CreateGlobalADto) {
    return this.globalAService.create(createGlobalADto);
  }

  @Get()
  findAll() {
    return this.globalAService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.globalAService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGlobalADto: UpdateGlobalADto) {
    return this.globalAService.update(+id, updateGlobalADto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.globalAService.remove(+id);
  }
}
