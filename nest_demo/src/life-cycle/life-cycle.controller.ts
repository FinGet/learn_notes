import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LifeCycleService } from './life-cycle.service';
import { CreateLifeCycleDto } from './dto/create-life-cycle.dto';
import { UpdateLifeCycleDto } from './dto/update-life-cycle.dto';

@Controller('life-cycle')
export class LifeCycleController {
  constructor(private readonly lifeCycleService: LifeCycleService) {}

  @Post()
  create(@Body() createLifeCycleDto: CreateLifeCycleDto) {
    return this.lifeCycleService.create(createLifeCycleDto);
  }

  @Get()
  findAll() {
    return this.lifeCycleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lifeCycleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLifeCycleDto: UpdateLifeCycleDto) {
    return this.lifeCycleService.update(+id, updateLifeCycleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lifeCycleService.remove(+id);
  }
}
