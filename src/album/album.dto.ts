/* eslint-disable prettier/prettier */
import { IsString, IsDateString, IsNotEmpty } from 'class-validator';

export class AlbumDto {

    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsDateString()
    @IsNotEmpty()
    readonly releaseDate: Date;

    @IsString()
    @IsNotEmpty()
    readonly cover: string;

    @IsString()
    @IsNotEmpty()
    readonly description: string;

}
