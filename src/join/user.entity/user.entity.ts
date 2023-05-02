import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
  
@Entity('user')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    name: string;
  
    @Column()
    position: string;
  
    @Column()
    email: string;
  
    @Column()
    password: string;
  
    @Column()
    contact: string;
  
    @Column({ nullable: true })
    img_url: string;
  
    @Column()
    field: string;
  
    @Column()
    tendency: string;
  
    @Column({ nullable: true })
    intro: string;
  
    @Column({ nullable: true })
    skills: string;
  
    @Column({ type: 'int' })
    like: number;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
}
  