import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsDate, IsInt, IsString, IsNotEmpty, IsDateString, IsEmpty, IsOptional, IsBoolean } from 'class-validator';

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @IsString()
    @Column('text')
    name: string;

    @IsNotEmpty()
    @IsDate()
    @Column('date')
    dueDate: Date;

    @IsOptional()
    @IsInt()
    @Column({
        type: 'int',
        nullable: true,
    })
    position: number;

    @IsOptional()
    @IsBoolean()
    @Column({
        type: 'boolean',
        default: false,
    })
    completed: boolean;

    @CreateDateColumn()
    dateCreated: Date;

    @UpdateDateColumn()
    dateUpdated: Date;
}