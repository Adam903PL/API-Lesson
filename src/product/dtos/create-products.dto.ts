import { Expose } from "class-transformer";
import { IsString, IsNumber, IsPositive, Max, MinLength, IsNotEmpty } from "class-validator";

export class CreateProductsDTO {
    @IsNotEmpty({ message: "Pole jest wymagane" })
    @IsString()
    @MinLength(3,{message:"Nazwa musi mieć 3 znaki"})
    @Expose()
    name!: string;

    @IsNotEmpty({ message: "Cena jest wymagana" })
    @IsNumber()
    @IsPositive({ message: "Cena musi być liczbą dodatnią" })
    @Max(10000,{message:"Maxymalna cena do 10k"})
    @Expose()
    price!: number;

    @IsNotEmpty({ message: "Stan magazynowy jest wymagany" })
    @IsNumber()
    @MinLength(0, { message: "Stan magazynowy nie może być ujemny" })
    @Expose()
    stock!: number;
}
