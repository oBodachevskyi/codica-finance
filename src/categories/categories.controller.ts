import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CategoryEntity } from './category.entity';
import { CreateCategoryDto } from './dto/categoriesOperationsType.dto';

@ApiTags('categories')
@Controller('api/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  //get all categories
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all categories',
    type: [CategoryEntity],
  })
  async findAll(): Promise<{ categories: CategoryEntity[] }> {
    const categories = await this.categoriesService.findAll();
    return {
      categories,
    };
  }

  //get category by id
  @Get(':id')
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 200,
    description: 'Get category by Id',
    type: CategoryEntity,
  })
  async findOne(@Param('id') id: string): Promise<CategoryEntity> {
    return this.categoriesService.findOne(+id);
  }

  //create new category
  @Post()
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({
    status: 201,
    description: 'Create new category',
    type: CategoryEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed! or Error with DB',
  })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() category: CreateCategoryDto) {
    return this.categoriesService.create(category);
  }

  //update category
  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Update currently category',
    type: CategoryEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed! or Error with DB',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  async update(@Param('id') id: string, @Body() category: CreateCategoryDto) {
    return this.categoriesService.update(+id, category);
  }

  //delete category
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Category succsessfuly deleted',
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot delete category with transactions or Error with DB',
  })
  async delete(@Param('id') id: string): Promise<void> {
    return await this.categoriesService.delete(+id);
  }
}
