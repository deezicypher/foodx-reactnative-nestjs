import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity('refresh_tokens')
@Index(['tokenHash'],{unique: true})
@Index(['userId'])
@Index(['familyId'])
export class RefreshToken{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    tokenHash: string;

    @Column()
    userId: string;

    @Column()
    familyId: string;

    @Column({type: 'timestamp'})
    expiresAt: Date;

    @Column({type: 'timestamp'})
    familyExpiresAt: Date;

    @Column({type: 'timestamp', nullable:true})
    usedAt: Date | null;

    @Column({type: 'timestamp', nullable:true})
    revokedAt: Date | null;

    @ManyToOne(() => User, user => user.refreshTokens,{onDelete:'CASCADE'})
    @JoinColumn()
    user: User;

    @CreateDateColumn()
    createdAt: Date;

}