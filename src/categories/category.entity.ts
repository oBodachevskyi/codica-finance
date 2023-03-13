import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'categories' })
export class CategoryEntity {
  @ApiProperty({ required: false })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  @Length(1, 20)
  name: string;
}
