import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from "typeorm";
import * as bcrypt from "bcrypt";

@Entity({ name: "cliente" })
export class Cliente {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "text" }) // Defina o tipo da coluna como "text" para armazenar a imagem em base64
    imagem: string; // Campo para armazenar a imagem em formato de texto



}
