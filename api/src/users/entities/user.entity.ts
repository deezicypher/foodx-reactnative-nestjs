import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RefreshToken } from "../../auth/entities/refresh-token.entity";
import { EmailVerificationChallenge } from "../../auth/entities/email-verification-challenge.entity";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({default:false})
    isEmailVerified: boolean;

    @Column()
    password: string;

    @Column({type:"varchar", unique: true, nullable:true})
    pendingEmail: string | null;

    @OneToMany(() => RefreshToken, token => token.user)
    refreshTokens: RefreshToken[];

    @OneToMany(() => EmailVerificationChallenge, challenge => challenge.user)
    verificationChallenges: EmailVerificationChallenge[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
