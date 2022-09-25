import { UserRole } from 'src/auth/dto/auth.dto';
import { Produk } from 'src/produk/entities/produk.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nama_user: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ onUpdate: 'CURRENT_TIMESTAMP(6)' })
  updated_at: Date;

  @OneToMany(() => Produk, (produk) => produk.id)
  produk: Produk[];

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.User,
  })
  role: UserRole;
}
