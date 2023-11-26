/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty } from 'class-validator';

export class PerformerDto {

    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly image: string;

    @IsString()
    @IsNotEmpty()
    readonly description: string;

}
