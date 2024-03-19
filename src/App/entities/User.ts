import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export default class User {
    @PrimaryGeneratedColumn('increment')
    id!: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 11, unique: true })
    cpf: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    constructor(name: string, email: string, cpf: string, password: string) {
        this.name = name,
        this.email = email,
        this.cpf = cpf,
        this.password = password
    }
}
